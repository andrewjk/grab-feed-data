import * as assert from "uvu/assert";
import grabFeedData from "../../src/grabFeedData";

export default {
  name: "Atom language from content element",
  test: () => {
    const xml = `
<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title type="text">Feed title</title>
  <entry>
    <title>Entry title</title>
    <content type="text" xml:lang="en-au">
      Entry content
    </content>
  </entry>
</feed>
`;

    const actual = grabFeedData(xml);

    assert.equal(actual.language, "en-au");
  },
};
