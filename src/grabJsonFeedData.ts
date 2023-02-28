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

function processFeed(json: any, feed: FeedData) {
  maybeSetValue(json, "title", feed, "title");
  maybeSetValue(json, "description", feed, "description");
  maybeSetValue(json, "home_page_url", feed, "homeUrl");
  maybeSetValue(json, "feed_url", feed, "feedUrl");
  maybeSetValue(json, "language", feed, "language");

  processAuthors(json, feed);

  if (json.icon) {
    feed.image = {
      url: json.icon,
    };
  }
  maybeSetValue(json, "favicon", feed, "icon");

  if (json.items && Array.isArray(json.items)) {
    for (let entryJson of json.items) {
      const entry = {
        title: "",
      };
      feed.entries.push(entry);
      processEntry(entryJson, entry);
    }
  }
}

function processEntry(json: any, entry: EntryData) {
  maybeSetValue(json, "title", entry, "title");
  maybeSetValue(json, "summary", entry, "summary");
  maybeSetValue(json, "content_html", entry, "content");
  maybeSetValue(json, "content_text", entry, "contentText");
  maybeSetValue(json, "url", entry, "entryUrl");
  maybeSetValue(json, "external_url", entry, "externalUrl");

  processAuthors(json, entry);

  maybeSetValue(json, "date_published", entry, "publishedAt");
  maybeSetValue(json, "date_modified", entry, "updatedAt");
  maybeSetValue(json, "id", entry, "guid");

  if (json.image) {
    entry.image = {
      url: json.image,
    };
  }

  maybeSetValue(json, "tags", entry, "categories");

  if (json.attachments) {
    entry.attachments = entry.attachments || [];
    for (let source of json.attachments) {
      const attachment = {};
      maybeSetValue(source, "url", attachment, "url");
      maybeSetValue(source, "mime_type", attachment, "type");
      maybeSetValue(source, "size_in_bytes", attachment, "length");
      entry.attachments.push(attachment);
    }
  }

  if (entry.content && !entry.contentText) {
    // HACK: This is pretty cheesy
    entry.contentText = entry.content.replace(/<[^>]*>?/gm, "");
  }
}

function processAuthors(json: any, target: Record<string, any>) {
  // NOTE: Author is deprecated, but may still be in use
  if (json.author) {
    target.contributors = target.contributors || [];
    const contributor = {};
    maybeSetValue(json.author, "name", contributor, "name");
    maybeSetValue(json.author, "url", contributor, "url");
    maybeSetValue(json.author, "avatar", contributor, "image");
    target.contributors.push(contributor);
  }
  if (json.authors) {
    target.contributors = target.contributors || [];
    for (let source of json.authors) {
      const contributor = {};
      maybeSetValue(source, "name", contributor, "name");
      maybeSetValue(source, "url", contributor, "url");
      maybeSetValue(source, "avatar", contributor, "image");
      target.contributors.push(contributor);
    }
  }
}

function maybeSetValue(
  json: any,
  jsonField: string,
  target: Record<string, any>,
  targetField: string
) {
  if (json[jsonField]) {
    target[targetField] = json[jsonField];
  }
}
