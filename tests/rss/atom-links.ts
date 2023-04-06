import * as assert from "uvu/assert";
import grabFeedData from "../../src/grabFeedData";
import FeedData from "../../types/FeedData";

export default {
  name: "RSS with Atom links",
  test: () => {
    const xml = `
<rss version="2.0">
  <channel>
    <title>Feed title</title>
    <link>http://example.org</link>
    <atom:link href="http://example.org/feeds" rel="self" type="application/rss+xml" />
    <item>
      <title>Entry title</title>
    </item>
  </channel>
</rss>
`;

    const result = grabFeedData(xml);

    const expected: FeedData = {
      type: "rss",
      title: "Feed title",
      homeUrl: "http://example.org",
      feedUrl: "http://example.org/feeds",
      entries: [
        {
          title: "Entry title",
        },
      ],
    };

    assert.equal(result, expected);
  },
};
