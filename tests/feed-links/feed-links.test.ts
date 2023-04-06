import { test } from "uvu";
import feedLinks from "./feed-links";

addTest(feedLinks);

function addTest(x: any) {
  test(x.name, x.test);
}

test.run();
