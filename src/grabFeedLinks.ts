import FeedLink from "../types/FeedLink";
import { grabXml, XmlNode } from "grab-xml";

/** Grab available feeds from a HTML page by checking for links with rel="alternate" */
export default function grabFeedLinks(html: string): FeedLink[] {
  const result: FeedLink[] = [];

  // TODO: Only check for links in the <head> as rel="alternate" is not body-ok
  const doc = grabXml(html);
  for (let node of doc.children) {
    processNode(node, result);
  }

  return result;
}

function processNode(node: XmlNode, result: FeedLink[]) {
  // Is it a `link` node with rel="alternate"?
  if (
    node.tag === "link" &&
    node.attributes &&
    node.attributes["rel"] === "alternate"
  ) {
    // We need at least type and href
    let nodeType = node.attributes["type"];
    const url = node.attributes["href"];

    // TODO: Is this a valid assumption for all feeds? Or are there other (potentially messed up) types out there?
    let type: "unknown" | "rss" | "atom" | "json";
    switch (nodeType) {
      case "application/rss":
      case "application/rss+xml": {
        type = "rss";
        break;
      }
      case "application/atom":
      case "application/atom+xml": {
        type = "atom";
        break;
      }
      case "application/json":
      case "application/feed+json": {
        type = "json";
        break;
      }
      default: {
        type = "unknown";
        break;
      }
    }

    if (type && url) {
      const link: FeedLink = {
        type,
        url,
      };
      const title = node.attributes["title"];
      if (title) {
        link.title = title;
      }
      result.push(link);
    }
  }

  // Process this node's children
  if (node.children) {
    for (let child of node.children) {
      processNode(child, result);
    }
  }
}
