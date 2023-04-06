import * as assert from "uvu/assert";
import grabFeedLinks from "../../src/grabFeedLinks";
import FeedLink from "../../types/FeedLink";

export default {
  name: "Feed links in HTML",
  test: () => {
    const html = `
<html>
  <head>
    <title>My cool blog</title>

    <link rel="alternate" type="application/rss+xml" href="http://myblog.example.com/rss" />
    <link rel="alternate" type="application/atom+xml" href="http://myblog.example.com/atom" title="Atom feed" />
    <link rel="alternate" type="application/feed+json" href="http://myblog.example.com/json" title="JSON feed" />
    <link rel="alternate" type="application/json" href="http://myblog.example.com/comments" title="JSON comments" />
  </head>
</html>
`;

    const result = grabFeedLinks(html);

    const expected: FeedLink[] = [
      {
        type: "rss",
        url: "http://myblog.example.com/rss",
      },
      {
        type: "atom",
        url: "http://myblog.example.com/atom",
        title: "Atom feed",
      },
      {
        type: "json",
        url: "http://myblog.example.com/json",
        title: "JSON feed",
      },
      {
        type: "json",
        url: "http://myblog.example.com/comments",
        title: "JSON comments",
      },
    ];

    assert.equal(result, expected);
  },
};
