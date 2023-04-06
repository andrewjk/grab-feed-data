import * as fs from "fs";
import * as assert from "uvu/assert";
import grabFeedData from "../../src/grabFeedData";
import FeedData from "../../types/FeedData";

export default {
  name: "Atom sample data",
  test: () => {
    const xml = fs
      .readFileSync("tests/atom/sample.xml", { encoding: "utf-8" })
      .replaceAll("\r\n", "\n");
    const actual = grabFeedData(xml);

    const expected: FeedData = {
      type: "atom",
      title: "dive into mark",
      description: "A <em>lot</em> of effort\nwent into making this effortless",
      homeUrl: "http://example.org/",
      feedUrl: "http://example.org/feed.atom",
      language: "en",
      copyright: "Copyright (c) 2003, Mark Pilgrim",
      updatedAt: "2005-07-31T12:29:29Z",
      generator: "Example Toolkit",
      entries: [
        {
          title: "Atom draft-07 snapshot",
          content:
            '<div xmlns="http://www.w3.org/1999/xhtml">\n                <p>\n                    <i>[Update: The Atom draft is finished.]</i>\n                </p>\n            </div>',
          contentText: "[Update: The Atom draft is finished.]",
          entryUrl: "http://example.org/2005/04/02/atom",
          author: {
            name: "Mark Pilgrim",
            url: "http://example.org/",
            email: "f8dy@example.com",
          },
          contributors: [
            {
              name: "Sam Ruby",
            },
            {
              name: "Joe Gregorio",
            },
          ],
          updatedAt: "2005-07-31T12:29:29Z",
          publishedAt: "2003-12-13T08:29:29-04:00",
          guid: "tag:example.org,2003:3.2397",
          attachments: [
            {
              url: "http://example.org/audio/ph34r_my_podcast.mp3",
              length: 1337,
              type: "audio/mpeg",
            },
          ],
        },
      ],
    };

    assert.equal(actual, expected);
  },
};
