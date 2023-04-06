import OpmlFeedData from "./OpmlFeedData";

/**
 * The summary details of an OPML file.
 */
export default interface OpmlData {
  /**
   * The title of the OPML document.
   */
  title?: string;
  /**
   * When the OPML document was created.
   */
  createdAt?: string;
  /**
   * When the OPML document was modified.
   */
  modifiedAt?: string;
  /**
   * The name of the OPML document's owner.
   */
  ownerName?: string;
  /**
   * The email address of the OPML document's owner.
   */
  ownerEmail?: string;
  /**
   * The feed entries (from the `outline` nodes).
   */
  feeds: OpmlFeedData[];
}
