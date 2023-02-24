import { test } from "uvu";
import * as assert from "uvu/assert";
import grabFeedData from "../src/grabFeedData";
import FeedData from "../types/FeedData";

test("RSS data", () => {
  const result = grabFeedData(xml);

  const expected: FeedData = {
    type: "rss",
    title: "Liftoff News",
    description: "Liftoff to Space Exploration.",
    link: "http://liftoff.msfc.nasa.gov/",
    pubDate: "Tue, 10 Jun 2003 04:00:00 GMT",
    language: "en-us",
    generator: "Weblog Editor 2.0",
    entries: [
      {
        title: "Star City",
        content:
          'How do Americans get ready to work with Russians aboard the International Space Station? They take a crash course in culture, language and protocol at Russia\'s <a href="http://howe.iki.rssi.ru/GCTC/gctc_e.htm">Star City</a>.',
        link: "http://liftoff.msfc.nasa.gov/news/2003/news-starcity.asp",
        pubDate: "Tue, 03 Jun 2003 09:39:21 GMT",
        guid: "http://liftoff.msfc.nasa.gov/2003/06/03.html#item573",
      },
    ],
  };

  assert.equal(result, expected);
});

test.run();

// From https://www.rssboard.org/files/sample-rss-2.xml
const xml = `
<rss version="2.0">
  <channel>
    <title>Liftoff News</title>
    <link>http://liftoff.msfc.nasa.gov/</link>
    <description>Liftoff to Space Exploration.</description>
    <language>en-us</language>
    <pubDate>Tue, 10 Jun 2003 04:00:00 GMT</pubDate>
    <lastBuildDate>Tue, 10 Jun 2003 09:41:01 GMT</lastBuildDate>
    <docs>http://blogs.law.harvard.edu/tech/rss</docs>
    <generator>Weblog Editor 2.0</generator>
    <managingEditor>editor@example.com</managingEditor>
    <webMaster>webmaster@example.com</webMaster>
    <item>
      <title>Star City</title>
      <link>
        http://liftoff.msfc.nasa.gov/news/2003/news-starcity.asp
      </link>
      <description>
        How do Americans get ready to work with Russians aboard the International Space Station? They take a crash course in culture, language and protocol at Russia's <a href="http://howe.iki.rssi.ru/GCTC/gctc_e.htm">Star City</a>.
      </description>
      <pubDate>Tue, 03 Jun 2003 09:39:21 GMT</pubDate>
      <guid>
        http://liftoff.msfc.nasa.gov/2003/06/03.html#item573
      </guid>
    </item>
  </channel>
</rss>
`;
