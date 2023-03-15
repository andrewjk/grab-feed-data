import * as fs from "fs";
import { test } from "uvu";
import * as assert from "uvu/assert";
import grabFeedData from "../../src/grabFeedData";
import FeedData from "../../types/FeedData";

test("RSS all fields", () => {
  const xml = fs
    .readFileSync("tests/rss/all-fields.xml", { encoding: "utf-8" })
    .replaceAll("\r\n", "\n");
  const actual = grabFeedData(xml);

  let expected: FeedData = {
    type: "rss",
    title: "Feed title",
    description: "Feed description",
    homeUrl: "http://example.org/feed-link",
    language: "en-us",
    copyright: "Feed copyright",
    author: {
      email: "feed-editor@example.org",
    },
    updatedAt: "Tue, 10 Jun 2003 09:41:01 GMT",
    image: {
      url: "https://example.org/feed-logo.png",
      title: "Feed logo title",
      width: 100,
      height: 75,
    },
    categories: ["Feed category one", "Feed category two"],
    generator: "Feed generator",
    entries: [
      {
        title: "Entry 0 title",
        content: "Entry 0 description",
        contentText: "Entry 0 description",
        entryUrl: "http://example.org/entry-0-link",
        author: {
          email: "entry-0-author@example.org",
        },
        publishedAt: "Tue, 03 Jun 2003 09:39:21 GMT",
        guid: "Entry 0 guid",
        categories: ["Entry 0 category one", "Entry 0 category two"],
        attachments: [
          {
            url: "http://example.org/entry-0-enclosure-link",
            length: 12216320,
            type: "audio/mpeg",
          },
        ],
        commentsUrl: "http://example.org/entry-0-comments-link",
        source: {
          url: "http://example.org/entry-0-source",
          title: "Entry 0 source",
        },
      },
    ],
  };

  assert.equal(actual, expected);
});

test.run();
