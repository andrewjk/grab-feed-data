import { test } from "uvu";
import * as assert from "uvu/assert";
import grabFeedData from "../../src/grabFeedData";
import FeedData from "../../types/FeedData";

test("Atom sample data", () => {
  const result = grabFeedData(xml);

  const expected: FeedData = {
    type: "atom",
    title: "dive into mark",
    description:
      "A <em>lot</em> of effort\n    went into making this effortless",
    homeUrl: "http://example.org/",
    feedUrl: "http://example.org/feed.atom",
    language: "en-us",
    copyright: "Copyright (c) 2003, Mark Pilgrim",
    author: {
      name: "Mark Pilgrim",
      url: "http://example.org/",
      email: "f8dy@example.org",
    },
    updatedAt: "2005-07-31T12:29:29Z",
    image: {
      url: "https://example.org/site-logo.png",
    },
    categories: ["Feed cat one", "Feed cat two"],
    generator: "Example Toolkit",
    entries: [
      {
        title: "Atom draft-07 snapshot",
        content:
          '<div xmlns="http://www.w3.org/1999/xhtml"><p><i>[Update: The Atom draft is finished.]</i></p></div>',
        contentText: "[Update: The Atom draft is finished.]",
        entryUrl: "http://example.org/2005/04/02/atom",
        author: {
          name: "Mark Pilgrim",
          url: "http://example.org/",
          email: "f8dy@example.org",
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
        commentsUrl: "http://example.org/2005/04/02/atom#comments",
        categories: ["Entry cat one", "Entry cat two"],
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

  assert.equal(result, expected);
});

test.run();

// Adapted from https://www.rfc-editor.org/rfc/rfc4287
const xml = `
<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="en-us">
  <title type="text">dive into mark</title>
  <subtitle type="html">
    A &lt;em&gt;lot&lt;/em&gt; of effort
    went into making this effortless
  </subtitle>
  <updated>2005-07-31T12:29:29Z</updated>
  <id>tag:example.org,2003:3</id>
  <link rel="alternate" type="text/html" hreflang="en" href="http://example.org/"/>
  <link rel="self" type="application/atom+xml" href="http://example.org/feed.atom"/>
  <logo>https://example.org/site-logo.png</logo>
  <author>
    <name>Mark Pilgrim</name>
    <uri>http://example.org/</uri>
    <email>f8dy@example.org</email>
  </author>
  <rights>Copyright (c) 2003, Mark Pilgrim</rights>
  <generator uri="http://www.example.org/" version="1.0">
    Example Toolkit
  </generator>
  <category term="Feed cat one" />
  <category term="Feed cat two" />
  <entry>
    <title>Atom draft-07 snapshot</title>
    <link rel="alternate" type="text/html" href="http://example.org/2005/04/02/atom"/>
    <link rel="enclosure" type="audio/mpeg" length="1337" href="http://example.org/audio/ph34r_my_podcast.mp3"/>
    <link rel="replies" type="text/html" href="http://example.org/2005/04/02/atom#comments"/>
    <id>tag:example.org,2003:3.2397</id>
    <updated>2005-07-31T12:29:29Z</updated>
    <published>2003-12-13T08:29:29-04:00</published>
    <author>
      <name>Mark Pilgrim</name>
      <uri>http://example.org/</uri>
      <email>f8dy@example.org</email>
    </author>
    <contributor>
      <name>Sam Ruby</name>
    </contributor>
    <contributor>
      <name>Joe Gregorio</name>
    </contributor>
    <content type="xhtml" xml:lang="en" xml:base="http://diveintomark.org/">
      <div xmlns="http://www.w3.org/1999/xhtml">
        <p><i>[Update: The Atom draft is finished.]</i></p>
      </div>
    </content>
    <category term="Entry cat one" />
    <category term="Entry cat two" />
  </entry>
</feed>
`;
