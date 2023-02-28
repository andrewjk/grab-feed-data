import { parse } from "txml";
import FeedData from "../types/FeedData";
import EntryData from "../types/EntryData";
import PersonData from "../types/PersonData";
import ImageData from "../types/ImageData";
import TxmlNode from "../types/TxmlNode";

/** Grab metadata and entries from an RSS or Atom feed file */
export default function grabXmlFeedData(content: string): FeedData {
  const result: FeedData = {
    type: "unknown",
    title: "",
    entries: [],
  };

  const doc: (TxmlNode | string)[] = parse(content, {
    keepWhitespace: true,
    noChildNodes: [],
  });

  processChildNodes(doc, result);

  return result;
}

function processChildNodes(children: (TxmlNode | string)[], feed: FeedData) {
  for (let child of children) {
    if (nodeIsElement(child)) {
      processNode(child as TxmlNode, feed);
    }
  }
}

function processNode(node: TxmlNode, feed: FeedData) {
  if (node.tagName === "channel") {
    // It's an RSS feed
    feed.type = "rss";
    processFeedNode(node, feed);
  } else if (node.tagName === "feed") {
    // It's an Atom feed
    feed.type = "atom";
    if (node.attributes["xml:lang"]) {
      feed.language = node.attributes["xml:lang"];
    }
    processFeedNode(node, feed);
  } else if (node.tagName === "image") {
    // Apparently RSS1 could have its image alongside the channel
    feed.image = {};
    processImageNode(node, feed.image);
  } else {
    // Keep going...
    processChildNodes(node.children, feed);
  }
}

