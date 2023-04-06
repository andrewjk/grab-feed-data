import { test } from "uvu";
import allFields from "./all-fields.js";
import sample from "./sample.js";

addTest(allFields);
addTest(sample);

function addTest(x: any) {
  test(x.name, x.test);
}

test.run();
