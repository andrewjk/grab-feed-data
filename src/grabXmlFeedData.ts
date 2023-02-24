import { parse } from "txml";
import AuthorData from "../types/AuthorData";
import EntryData from "../types/EntryData";
import FeedData from "../types/FeedData";
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
  //for (let node of doc) {
  //  if (nodeIsElement(node)) {
  //    processNode(node as TxmlNode, result);
  //  }
  //}
  processChildNodes(doc, result, processNode);

  return result;
}

// TODO: Should we be stricter here??

function processNode(node: TxmlNode, result: FeedData) {
  if (node.tagName === "channel") {
    // It's an RSS feed
    result.type = "rss";
    processFeedNode(node, result);
  } else if (node.tagName === "feed") {
    // It's an Atom feed
    result.type = "atom";
    processFeedNode(node, result);
  } else {
    // Keep going...
    processChildNodes(node.children, result, processNode);
  }
}

function processFeedNode(feedNode: TxmlNode, feed: FeedData) {
  for (let node of feedNode.children) {
    if (nodeIsElement(node)) {
      node = node as TxmlNode;
      switch (node.tagName) {
        case "title": {
          feed.title = getContentString(node);
          break;
        }
        case "description":
        case "subtitle": {
          feed.description = getContentString(node);
          break;
        }
        case "link": {
          // For RSS the link is the text, for Atom it's the value of `href` in an element with rel="alternate"
          if (feed.type === "rss") {
            feed.link = getContentString(node);
          } else if (feed.type === "atom") {
            if (node.attributes["rel"] === "alternate") {
              feed.link = node.attributes["href"];
            }
          }
          break;
        }
        case "xmlUrl": {
          feed.xmlUrl = getContentString(node);
          break;
        }
        case "date":
        case "updated": {
          feed.date = getContentString(node);
          break;
        }
        case "pubDate":
        case "published": {
          feed.pubDate = getContentString(node);
          break;
        }
        case "author": {
          // For RSS the author is the text, for Atom it's an element
          if (feed.type === "rss") {
            feed.author = {
              name: getContentString(node),
            };
          } else if (feed.type === "atom") {
            const author = {
              name: "",
            };
            feed.author = author;
            processAuthorNode(node, author);
          }
          break;
        }
        case "language": {
          feed.language = getContentString(node);
          break;
        }
        case "image": {
          feed.image = getContentString(node);
          break;
        }
        case "favicon": {
          feed.favicon = getContentString(node);
          break;
        }
        case "copyright":
        case "rights": {
          feed.copyright = getContentString(node);
          break;
        }
        case "generator": {
          feed.generator = getContentString(node);
          break;
        }
        //case "categories": {
        //  feed.categories = getContentString(node);
        //  break;
        //}
        case "item":
        case "entry": {
          const entry = {
            title: "",
          };
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
      switch (node.tagName) {
        case "title": {
          entry.title = getContentString(node);
          break;
        }
        case "description":
        case "content": {
          entry.content = getContentString(node);
          break;
        }
        case "summary": {
          entry.summary = getContentString(node);
          break;
        }
        case "link": {
          // For RSS the link is the text, for Atom it's the value of `href` in an element with rel="alternate"
          if (feed.type === "rss") {
            entry.link = getContentString(node);
          } else if (feed.type === "atom") {
            if (node.attributes["rel"] === "alternate") {
              entry.link = node.attributes["href"];
            }
          }
          break;
        }
        case "originalLink": {
          entry.originalLink = getContentString(node);
          break;
        }
        case "permaLink": {
          entry.permaLink = getContentString(node);
          break;
        }
        case "date":
        case "updated": {
          entry.date = getContentString(node);
          break;
        }
        case "pubDate":
        case "published": {
          entry.pubDate = getContentString(node);
          break;
        }
        case "author": {
          // For RSS the author is the text, for Atom it's an element
          if (feed.type === "rss") {
            entry.author = {
              name: getContentString(node),
            };
          } else if (feed.type === "atom") {
            const author = {
              name: "",
            };
            entry.author = author;
            processAuthorNode(node, author);
          }
          break;
          break;
        }
        case "guid":
        case "id": {
          entry.guid = getContentString(node);
          break;
        }
        case "comments": {
          entry.comments = getContentString(node);
          break;
        }
        //case "image": {
        //  entry.image = getContentString(node);
        //  break;
        //}
        //case "categories": {
        //  entry.categories = getContentString(node);
        //  break;
        //}
        //case "source": {
        //  entry.source = getContentString(node);
        //  break;
        //}
        //case "enclosures": {
        //  entry.enclosures = getContentString(node);
        //  break;
        //}
      }
    }
  }
}

function processAuthorNode(authorNode: TxmlNode, author: AuthorData) {
  for (let node of authorNode.children) {
    if (nodeIsElement(node)) {
      node = node as TxmlNode;
      switch (node.tagName) {
        case "name": {
          author.name = getContentString(node);
          break;
        }
        case "uri": {
          author.uri = getContentString(node);
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

function processChildNodes(
  children: (TxmlNode | string)[],
  result: FeedData,
  processFunction: (node: TxmlNode, result: FeedData) => void
) {
  for (let child of children) {
    if (nodeIsElement(child)) {
      processFunction(child as TxmlNode, result);
    }
  }
}

function getContentString(node: TxmlNode): string {
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
      content += getContentString(child);
      content += "</";
      content += child.tagName;
      content += ">";
    }
  });
  return content;
}

//function nodeIsText(node: TxmlNode | string) {
//  return typeof node === "string";
//}

function nodeIsElement(node: TxmlNode | string) {
  return typeof node === "object";
}