function processFeedNode(feedNode: TxmlNode, feed: FeedData) {
  for (let node of feedNode.children) {
    if (nodeIsElement(node)) {
      node = node as TxmlNode;
      const tagName = node.tagName.toLowerCase();
      switch (tagName) {
        case "title": {
          feed.title = getContentString(node);
          break;
        }
        case "description":
        case "subtitle": {
          feed.description = getContentString(node);
          break;
        }
        case "link":
        case "atom:link": {
          // For RSS the link is the text, for Atom it's the value of `href` in an element with rel="alternate"
          if (feed.type === "atom" || tagName === "atom:link") {
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
            feed.homeUrl = getContentString(node);
          }
          break;
        }
        case "xmlurl": {
          feed.feedUrl = getContentString(node);
          break;
        }
        case "language": {
          feed.language = getContentString(node);
          break;
        }
        case "copyright":
        case "rights":
        case "dc:rights": {
          feed.copyright = getContentString(node);
          break;
        }
        case "managingeditor": {
          // In RSS, we set the author to the managingEditor field
          feed.author = feed.author || {};
          feed.author.email = getContentString(node);
          break;
        }
        case "webmaster": {
          // In RSS, we set the author to the webMaster field if there is no managingEditor field
          feed.author = feed.author || {};
          if (!feed.author.email) {
            feed.author.email = getContentString(node);
          }
          break;
        }
        case "dc:creator": {
          // In RSS, this is often used to supply a name rather than an email
          feed.author = feed.author || {};
          feed.author.name = getContentString(node);
          break;
        }
        case "author": {
          feed.author = feed.author || {};
          processPersonNode(node, feed.author);
          break;
        }
        case "contributor": {
          feed.contributors = feed.contributors || [];
          const contributor = {};
          processPersonNode(node, contributor);
          feed.contributors.push(contributor);
          break;
        }
        case "lastbuilddate":
        case "updated": {
          feed.updatedAt = getContentString(node);
          break;
        }
        case "pubdate":
        case "published": {
          feed.publishedAt = getContentString(node);
          break;
        }
        case "image": {
          feed.image = {};
          processImageNode(node, feed.image);
          break;
        }
        case "logo": {
          feed.image = {
            url: getContentString(node),
          };
          break;
        }
        case "favicon": {
          feed.icon = getContentString(node);
          break;
        }
        case "generator": {
          feed.generator = getContentString(node);
          break;
        }
        case "category": {
          feed.categories = feed.categories || [];
          if (feed.type === "rss") {
            feed.categories.push(getContentString(node));
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
          processEntryNode(node, feed, entry);

          break;
        }
      }
    }
  }
}

function processEntryNode(
  entryNode: TxmlNode,
  feed: FeedData,
  entry: EntryData
) {
  for (let node of entryNode.children) {
    if (nodeIsElement(node)) {
      node = node as TxmlNode;
      const tagName = node.tagName.toLowerCase();
      switch (tagName) {
        case "title": {
          entry.title = getContentString(node);
          break;
        }
        case "summary": {
          entry.summary = getContentString(node);
          break;
        }
        case "description":
        case "content":
        case "content:encoded": {
          if (
            feed.type === "rss" &&
            entry.content &&
            !entry.summary &&
            tagName === "content:encoded"
          ) {
            // HACK: If this is the content:encoded tag, we should move the existing description into the summary
            // This assumes that content:encoded comes after description, which may not be a valid assumption
            entry.summary = entry.content;
          }

          // HACK: Assume that all RSS description and content is encoded
          const withHtml = feed.type === "rss";
          entry.content = getContentString(node, withHtml || undefined);

          // Default the content text by stripping out HTML
          if (!entry.contentText) {
            entry.contentText = getContentString(node, false);
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
            entry.entryUrl = getContentString(node);
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
        //  entry.externalUrl = getContentString(node);
        //  break;
        //}
        //case "permalink": {
        //  entry.permalink = getContentString(node);
        //  break;
        //}
        case "author": {
          // For RSS the author is the text, for Atom it's an element
          if (feed.type === "rss") {
            entry.author = {
              email: getContentString(node),
            };
          } else if (feed.type === "atom") {
            const author = {
              name: "",
            };
            entry.author = author;
            processPersonNode(node, author);
          }
          break;
        }
        case "contributor": {
          entry.contributors = entry.contributors || [];
          const contributor = {};
          processPersonNode(node, contributor);
          entry.contributors.push(contributor);
          break;
        }
        case "updated": {
          entry.updatedAt = getContentString(node);
          break;
        }
        case "pubdate":
        case "published": {
          entry.publishedAt = getContentString(node);
          break;
        }
        case "guid":
        case "id": {
          entry.guid = getContentString(node);
          break;
        }
        case "comments": {
          entry.commentsUrl = getContentString(node);
          break;
        }
        case "image": {
          // HACK: This is not an official part of the spec, but I'm including it here just in case?
          entry.image = {};
          processImageNode(node, entry.image);
          break;
        }
        case "category": {
          entry.categories = entry.categories || [];
          if (feed.type === "rss") {
            entry.categories.push(getContentString(node));
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
            title: getContentString(node),
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

function processImageNode(imageNode: TxmlNode, image: ImageData) {
  for (let node of imageNode.children) {
    if (nodeIsElement(node)) {
      node = node as TxmlNode;
      switch (node.tagName.toLowerCase()) {
        case "url": {
          image.url = getContentString(node);
          break;
        }
        case "title": {
          image.title = getContentString(node);
          break;
        }
        case "height": {
          image.height = parseInt(getContentString(node));
          break;
        }
        case "width": {
          image.width = parseInt(getContentString(node));
          break;
        }
      }
    }
  }
}

function processPersonNode(authorNode: TxmlNode, author: PersonData) {
  for (let node of authorNode.children) {
    if (nodeIsElement(node)) {
      node = node as TxmlNode;
      switch (node.tagName.toLowerCase()) {
        case "name": {
          author.name = getContentString(node);
          break;
        }
        case "uri": {
          author.url = getContentString(node);
          break;
        }
        case "email": {
          author.email = getContentString(node);
          break;
        }
      }
    }
  }
}

function getContentString(node: TxmlNode, withHtml?: boolean): string {
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
      child = child as TxmlNode;
      if (withHtml) {
        content += "<";
        content += child.tagName;
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
        content += child.tagName;
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

/*
function getContentString(node: TxmlNode, withHtml = false): string {
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
      child = child as TxmlNode;
      if (withHtml) {
        content += "<";
        content += child.tagName;
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
        content += child.tagName;
        content += ">";
      }
    }
  });
  return content;
}
*/

//function nodeIsText(node: TxmlNode | string) {
//  return typeof node === "string";
//}

function nodeIsElement(node: TxmlNode | string) {
  return typeof node === "object";
}
