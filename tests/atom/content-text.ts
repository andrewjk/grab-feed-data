import * as assert from "uvu/assert";
import grabFeedData from "../../src/grabFeedData";

export default {
  name: "Atom text content",
  test: () => {
    const xml = `
<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title type="text">
    Less: &lt;
  </title>
</feed>
`;

    const actual = grabFeedData(xml);

    assert.equal(actual.title, "Less: <");
  },
};
