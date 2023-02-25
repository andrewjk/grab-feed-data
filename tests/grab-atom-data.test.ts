import { test } from "uvu";
import * as assert from "uvu/assert";
import grabFeedData from "../src/grabFeedData";
import FeedData from "../types/FeedData";

test("Atom data", () => {
  const result = grabFeedData(xml);

  const expected: FeedData = {
    type: "atom",
    title: "dive into mark",
    description:
      "A &lt;em&gt;lot&lt;/em&gt; of effort\n    went into making this effortless",
    homeUrl: "http://example.org/",
    copyright: "Copyright (c) 2003, Mark Pilgrim",
    updatedAt: "2005-07-31T12:29:29Z",
    generator: "Example Toolkit",
    entries: [
      {
        title: "Atom draft-07 snapshot",
        content:
          '<div xmlns="http://www.w3.org/1999/xhtml"><p><i>[Update: The Atom draft is finished.]</i></p></div>',
        entryUrl: "http://example.org/2005/04/02/atom",
        author: {
          name: "Mark Pilgrim",
          url: "http://example.org/",
          email: "f8dy@example.com",
        },
        updatedAt: "2005-07-31T12:29:29Z",
        publishedAt: "2003-12-13T08:29:29-04:00",
        guid: "tag:example.org,2003:3.2397",
      },
    ],
  };

  assert.equal(result, expected);
});

test.run();

// From https://www.rfc-editor.org/rfc/rfc4287
const xml = `
<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title type="text">dive into mark</title>
  <subtitle type="html">
    A &lt;em&gt;lot&lt;/em&gt; of effort
    went into making this effortless
  </subtitle>
  <updated>2005-07-31T12:29:29Z</updated>
  <id>tag:example.org,2003:3</id>
  <link rel="alternate" type="text/html"
    hreflang="en" href="http://example.org/"/>
  <link rel="self" type="application/atom+xml"
    href="http://example.org/feed.atom"/>
  <rights>Copyright (c) 2003, Mark Pilgrim</rights>
  <generator uri="http://www.example.com/" version="1.0">
    Example Toolkit
  </generator>
  <entry>
    <title>Atom draft-07 snapshot</title>
    <link rel="alternate" type="text/html"
      href="http://example.org/2005/04/02/atom"/>
    <link rel="enclosure" type="audio/mpeg" length="1337"
      href="http://example.org/audio/ph34r_my_podcast.mp3"/>
    <id>tag:example.org,2003:3.2397</id>
    <updated>2005-07-31T12:29:29Z</updated>
    <published>2003-12-13T08:29:29-04:00</published>
    <author>
      <name>Mark Pilgrim</name>
      <uri>http://example.org/</uri>
      <email>f8dy@example.com</email>
    </author>
    <contributor>
      <name>Sam Ruby</name>
    </contributor>
    <contributor>
      <name>Joe Gregorio</name>
    </contributor>
    <content type="xhtml" xml:lang="en"
    xml:base="http://diveintomark.org/">
      <div xmlns="http://www.w3.org/1999/xhtml">
        <p><i>[Update: The Atom draft is finished.]</i></p>
      </div>
    </content>
  </entry>
</feed>
`;
