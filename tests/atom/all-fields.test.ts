import * as fs from "fs";
import { test } from "uvu";
import * as assert from "uvu/assert";
import grabFeedData from "../../src/grabFeedData";
import FeedData from "../../types/FeedData";

test("Atom all fields", () => {
  const xml = fs
    .readFileSync("tests/atom/all-fields.xml", { encoding: "utf-8" })
    .replaceAll("\r\n", "\n");
  const actual = grabFeedData(xml);

  let expected: FeedData = {
    type: "atom",
    title: "Feed title",
    description: "Feed subtitle",
    homeUrl: "http://example.org/feed-alternate-link",
    feedUrl: "http://example.org/feed-self-link",
    language: "en",
    copyright: "Feed copyright",
    author: {
      name: "Feed author",
      url: "http://example.org/feed-author",
      email: "feed-author@example.org",
    },
    updatedAt: "2005-07-31T12:29:29Z",
    image: {
      url: "https://example.org/feed-logo.png",
    },
    categories: ["Feed category one", "Feed category two"],
    generator: "Feed generator",
    entries: [
      {
        title: "Entry 0 title",
        content:
          '<div xmlns="http://www.w3.org/1999/xhtml">\n                <p>Entry 0 content</p>\n            </div>',
        contentText: "Entry 0 content",
        entryUrl: "http://example.org/entry-0-alternate-link",
        author: {
          name: "Entry 0 author",
          url: "http://example.org/entry-0-author",
          email: "entry-0-author@example.org",
        },
        contributors: [
          {
            name: "Entry 0 contributor",
          },
          {
            name: "Entry 0 contributor 2",
          },
        ],
        updatedAt: "2004-07-31T12:29:29Z",
        publishedAt: "2003-12-13T08:29:29-04:00",
        guid: "Entry 0 id",
        commentsUrl: "http://example.org/entry-0-replies-link",
        categories: ["Entry 0 category one", "Entry 0 category two"],
        attachments: [
          {
            url: "http://example.org/entry-0-enclosure-link",
            length: 1337,
            type: "audio/mpeg",
          },
        ],
      },
    ],
  };

  assert.equal(actual, expected);
});

test.run();
