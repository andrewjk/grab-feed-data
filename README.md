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
