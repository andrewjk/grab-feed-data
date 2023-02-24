import * as txml from "txml";
import FeedLink from "../types/FeedLink";
import TxmlNode from "../types/TxmlNode";

/** Grab available feeds from a HTML page by checking for links with rel="alternate" */
export default function grabFeedLinks(html: string): FeedLink[] {
  const result: FeedLink[] = [];

  // TODO: Only check for links in the <head> as rel="alternate" is not body-ok
  const doc = txml.parse(html);
  for (let node of doc) {
    processNode(node, result);
  }

  return result;
}

function processNode(node: TxmlNode, result: FeedLink[]) {
  // Is it a `link` node with rel="alternate"?
  if (
    node.tagName === "link" &&
    node.attributes &&
    node.attributes["rel"] === "alternate"
  ) {
    // We need at least type and href
    let type = node.attributes["type"];
    const href = node.attributes["href"];

    // TODO: Is this a valid assumption for all feeds? Or are there other (potentially messed up) types out there?
    switch (type) {
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
        type = undefined;
        break;
      }
    }

    if (type && href) {
      const link: FeedLink = {
        type,
        href,
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
      // @ts-ignore
      if (child.tagName) {
        processNode(child as TxmlNode, result);
      }
    }
  }
}
