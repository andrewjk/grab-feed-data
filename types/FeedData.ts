import PersonData from "./PersonData";
import EntryData from "./EntryData";
import ImageData from "./ImageData";

/**
 * Data about an RSS, Atom or JSON feed.
 */
export default interface FeedData {
  /**
   * The type of feed, which can be `rss`, `atom` or `json`. If the type of feed could not be
   * determined, this will be set to `unknown`.
   */
  type: "unknown" | "rss" | "atom" | "json";
  /**
   * The name of the feed.
   *
   * In RSS, Atom and JF this is the `title` field.
   */
  title: string;
  /**
   * A description of the feed.
   *
   * In RSS and JF this is the `description` field. In Atom this is the `subtitle` field.
   */
  description?: string;
  /**
   * The website URL corresponding to the channel.
   *
   * In RSS this is the `link` field. In Atom this is the `link` field with no `rel` attribute or with `rel="alternate"`.
   * In JF this is the `home_page_url` field.
   */
  homeUrl?: string;
  /**
   * The URL at which the feed can be accessed.
   *
   * In RSS this is not used. In Atom this is the `link` field with `rel="self"`. In JF this is the `feed_url` field.
   */
  feedUrl?: string;
  /**
   * The HTML language code that the feed is written in, such as en-us.
   *
   * In RSS and JF this is the `language` field. In Atom this is the `xml:lang` attribute.
   */
  language?: string;
  /**
   * A copyright notice for the feed.
   *
   * In RSS this is the `copyright` or `dc:rights` field. In Atom this is the `rights` field. In JF this is not used.
   */
  copyright?: string;
  /**
   * The author of the feed.
   *
   * In RSS this is the `managingEditor` field, falling back to the `webMaster` field. In Atom this is the `author` field.
   * In JF this is not used.
   */
  author?: PersonData;
  /**
   * Multiple authors who contribute to this feed.
   *
   * In RSS this may be the `dc:creator` field(s). In Atom this is the `contributor` fields. In JF this is the `authors` field.
   */
  contributors?: PersonData[];
  ///**
  // * The date and time at which this feed was published.
  // *
  // * In RSS this is the `pubDate` field. In Atom and JF this is not used.
  // */
  //publishedAt?: string;
  /**
   * The date and time at which this feed was last updated.
   *
   * In RSS this is the `lastBuildDate` field. In Atom this is the `updated` field. In JF this is not used.
   */
  updatedAt?: string;
  /**
   * An image that can be displayed with this feed.
   *
   * In RSS this is the `image` field. In Atom this is the `logo` field. In JF this is the `icon` field.
   */
  image?: ImageData;
  /**
   * A favicon that can be displayed with this feed.
   *
   * In RSS this is not used. In Atom this is the `icon` field. In JF this is the `favicon` field.
   */
  icon?: string;
  /**
   * One or more categories that the feed belongs to.
   *
   * In RSS and Atom this is the `category` field. In JF this is not used.
   */
  categories?: string[];
  /**
   * The program used to generate the feed.
   *
   * In RSS and Atom this is the `generator` field. In JF this is not used.
   */
  generator?: string;
  ///**
  // * Time to live; the number of minutes that a feed can be cached before it should be refreshed.
  // *
  // * In RSS this is the `ttl` field. In Atom this is not used.
  // */
  //ttl?: number;
  ///**
  // * A hint for aggregators telling them which hours they can skip.
  // *
  // * In RSS this is the `skipHours` field. In Atom this is not used.
  // */
  //skipHours?: string;
  ///**
  // * A hint for aggregators telling them which days they can skip.
  // *
  // * In RSS this is the `skipDays` field. In Atom this is not used.
  // */
  //skipDays?: string;
  ///**
  // * Whether this feed has stopped updating.
  // *
  // * In RSS and Atom this is not used. In JF this is the `expired` field.
  // */
  //expired: boolean;
  /**
   * The entries in the field.
   *
   * In RSS and JF this is the `item` fields. In Atom this is the `entry` fields.
   */
  entries: EntryData[];
}
