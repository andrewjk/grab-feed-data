import { test } from "uvu";
import * as assert from "uvu/assert";
import grabFeedData from "../../src/grabFeedData";
import FeedData from "../../types/FeedData";

test("RSS sample data", () => {
  const result = grabFeedData(xml);

  const expected: FeedData = {
    type: "rss",
    title: "Liftoff News",
    description: "Liftoff to Space Exploration.",
    homeUrl: "http://liftoff.msfc.nasa.gov/",
    language: "en-us",
    copyright: "Copyright 2002",
    author: {
      email: "editor@example.org",
    },
    publishedAt: "Tue, 10 Jun 2003 04:00:00 GMT",
    updatedAt: "Tue, 10 Jun 2003 09:41:01 GMT",
    image: {
      url: "https://example.org/site-logo.png",
      title: "Liftoff News",
      width: 100,
      height: 75,
    },
    categories: ["Feed cat one", "Feed cat two"],
    generator: "Weblog Editor 2.0",
    entries: [
      {
        title: "Star City",
        content:
          'How do Americans get ready to work with Russians aboard the International Space Station? They take a crash course in culture, language and protocol at Russia\'s <a href="http://howe.iki.rssi.ru/GCTC/gctc_e.htm">Star City</a>.',
        contentText:
          "How do Americans get ready to work with Russians aboard the International Space Station? They take a crash course in culture, language and protocol at Russia's Star City.",
        entryUrl: "http://liftoff.msfc.nasa.gov/news/2003/news-starcity.asp",
        author: {
          email: "author@example.org",
        },
        publishedAt: "Tue, 03 Jun 2003 09:39:21 GMT",
        guid: "http://liftoff.msfc.nasa.gov/2003/06/03.html#item573",
        commentsUrl:
          "http://liftoff.msfc.nasa.gov/news/2003/news-starcity.asp#comments",
        categories: ["Entry cat one", "Entry cat two"],
        source: {
          url: "http://liftoff.msfc.nasa.gov/feed.xml",
          title: "Liftoff News",
        },
        attachments: [
          {
            url: "http://www.scripting.com/mp3s/weatherReportSuite.mp3",
            length: 12216320,
            type: "audio/mpeg",
          },
        ],
      },
    ],
  };

  assert.equal(result, expected);
});

test.run();

// Adapted from https://www.rssboard.org/files/sample-rss-2.xml
const xml = `
<rss version="2.0">
  <channel>
    <title>Liftoff News</title>
    <link>http://liftoff.msfc.nasa.gov/</link>
    <description>Liftoff to Space Exploration.</description>
    <language>en-us</language>
    <copyright>Copyright 2002</copyright>
    <pubDate>Tue, 10 Jun 2003 04:00:00 GMT</pubDate>
    <lastBuildDate>Tue, 10 Jun 2003 09:41:01 GMT</lastBuildDate>
    <category>
      Feed cat one
    </category>
    <category>
      Feed cat two
    </category>
    <docs>http://blogs.law.harvard.edu/tech/rss</docs>
    <generator>Weblog Editor 2.0</generator>
    <managingEditor>editor@example.org</managingEditor>
    <webMaster>webmaster@example.org</webMaster>
    <image>
      <url>https://example.org/site-logo.png</url>
      <title>Liftoff News</title>
      <link>http://liftoff.msfc.nasa.gov/</link>
      <width>100</width>
      <height>75</height>
    </image>
    <item>
      <title>Star City</title>
      <link>
        http://liftoff.msfc.nasa.gov/news/2003/news-starcity.asp
      </link>
      <description>
        How do Americans get ready to work with Russians aboard the International Space Station? They take a crash course in culture, language and protocol at Russia's <a href="http://howe.iki.rssi.ru/GCTC/gctc_e.htm">Star City</a>.
      </description>
      <author>author@example.org</author>
      <category>
        Entry cat one
      </category>
      <category>
        Entry cat two
      </category>
      <comments>
        http://liftoff.msfc.nasa.gov/news/2003/news-starcity.asp#comments
      </comments>
      <enclosure url="http://www.scripting.com/mp3s/weatherReportSuite.mp3" length="12216320" type="audio/mpeg" />
      <pubDate>Tue, 03 Jun 2003 09:39:21 GMT</pubDate>
      <guid>
        http://liftoff.msfc.nasa.gov/2003/06/03.html#item573
      </guid>
      <source url="http://liftoff.msfc.nasa.gov/feed.xml">
        Liftoff News
      </source>
    </item>
  </channel>
</rss>
`;
