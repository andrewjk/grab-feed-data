import * as assert from "uvu/assert";
import grabFeedData from "../../src/grabFeedData";

export default {
  name: "Atom html content",
  test: () => {
    const xml = `
<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title type="html">
    Less: &lt;em> &amp;lt; &lt;/em>
  </title>
</feed>
`;

    const actual = grabFeedData(xml);

    assert.equal(actual.title, "Less: <em> &lt; </em>");
  },
};
