import FeedData from "../types/FeedData";
import grabJsonFeedData from "./grabJsonFeedData";
import grabXmlFeedData from "./grabXmlFeedData";

/** Grab meta and entry data from a feed file */
export default function grabFeedData(content: string): FeedData {
  content = content.trim();
  if (content.startsWith("<")) {
    return grabXmlFeedData(content);
  } else if (content.startsWith("{")) {
    return grabJsonFeedData(content);
  } else {
    throw new Error("Feed does not appear to be XML or JSON");
  }
}
