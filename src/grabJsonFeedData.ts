import EntryData from "../types/EntryData";
import FeedData from "../types/FeedData";

/** Grab metadata and entries from an RSS or Atom feed file */
export default function grabJsonFeedData(content: string): FeedData {
  const result: FeedData = {
    type: "json",
    title: "",
    entries: [],
  };

  const doc = JSON.parse(content);
  processFeed(doc, result);

  return result;
}

function processFeed(obj: any, feed: FeedData) {
  if (obj.title) {
    feed.title = obj.title;
  }
  if (obj.home_page_url) {
    feed.link = obj.home_page_url;
  }
  if (obj.items && Array.isArray(obj.items)) {
    for (let entryObj of obj.items) {
      const entry = {
        title: "",
      };
      feed.entries.push(entry);
      processEntry(entryObj, entry);
    }
  }
}

function processEntry(obj: any, entry: EntryData) {
  if (obj.title) {
    entry.title = obj.title;
  }
  if (obj.content_html) {
    entry.content = obj.content_html;
  }
  if (obj.content_text) {
    if (!entry.content) {
      entry.content = obj.content_text;
    }
  }
  if (obj.url) {
    entry.link = obj.url;
  }
  if (obj.id) {
    entry.guid = obj.id;
  }
}
