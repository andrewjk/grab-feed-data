import AuthorData from "./AuthorData";

export default interface EntryData {
  title: string;
  content?: string;
  summary?: string;
  link?: string;
  originalLink?: string;
  permaLink?: string;
  date?: string;
  pubDate?: string;
  author?: AuthorData;
  guid?: string;
  comments?: string;
  image?: ImageData;
  categories?: string[];
  source?: SourceData;
  enclosures?: EnclosureData[];
}

interface ImageData {
  url: string;
  title: string;
}

interface SourceData {
  url: string;
  title: string;
}

interface EnclosureData {
  url: string;
  type?: string;
  length?: string;
}
