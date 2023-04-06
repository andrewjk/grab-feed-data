import { grabXml, XmlNode } from "grab-xml";
import OpmlData from "../types/OpmlData";

/** Grab information and feeds from an OPML file */
export default function grabOpmlData(opml: string): OpmlData {
  const result: OpmlData = {
    feeds: [],
  };

  const doc = grabXml(opml);
  for (let node of doc.children) {
    if (node.tag === "opml") {
      for (let childNode of node.children) {
        if (childNode.tag === "head") {
          for (let headNode of childNode.children) {
            processHeadNode(headNode, result);
          }
        } else if (childNode.tag === "body") {
          //for (let bodyNode of childNode.children) {
          processBodyNode(childNode, result, "");
          //}
        }
      }
    }
  }

  return result;
}

function processHeadNode(node: XmlNode, result: OpmlData) {
  switch (node.tag) {
    case "title": {
      result.title = node.content();
      break;
    }
    case "dateCreated": {
      result.createdAt = node.content();
      break;
    }
    case "dateModified": {
      result.modifiedAt = node.content();
      break;
    }
    case "ownerName": {
      result.ownerName = node.content();
      break;
    }
    case "ownerEmail": {
      result.ownerEmail = node.content();
      break;
    }
  }
}

function processBodyNode(node: XmlNode, result: OpmlData, tag: string) {
  // Is it an `outline` node
  if (node.tag === "outline" && node.attributes) {
    // If it has an xmlUrl attribute, it's a subscription
    // Otherwise, it's a tag (or folder) and all child nodes should have that set
    if (!!node.attributes["xmlUrl"]) {
      // Required attributes
      const type = node.attributes["type"];
      const text = node.attributes["text"];
      const feedUrl = node.attributes["xmlUrl"];

      // Optional attributes
      const webUrl = node.attributes["htmlUrl"];
      const description = node.attributes["description"];
      const language = node.attributes["language"];
      const title = node.attributes["title"];

      if (type && text && feedUrl) {
        // If we already have this feed in the collection, just add a tag
        // Otherwise, add the feed to the collection
        let feed = result.feeds.find((f) => f.feedUrl === feedUrl);
        if (feed) {
          if (tag) {
            feed.tags = feed.tags || [];
            feed.tags.push(tag);
          }
        } else {
          feed = {
            type:
              type === "rss" || type === "atom" || type === "json"
                ? type
                : "unknown",
            text,
            feedUrl,
          };
          if (webUrl) feed.webUrl = webUrl;
          if (description) feed.description = description;
          if (language) feed.language = language;
          if (title) feed.title = title;
          if (tag) {
            feed.tags = feed.tags || [];
            feed.tags.push(tag);
          }
          result.feeds.push(feed);
        }
      }
    } else if (!!node.attributes["text"]) {
      tag = node.attributes["text"];
    }
  }

  // Process this node's children
  if (node.children) {
    for (let child of node.children) {
      processBodyNode(child, result, tag);
    }
  }
}
