import * as fs from "fs";
import * as assert from "uvu/assert";
import grabFeedData from "../../src/grabFeedData";
import FeedData from "../../types/FeedData";

export default {
  name: "RSS sample data",
  test: () => {
    const xml = fs
      .readFileSync("tests/rss/sample.xml", { encoding: "utf-8" })
      .replaceAll("\r\n", "\n");
    const actual = grabFeedData(xml);

    const expected: FeedData = {
      type: "rss",
      title: "Liftoff News",
      description: "Liftoff to Space Exploration.",
      homeUrl: "http://liftoff.msfc.nasa.gov/",
      language: "en-us",
      author: {
        email: "editor@example.com",
      },
      //publishedAt: "Tue, 10 Jun 2003 04:00:00 GMT",
      updatedAt: "Tue, 10 Jun 2003 09:41:01 GMT",
      generator: "Weblog Editor 2.0",
      entries: [
        {
          title: "Star City",
          content:
            'How do Americans get ready to work with Russians aboard the International Space Station? They take a crash course in culture, language and protocol at Russia\'s <a href="http://howe.iki.rssi.ru/GCTC/gctc_e.htm">Star City</a>.',
          contentText:
            "How do Americans get ready to work with Russians aboard the International Space Station? They take a crash course in culture, language and protocol at Russia's Star City.",
          entryUrl: "http://liftoff.msfc.nasa.gov/news/2003/news-starcity.asp",
          publishedAt: "Tue, 03 Jun 2003 09:39:21 GMT",
          guid: "http://liftoff.msfc.nasa.gov/2003/06/03.html#item573",
        },
        {
          content:
            'Sky watchers in Europe, Asia, and parts of Alaska and Canada will experience a <a href="http://science.nasa.gov/headlines/y2003/30may_solareclipse.htm">partial eclipse of the Sun</a> on Saturday, May 31st.',
          contentText:
            "Sky watchers in Europe, Asia, and parts of Alaska and Canada will experience a partial eclipse of the Sun on Saturday, May 31st.",
          publishedAt: "Fri, 30 May 2003 11:06:42 GMT",
          guid: "http://liftoff.msfc.nasa.gov/2003/05/30.html#item572",
        },
        {
          title: "The Engine That Does More",
          content:
            "Before man travels to Mars, NASA hopes to design new engines that will let us fly through the Solar System more quickly. The proposed VASIMR engine would do that.",
          contentText:
            "Before man travels to Mars, NASA hopes to design new engines that will let us fly through the Solar System more quickly. The proposed VASIMR engine would do that.",
          entryUrl: "http://liftoff.msfc.nasa.gov/news/2003/news-VASIMR.asp",
          publishedAt: "Tue, 27 May 2003 08:37:32 GMT",
          guid: "http://liftoff.msfc.nasa.gov/2003/05/27.html#item571",
        },
        {
          title: "Astronauts' Dirty Laundry",
          content:
            "Compared to earlier spacecraft, the International Space Station has many luxuries, but laundry facilities are not one of them. Instead, astronauts have other options.",
          contentText:
            "Compared to earlier spacecraft, the International Space Station has many luxuries, but laundry facilities are not one of them. Instead, astronauts have other options.",
          entryUrl: "http://liftoff.msfc.nasa.gov/news/2003/news-laundry.asp",
          publishedAt: "Tue, 20 May 2003 08:56:02 GMT",
          guid: "http://liftoff.msfc.nasa.gov/2003/05/20.html#item570",
        },
      ],
    };

    assert.equal(actual, expected);
  },
};
