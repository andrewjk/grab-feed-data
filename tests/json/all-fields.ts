import * as fs from "fs";
import * as assert from "uvu/assert";
import grabFeedData from "../../src/grabFeedData";
import FeedData from "../../types/FeedData";

export default {
  name: "JSON all fields",
  test: () => {
    const json = fs
      .readFileSync("tests/json/all-fields.json", { encoding: "utf-8" })
      .replaceAll("\r\n", "\n");
    const actual = grabFeedData(json);

    const expected: FeedData = {
      type: "json",
      title: "Feed title",
      homeUrl: "https://example.org/feed-home-url",
      feedUrl: "https://example.org/feed-url",
      description: "Feed description",
      image: {
        url: "https://example.org/feed-icon",
      },
      icon: "https://example.org/feed-favicon",
      contributors: [
        {
          name: "Feed author 1",
        },
        {
          name: "Feed author 2",
        },
      ],
      language: "en-us",
      entries: [
        {
          guid: "Entry 0 id",
          entryUrl: "https://example.org/entry-0-url",
          externalUrl: "https://example.org/entry-0-external-url",
          title: "Entry 0 title",
          content: "<p>Entry 0 content</p>",
          contentText: "Entry 0 text content",
          summary: "Entry 0 summary",
          image: {
            url: "https://example.org/entry-0-image",
          },
          publishedAt: "2010-02-07T14:04:00-05:00",
          updatedAt: "2010-02-08T14:04:00-05:00",
          contributors: [
            {
              name: "Entry 0 author 1",
            },
            {
              name: "Entry 0 author 2",
            },
          ],
          categories: ["Entry 0 tag one", "Entry 0 tag two"],
          //language: "en-gb",
        },
      ],
    };

    assert.equal(actual, expected);
  },
};
