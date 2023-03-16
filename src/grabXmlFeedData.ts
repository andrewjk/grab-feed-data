import { grabXml, type XmlNode, XmlNodeType } from "grab-xml";
import FeedData from "../types/FeedData";
import EntryData from "../types/EntryData";
import PersonData from "../types/PersonData";
import ImageData from "../types/ImageData";

/** Grab metadata and entries from an RSS or Atom feed file */
export default function grabXmlFeedData(content: string): FeedData {
  const doc = grabXml(content);
  const result: FeedData = {
    type: "unknown",
    title: "",
    entries: [],
  };
  const namespaces = [];
  processChildNodes(doc.children, result, namespaces);
  return result;
}

function processChildNodes(
  children: XmlNode[],
  feed: FeedData,
  namespaces: string[]
) {
  for (let child of children) {
    if (child.type === XmlNodeType.ELEMENT) {
      processNode(child, feed, namespaces);
    }
  }
}

function processNode(node: XmlNode, feed: FeedData, namespaces: string[]) {
  // Maybe add namespaces to the collection
  checkNamespace(node, namespaces);

  if (node.tag === "channel") {
    // It's an RSS feed
    feed.type = "rss";
    processFeedNode(node, feed, namespaces);
  } else if (node.tag === "feed") {
    // It's an Atom feed
    feed.type = "atom";
    if (node.attributes["xml:lang"]) {
      feed.language = node.attributes["xml:lang"];
    }
    processFeedNode(node, feed, namespaces);
  } else if (node.tag === "image") {
    // Apparently RSS1 could have its image alongside the channel
    feed.image = {};
    processImageNode(node, namespaces, feed.image);
  } else {
    // Keep going...
    processChildNodes(node.children, feed, namespaces);
  }
}

function processFeedNode(
  feedNode: XmlNode,
  feed: FeedData,
  namespaces: string[]
) {
  for (let node of feedNode.children) {
    if (node.type === XmlNodeType.ELEMENT) {
      const tag = node.tag.toLowerCase();
      switch (tag) {
        case "title": {
          feed.title = getContentString(node, namespaces);
          break;
        }
        case "description":
        case "subtitle": {
          feed.description = getContentString(node, namespaces);
          break;
        }
        case "link":
        case "atom:link": {
          // For RSS the link is the text, for Atom it's the value of `href` in an element with rel="alternate"
          if (feed.type === "atom" || tag === "atom:link") {
            const rel = node.attributes["rel"];
            switch (rel) {
              case null:
              case undefined:
              case "alternate": {
                feed.homeUrl = node.attributes["href"];
                break;
              }
              case "self": {
                feed.feedUrl = node.attributes["href"];
                break;
              }
            }
          } else if (feed.type === "rss") {
            feed.homeUrl = getContentString(node, namespaces);
          }
          break;
        }
        case "xmlurl": {
          feed.feedUrl = getContentString(node, namespaces);
          break;
        }
        case "language": {
          feed.language = getContentString(node, namespaces);
          break;
        }
        case "copyright":
        case "rights":
        case "dc:rights": {
          feed.copyright = getContentString(node, namespaces);
          break;
        }
        case "managingeditor": {
          // In RSS, we set the author to the managingEditor field
          feed.author = feed.author || {};
          processPersonText(node, namespaces, feed.author);
          break;
        }
        case "webmaster": {
          // In RSS, we set the author to the webMaster field if there is no managingEditor field
          if (!feed.author) {
            feed.author = {};
            processPersonText(node, namespaces, feed.author);
          }
          break;
        }
        case "dc:creator": {
          // In RSS, this is often used to supply a name rather than an email
          // But let's put it in contributors as we don't know whether it will be matched to the author
          feed.contributors = feed.contributors || [];
          feed.contributors.push({
            name: getContentString(node, namespaces),
          });
          break;
        }
        case "author": {
          feed.author = feed.author || {};
          processPersonNode(node, namespaces, feed.author);
          break;
        }
        case "contributor": {
          feed.contributors = feed.contributors || [];
          const contributor = {};
          processPersonNode(node, namespaces, contributor);
          feed.contributors.push(contributor);
          break;
        }
        case "lastbuilddate":
        case "updated": {
          feed.updatedAt = getContentString(node, namespaces);
          break;
        }
        //case "pubdate":
        //case "published": {
        //  feed.publishedAt = getContentString(node, namespaces);
        //  break;
        //}
        case "image": {
          feed.image = {};
          processImageNode(node, namespaces, feed.image);
          break;
        }
        case "logo": {
          feed.image = {
            url: getContentString(node, namespaces),
          };
          break;
        }
        case "favicon":
        case "icon": {
          feed.icon = getContentString(node, namespaces);
          break;
        }
        case "generator": {
          feed.generator = getContentString(node, namespaces);
          break;
        }
        case "category": {
          feed.categories = feed.categories || [];
          if (feed.type === "rss") {
            feed.categories.push(getContentString(node, namespaces));
          } else if (feed.type === "atom") {
            if (node.attributes["term"]) {
              feed.categories.push(node.attributes["term"]);
            }
          }
          break;
        }
        case "item":
        case "entry": {
          // In Atom, check for xml:lang if the feed's language hasn't been set
          if (
            feed.type === "atom" &&
            !feed.language &&
            node.attributes["xml:lang"]
          ) {
            feed.language = node.attributes["xml:lang"];
          }

          // Process the entry
          const entry = {};
          feed.entries.push(entry);
          processEntryNode(node, feed, namespaces, entry);

          break;
        }
      }
    }
  }
}

