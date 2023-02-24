import { test } from "uvu";
import * as assert from "uvu/assert";
import grabFeedData from "../src/grabFeedData";
import FeedData from "../types/FeedData";

test("JSON data", () => {
  const result = grabFeedData(json);

  const expected: FeedData = {
    type: "json",
    title: "My Example Feed",
    link: "https://example.org/",
    entries: [
      {
        title: "",
        content: "This is a second item.",
        link: "https://example.org/second-item",
        guid: "2",
      },
      {
        title: "",
        content: "<p>Hello, world!</p>",
        link: "https://example.org/initial-post",
        guid: "1",
      },
    ],
  };

  assert.equal(result, expected);
});

test.run();

// From https://www.jsonfeed.org/version/1.1/
const json = `
{
    "version": "https://jsonfeed.org/version/1.1",
    "title": "My Example Feed",
    "home_page_url": "https://example.org/",
    "feed_url": "https://example.org/feed.json",
    "items": [
        {
            "id": "2",
            "content_text": "This is a second item.",
            "url": "https://example.org/second-item"
        },
        {
            "id": "1",
            "content_html": "<p>Hello, world!</p>",
            "url": "https://example.org/initial-post"
        }
    ]
}
`;
