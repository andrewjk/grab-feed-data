import AttachmentData from "./AttachmentData";
import ImageData from "./ImageData";
import PersonData from "./PersonData";
import SourceData from "./SourceData";

/**
 * Data about an entry in an RSS, Atom or JSON feed.
 */
export default interface EntryData {
  /**
   * The title of the entry.
   *
   * In RSS, Atom and JF this is the `title` field.
   */
  title?: string;
  /**
   * A summary of the item, used in Atom feeds to provide a synopsis, or when the content is non-textual.
   *
   * In RSS, this is not used. In Atom and JF, this is the `summary` field.
   */
  summary?: string;
  /**
   * The content of the entry, which may consist of HTML or text.
   *
   * In RSS, this is the `description` field. In Atom, this is the `content` field with no `type`
   * attribute or with `type="html"` or `type="xhtml"`. In JF, this is the `content_html` field.
   */
  content?: string;
  /**
   * A plain-text representation of the content of the entry.
   *
   * In RSS, this is not used. In Atom, this is the `content` field with `type="text"`.
   * In JF, this is the `content_text` field.
   */
  contentText?: string;
  /**
   * The URL at which the entry's content can be found.
   *
   * In RSS and JF this is the `link` field. In Atom this is the `link` field with
   * no `rel` attribute or with `rel="alternate"`. In JF this is the `url` field.
   */
  entryUrl?: string;
  /**
   * The URL at which the entry's content can be found when this entry links to another site.
   *
   * In RSS and Atom this is not used.  In JF this is the `external_url` field.
   */
  externalUrl?: string;
  permalink?: string;
  /**
   * The author of the entry.
   *
   * In RSS and Atom this is the `author` field. In JF this is not used.
   */
  author?: PersonData;
  /**
   * Multiple authors who contributed to this entry.
   *
   * In RSS this is not used. In Atom this is the `contributor` fields. In JF this is the `authors` field.
   */
  contributors?: PersonData[];
  /**
   * The date and time at which this entry was published.
   *
   * In RSS this is the `pubDate` field. In Atom this is the `updated` field. In JF this is the `date_published` field.
   */
  publishedAt?: string;
  /**
   * The date and time at which this entry was last updated.
   *
   * In RSS this is not used. In Atom this is the `updated` field. In JF this is the `date_modified` field.
   */
  updatedAt?: string;
  /**
   * A unique identifier for the entry.
   *
   * In RSS this is the `guid` field. In Atom and JF this is the `id` field.
   */
  guid?: string;
  /**
   * The URL at which comments for the entry are located.
   *
   * In RSS this is the `link` field. In Atom this is the `link` field with `rel="replies"`.
   * In JF this is not used.
   */
  commentsUrl?: string;
  /**
   * An image that can be displayed with this entry.
   *
   * In RSS and Atom this is not used. In JF this is the `image` field.
   */
  image?: ImageData;
  /**
   * One or more categories that this entry belongs to.
   *
   * In RSS and Atom this is the `category` field. In JF this is the `tags` field.
   */
  categories?: string[];
  /**
   * A description of the feed that this entry belongs to.
   *
   * In RSS this is the `source` field. In Atom and JF this is not used.
   */
  source?: SourceData;
  /**
   * One or more media items that are attached to this entry, such as a podcast or video.
   *
   * In RSS this is the `enclosure` field. In Atom this is the `link` field with `rel="enclosure"`.
   * In JF this is the `attachments` field.
   */
  attachments?: AttachmentData[];
}
