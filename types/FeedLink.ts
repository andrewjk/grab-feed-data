/**
 * A link to an RSS, Atom or JSON feed that was discovered in an HTML file.
 */
export default interface FeedLink {
  /**
   * The type of feed, which can be `unknown`, `rss`, `atom` or `json`.
   */
  type: "unknown" | "rss" | "atom" | "json";
  /**
   * The URL at which the feed can be accessed.
   */
  url: string;
  /**
   * A title for the feed, which may be added by a site to differentiate between multiple available feeds.
   */
  title?: string;
}
