# grab-feed-data

Grabs feed and entry data out of an RSS, Atom or JSON Feed file.

## Installation

Use `npm` (or `yarn`, or `pnpm`) to add grab-feed-data to your project:

```bash
npm install grab-feed-data
```

grab-feed-data contains CommonJS and ESM modules for use in Node, in the browser and at the edge.

## Usage

```ts
import { grabFeedData } from 'grab-feed-data';
const xml = '<xml></xml>';
const feed = grabFeedData(xml);
```

## Fields

### Feed

| Property     | RSS                         | Atom                              | JSON           |
| ------------ | --------------------------- | --------------------------------- | -------------- |
| type         | "rss"                       | "atom"                            | "json"         |
| title        | title                       | title                             | title          |
| description  | description                 | subtitle                          | description    |
| homeUrl      | link                        | link with rel=nothing/"alternate" | home_page_url  |
| feedUrl      | -                           | link with rel="self"              | feed_url       |
| language     | language                    | xml:lang on feed/entry/content    | language       |
| copyright    | copyright/dc:rights         | rights                            | -              |
| author       | managingEditor or webMaster | author                            | -              |
| contributors | dc:creator                  | contributor                       | authors/author |
| publishedAt  | pubDate                     | -                                 | -              |
| updatedAt    | lastBuildDate               | updated                           | -              |
| image        | image                       | logo                              | icon           |
| icon         | -                           | icon                              | favicon        |
| categories   | category                    | category                          | -              |
| generator    | generator                   | generator                         | -              |
| entries      | item                        | entry                             | item           |

### Entry

| Property     | RSS         | Atom                                     | JSON           |
| ------------ | ----------- | ---------------------------------------- | -------------- |
| title        | title       | title                                    | title          |
| summary      | -           | summary                                  | summary        |
| content      | description | content with type=nothing/"html"/"xhtml" | content_html   |
| contentText  | -           | content with type="text"                 | content_text   |
| entryUrl     | link        | link with rel=nothing/"alternate"        | link           |
| externalUrl  | -           | -                                        | external_url   |
| author       | author      | author                                   | -              |
| contributors | dc:creator  | contributor                              | authors/author |
| publishedAt  | pubDate     | -                                        | date_published |
| updatedAt    | -           | updated                                  | date_modified  |
| guid         | guid        | id                                       | id             |
| commentsUrl  | comments    | link with rel="replies"                  | -              |
| image        | -           | -                                        | -              |
| categories   | category    | category                                 | fields         |
| source       | source      | -                                        | -              |
| attachments  | enclosure   | link with rel="enclosure"                | attachments    |

## Other Functions

### grabFeedLinks

Parses an HTML file to retrieve an array of links to feeds.

```ts
import { grabFeedLinks } from 'grab-feed-data';
const html = '<html></html>';
const links = grabFeedLinks(html);
```

### grabXmlFeedData and grabJsonFeedData

`grabFeedData` just checks the first character of the text passed to it to decide whether it will be parsing XML or JSON. If that's not sufficient, and you know what format you have, you can call the `grabXmlFeedData` or `grabJsonFeedData` methods directly.

```ts
import { grabXmlFeedData } from 'grab-feed-data';
const xml = '<xml></xml>';
const feed = grabXmlFeedData(xml);
```

```ts
import { grabJsonFeedData } from 'grab-feed-data';
const json = '{}';
const feed = grabJsonFeedData({});
```

### grabOpmlData

Parses an [OPML](http://opml.org/) file, which is commonly used to move lists of feeds between services.

```ts
import { grabOpmlData } from 'grab-feed-data';
const xml = '<opml></opml>';
const opml = grabOpmlData(xml);
```
