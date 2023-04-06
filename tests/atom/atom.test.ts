import { test } from "uvu";
import allFields from "./all-fields";
import contentHtml from "./content-html";
import contentText from "./content-text";
import contentXhtml from "./content-xhtml";
import languageFromContent from "./language-from-content";
import languageFromEntry from "./language-from-entry";
import languageFromFeed from "./language-from-feed";
import sample from "./sample";

addTest(allFields);
addTest(contentHtml);
addTest(contentText);
addTest(contentXhtml);
addTest(languageFromContent);
addTest(languageFromEntry);
addTest(languageFromFeed);
addTest(sample);

function addTest(x: any) {
  test(x.name, x.test);
}

test.run();