function processEntryNode(
  entryNode: XmlNode,
  feed: FeedData,
  namespaces: string[],
  entry: EntryData
) {
  for (let node of entryNode.children) {
    if (node.type === XmlNodeType.ELEMENT) {
      const tag = node.tag.toLowerCase();
      switch (tag) {
        case "title": {
          entry.title = getContentString(node, namespaces);
          break;
        }
        case "summary": {
          entry.summary = getContentString(node, namespaces);
          break;
        }
        case "description":
        case "content":
        case "content:encoded": {
          if (
            feed.type === "rss" &&
            entry.content &&
            !entry.summary &&
            tag === "content:encoded"
          ) {
            // HACK: If this is the content:encoded tag, we should move the existing description into the summary
            // This assumes that content:encoded comes after description, which may not be a valid assumption
            entry.summary = entry.content;
          }

          // HACK: Assume that all RSS description and content is encoded
          const withHtml = feed.type === "rss";
          entry.content = getContentString(
            node,
            namespaces,
            withHtml || undefined
          );

          // Default the content text by stripping out HTML
          if (!entry.contentText) {
            entry.contentText = getContentString(node, namespaces, false);
          }

          // In Atom, check for xml:lang if the feed's language hasn't been set
          if (
            feed.type === "atom" &&
            !feed.language &&
            node.attributes["xml:lang"]
          ) {
            feed.language = node.attributes["xml:lang"];
          }

          break;
        }
        case "link": {
          // For RSS the link is the text, for Atom it's the value of `href` in an element with rel="alternate"
          if (feed.type === "rss") {
            entry.entryUrl = getContentString(node, namespaces);
          } else if (feed.type === "atom") {
            const rel = node.attributes["rel"];
            switch (rel) {
              case null:
              case undefined:
              case "alternate":
              case "self": {
                entry.entryUrl = node.attributes["href"];
                break;
              }
              case "replies": {
                entry.commentsUrl = node.attributes["href"];
                break;
              }
              case "enclosure": {
                entry.attachments = entry.attachments || [];
                entry.attachments.push({
                  url: node.attributes["href"],
                  type: node.attributes["type"],
                  length: parseInt(node.attributes["length"]),
                });
                break;
              }
            }
          }
          break;
        }
        //case "externalLink": {
        //  entry.externalUrl = getContentString(node, namespaces);
        //  break;
        //}
        //case "permalink": {
        //  entry.permalink = getContentString(node, namespaces);
        //  break;
        //}
        case "author": {
          // For RSS the author is the text, for Atom it's an element
          entry.author = {};
          if (feed.type === "rss") {
            processPersonText(node, namespaces, entry.author);
          } else if (feed.type === "atom") {
            processPersonNode(node, namespaces, entry.author);
          }
          break;
        }
        case "dc:creator": {
          // In RSS, this is often used to supply a name rather than an email
          // But let's put it in contributors as we don't know whether it will be matched to the author
          entry.contributors = entry.contributors || [];
          entry.contributors.push({
            name: getContentString(node, namespaces),
          });
          break;
        }
        case "contributor": {
          entry.contributors = entry.contributors || [];
          const contributor = {};
          processPersonNode(node, namespaces, contributor);
          entry.contributors.push(contributor);
          break;
        }
        case "updated": {
          entry.updatedAt = getContentString(node, namespaces);
          break;
        }
        case "pubdate":
        case "published": {
          entry.publishedAt = getContentString(node, namespaces);
          break;
        }
        case "guid":
        case "id": {
          entry.guid = getContentString(node, namespaces);
          break;
        }
        case "comments": {
          entry.commentsUrl = getContentString(node, namespaces);
          break;
        }
        case "image": {
          // HACK: This is not an official part of the spec, but I'm including it here just in case?
          entry.image = {};
          processImageNode(node, namespaces, entry.image);
          break;
        }
        case "category": {
          entry.categories = entry.categories || [];
          if (feed.type === "rss") {
            entry.categories.push(getContentString(node, namespaces));
          } else if (feed.type === "atom") {
            if (node.attributes["term"]) {
              entry.categories.push(node.attributes["term"]);
            }
          }
          break;
        }
        case "source": {
          entry.source = {
            url: node.attributes["url"],
            title: getContentString(node, namespaces),
          };
          break;
        }
        case "enclosure": {
          entry.attachments = entry.attachments || [];
          entry.attachments.push({
            url: node.attributes["url"],
            type: node.attributes["type"],
            length: parseInt(node.attributes["length"]),
          });
          break;
        }
      }
    }
  }
}

