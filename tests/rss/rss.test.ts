import { test } from "uvu";
import allFields from "./all-fields";
import atomLinks from "./atom-links";
import sample from "./sample";

addTest(allFields);
addTest(atomLinks);
addTest(sample);

function addTest(x: any) {
  test(x.name, x.test);
}

test.run();
