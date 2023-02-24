export default interface FeedLink {
  type: "rss" | "atom" | "json";
  href: string;
  title?: string;
}
