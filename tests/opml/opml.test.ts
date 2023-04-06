import { test } from "uvu";
import opmlData from "./opml-data";
import opmlTags from "./opml-tags";

addTest(opmlData);
addTest(opmlTags);

function addTest(x: any) {
  test(x.name, x.test);
}

test.run();
