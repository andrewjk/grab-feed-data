import * as assert from "uvu/assert";
import grabOpmlData from "../../src/grabOpmlData";
import OpmlData from "../../types/OpmlData";

export default {
  name: "OPML data",
  test: () => {
    const opml = `
<?xml version="1.0" encoding="ISO-8859-1"?>
<opml version="2.0">
	<head>
		<title>mySubscriptions.opml</title>
		<dateCreated>Sat, 18 Jun 2005 12:11:52 GMT</dateCreated>
		<dateModified>Tue, 02 Aug 2005 21:42:48 GMT</dateModified>
  </head>
	<body>
		<outline text="CNET News.com" htmlUrl="http://news.com.com/" type="rss" version="RSS2" xmlUrl="http://news.com.com/2547-1_3-0-5.xml"/>
		<outline text="washingtonpost.com - Politics" htmlUrl="http://www.washingtonpost.com/wp-dyn/politics?nav=rss_politics" type="rss" version="RSS2" xmlUrl="http://www.washingtonpost.com/wp-srv/politics/rssheadlines.xml"/>
    <outline text="NYT &gt; Technology" htmlUrl="http://www.nytimes.com/pages/technology/index.html?partner=rssnyt" type="rss" version="RSS2" xmlUrl="http://www.nytimes.com/services/xml/rss/nyt/Technology.xml"/>
    <outline text="Scripting News" htmlUrl="http://www.scripting.com/" type="rss" version="RSS2" xmlUrl="http://www.scripting.com/rss.xml"/>
    <outline text="Wired News" htmlUrl="http://www.wired.com/" type="rss" version="RSS" xmlUrl="http://www.wired.com/news_drop/netcenter/netcenter.rdf"/>
  </body>
</opml>  
`;

    const result = grabOpmlData(opml);

    const expected: OpmlData = {
      title: "mySubscriptions.opml",
      createdAt: "Sat, 18 Jun 2005 12:11:52 GMT",
      modifiedAt: "Tue, 02 Aug 2005 21:42:48 GMT",
      feeds: [
        {
          type: "rss",
          text: "CNET News.com",
          feedUrl: "http://news.com.com/2547-1_3-0-5.xml",
          webUrl: "http://news.com.com/",
        },
        {
          type: "rss",
          text: "washingtonpost.com - Politics",
          feedUrl:
            "http://www.washingtonpost.com/wp-srv/politics/rssheadlines.xml",
          webUrl:
            "http://www.washingtonpost.com/wp-dyn/politics?nav=rss_politics",
        },
        {
          type: "rss",
          text: "NYT > Technology",
          feedUrl: "http://www.nytimes.com/services/xml/rss/nyt/Technology.xml",
          webUrl:
            "http://www.nytimes.com/pages/technology/index.html?partner=rssnyt",
        },
        {
          type: "rss",
          text: "Scripting News",
          feedUrl: "http://www.scripting.com/rss.xml",
          webUrl: "http://www.scripting.com/",
        },
        {
          type: "rss",
          text: "Wired News",
          feedUrl: "http://www.wired.com/news_drop/netcenter/netcenter.rdf",
          webUrl: "http://www.wired.com/",
        },
      ],
    };

    assert.equal(result, expected);
  },
};