function processImageNode(
  imageNode: XmlNode,
  namespaces: string[],
  image: ImageData
) {
  for (let node of imageNode.children) {
    if (node.type === XmlNodeType.ELEMENT) {
      switch (node.tag.toLowerCase()) {
        case "url": {
          image.url = getContentString(node, namespaces);
          break;
        }
        case "title": {
          image.title = getContentString(node, namespaces);
          break;
        }
        case "height": {
          image.height = parseInt(getContentString(node, namespaces));
          break;
        }
        case "width": {
          image.width = parseInt(getContentString(node, namespaces));
          break;
        }
      }
    }
  }
}

function processPersonText(
  personNode: XmlNode,
  namespaces: string[],
  person: PersonData
) {
  const nameOrEmail = getContentString(personNode, namespaces);
  if (nameOrEmail.includes("@")) {
    person.email = nameOrEmail;
  } else {
    person.name = nameOrEmail;
  }
}

function processPersonNode(
  personNode: XmlNode,
  namespaces: string[],
  person: PersonData
) {
  for (let node of personNode.children) {
    if (node.type === XmlNodeType.ELEMENT) {
      switch (node.tag.toLowerCase()) {
        case "name": {
          person.name = getContentString(node, namespaces);
          break;
        }
        case "uri": {
          person.url = getContentString(node, namespaces);
          break;
        }
        case "email": {
          person.email = getContentString(node, namespaces);
          break;
        }
      }
    }
  }
}

function getContentString(
  node: XmlNode,
  namespaces: string[],
  withHtml?: boolean
): string {
  const nodeType = node.attributes["type"];
  if (withHtml === undefined) {
    withHtml = nodeType === "html" || nodeType === "xhtml";
  }
  if (nodeType === "xhtml") {
    // Strip out the namespaces
    // NOTE: Should this be part of grab-xml?
    stripNamespaces(node, namespaces);
  }
  let content = withHtml ? node.innerXml() : node.content();
  return content.trim();
}

function checkNamespace(node: XmlNode, namespaces: string[]) {
  const xmlns = Object.keys(node.attributes).find((a) =>
    a.startsWith("xmlns:")
  );
  if (xmlns) {
    namespaces.push(xmlns.substring(6));
  }
}

function stripNamespaces(node: XmlNode, namespaces: string[]) {
  checkNamespace(node, namespaces);

  if (node.type === XmlNodeType.ELEMENT && node.tag.includes(":")) {
    const pos = node.tag.indexOf(":");
    if (pos !== -1 && namespaces.includes(node.tag.substring(0, pos))) {
      node.tag = node.tag.substring(pos + 1);
    }
  }

  for (let child of node.children) {
    stripNamespaces(child, namespaces);
  }
}

/*
function getContentString(node: XmlNode, withHtml?: boolean): string {
  let content = "";

  if (withHtml === undefined) {
    const nodeType = node.attributes["type"];
    withHtml = nodeType === "html" || nodeType === "xhtml";
  }

  node.children.forEach((child, i) => {
    if (typeof child === "string") {
      // Trim the start of the first child and the end of the last child, but leave middle children alone
      // This means that spaces between elements will be preserved but newlines etc will be removed from the start and end
      let childContent = child;
      if (i === 0) {
        childContent = childContent.trimStart();
      }
      if (i === node.children.length - 1) {
        childContent = childContent.trimEnd();
      }
      content += childContent;
    } else {
      child = child as XmlNode;
      if (withHtml) {
        content += "<";
        content += child.tag;
        Object.entries(child.attributes).forEach(([name, value]) => {
          content += " ";
          content += name;
          content += '="';
          content += value;
          content += '"';
        });
        content += ">";
      }
      content += getContentString(child, withHtml);
      if (withHtml) {
        content += "</";
        content += child.tag;
        content += ">";
      }
    }
  });

  // Unescape basic HTML
  content = content
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&");

  return content;
}
*/
/*
function getContentString(node: XmlNode, withHtml = false): string {
  let content = "";
  node.children.forEach((child, i) => {
    if (typeof child === "string") {
      // Trim the start of the first child and the end of the last child, but leave middle children alone
      // This means that spaces between elements will be preserved but newlines etc will be removed from the start and end
      let childContent = child;
      if (i === 0) {
        childContent = childContent.trimStart();
      }
      if (i === node.children.length - 1) {
        childContent = childContent.trimEnd();
      }
      content += childContent;
    } else {
      child = child as XmlNode;
      if (withHtml) {
        content += "<";
        content += child.tag;
        Object.entries(child.attributes).forEach(([name, value]) => {
          content += " ";
          content += name;
          content += '="';
          content += value;
          content += '"';
        });
        content += ">";
      }
      content += getContentString(child, withHtml);
      if (withHtml) {
        content += "</";
        content += child.tag;
        content += ">";
      }
    }
  });
  return content;
}
*/
