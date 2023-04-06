import { test } from "uvu";
import * as assert from "uvu/assert";
import grabOpmlData from "../../src/grabOpmlData";
import OpmlData from "../../types/OpmlData";

test("OPML tags", () => {
  const opml = `
<?xml version="1.0" encoding="ISO-8859-1"?>
<opml version="2.0">
	<head>
		<title>mySubscriptions.opml</title>
  </head>
	<body>
    <!-- No tags: -->
    <outline text="CNET News.com" type="rss" xmlUrl="http://news.com.com/2547-1_3-0-5.xml"/>
    <!-- Tags get set later: -->
    <outline text="NYT &gt; Technology" type="rss" xmlUrl="http://www.nytimes.com/services/xml/rss/nyt/Technology.xml"/>
    <outline text="Tech">
      <outline text="NYT &gt; Technology" type="rss" xmlUrl="http://www.nytimes.com/services/xml/rss/nyt/Technology.xml"/>
    </outline>
    <outline text="News">
      <outline text="NYT &gt; Technology" type="rss" xmlUrl="http://www.nytimes.com/services/xml/rss/nyt/Technology.xml"/>
    </outline>
  </body>
</opml>  
`;

  const result = grabOpmlData(opml);

  const expected: OpmlData = {
    title: "mySubscriptions.opml",
    feeds: [
      {
        type: "rss",
        text: "CNET News.com",
        feedUrl: "http://news.com.com/2547-1_3-0-5.xml",
      },
      {
        type: "rss",
        text: "NYT > Technology",
        feedUrl: "http://www.nytimes.com/services/xml/rss/nyt/Technology.xml",
        tags: ["Tech", "News"],
      },
    ],
  };

  assert.equal(result, expected);
});

test.run();
