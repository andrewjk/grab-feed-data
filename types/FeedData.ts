import AuthorData from "./AuthorData";
import EntryData from "./EntryData";

export default interface FeedData {
  type: "unknown" | "rss" | "atom" | "json";
  title: string;
  description?: string;
  link?: string;
  xmlUrl?: string;
  date?: string;
  pubDate?: string;
  author?: AuthorData;
  language?: string;
  image?: string;
  favicon?: string;
  copyright?: string;
  generator?: string;
  categories?: string[];
  entries: EntryData[];
}
