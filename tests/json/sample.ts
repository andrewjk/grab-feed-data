import * as fs from "fs";
import * as assert from "uvu/assert";
import grabFeedData from "../../src/grabFeedData";
import FeedData from "../../types/FeedData";

export default {
  name: "JSON sample data",
  test: () => {
    const json = fs
      .readFileSync("tests/json/sample.json", { encoding: "utf-8" })
      .replaceAll("\r\n", "\n");
    const actual = grabFeedData(json);

    const expected: FeedData = {
      type: "json",
      title: "My Example Feed",
      homeUrl: "https://example.org/",
      feedUrl: "https://example.org/feed.json",
      entries: [
        {
          guid: "2",
          title: "",
          contentText: "This is a second item.",
          entryUrl: "https://example.org/second-item",
        },
        {
          guid: "1",
          title: "",
          content: "<p>Hello, world!</p>",
          contentText: "Hello, world!",
          entryUrl: "https://example.org/initial-post",
        },
      ],
    };

    assert.equal(actual, expected);
  },
};
