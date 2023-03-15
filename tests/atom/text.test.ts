import { test } from "uvu";
import * as assert from "uvu/assert";
import grabFeedData from "../../src/grabFeedData";

test("Atom text content", () => {
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
});

test("Atom html content", () => {
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
});

test("Atom xhtml content", () => {
  const xml = `
<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title type="xhtml" xmlns:xhtml="http://www.w3.org/1999/xhtml">
    <xhtml:div>
      Less: <xhtml:em> &lt; </xhtml:em>
    </xhtml:div>
  </title>
</feed>
`;

  const actual = grabFeedData(xml);

  assert.equal(actual.title, "<div>\n      Less: <em> < </em>\n    </div>");
});

test.run();
