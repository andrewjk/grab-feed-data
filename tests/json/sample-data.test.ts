import { test } from "uvu";
import * as assert from "uvu/assert";
import grabFeedData from "../../src/grabFeedData";
import FeedData from "../../types/FeedData";

test("JSON sample data", () => {
  const result = grabFeedData(json);

  const expected: FeedData = {
    type: "json",
    title: "My Example Feed",
    homeUrl: "https://example.org/",
    feedUrl: "https://example.org/feed.json",
    description: "An example feed by me",
    image: {
      url: "https://example.org/logo.png",
    },
    icon: "https://example.org/favicon.ico",
    contributors: [
      {
        name: "Alex",
      },
      {
        name: "Brenda",
      },
    ],
    language: "en-us",
    entries: [
      {
        guid: "1",
        entryUrl: "https://example.org/initial-post",
        externalUrl: "https://example.org/external-post",
        title: "A test post",
        content: "<p>Hello, world!</p>",
        contentText: "Hello, world!",
        summary: "Just testing",
        image: {
          url: "https://example.org/first-image.png",
        },
        publishedAt: "2010-02-07T14:04:00-05:00",
        updatedAt: "2010-02-08T14:04:00-05:00",
        contributors: [
          {
            name: "Alex A",
          },
          {
            name: "Brenda B",
          },
        ],
        categories: ["Feed tag one", "Feed tag two"],
        //language: "en-gb",
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
    "description": "An example feed by me",
    "icon": "https://example.org/logo.png",
    "favicon": "https://example.org/favicon.ico",
    "authors": [
      {
        "name": "Alex"
      },
      {
        "name": "Brenda"
      }
    ],
    "language": "en-us",
    "items": [
        {
            "id": "1",
            "url": "https://example.org/initial-post",
            "external_url": "https://example.org/external-post",
            "title": "A test post",
            "content_html": "<p>Hello, world!</p>",
            "summary": "Just testing",
            "image": "https://example.org/first-image.png",
            "date_published": "2010-02-07T14:04:00-05:00",
            "date_modified": "2010-02-08T14:04:00-05:00",
            "authors": [
              {
                "name": "Alex A"
              },
              {
                "name": "Brenda B"
              }
            ],
            "tags": [ "Feed tag one", "Feed tag two" ],
            "language": "en-gb"
        }
    ]
}
`;
