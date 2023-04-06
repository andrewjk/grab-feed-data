/**
 * A link to an RSS, Atom or JSON feed that was discovered in an OPML file.
 */
export default interface OpmlFeedData {
  /**
   * The type of feed, which can be `unknown`, `rss`, `atom` or `json`.
   */
  type: "unknown" | "rss" | "atom" | "json";
  /**
   * The title of the feed, possibly edited by the user.
   */
  text: string;
  /**
   * The URL at which the feed can be accessed.
   */
  feedUrl: string;
  /**
   * The URL at which the web page for the feed can be accessed.
   */
  webUrl?: string;
  /**
   * The description of the feed.
   */
  description?: string;
  /**
   * The language of the feed.
   */
  language?: string;
  /**
   * The title of the feed.
   */
  title?: string;
  /**
   * One or more tags for the feed.
   */
  tags?: string[];
}
