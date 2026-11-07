import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { VideoCard } from "../../src/components/danslab/VideoCard";
import { VIDEOS, type Video } from "../../src/lib/videos";

const BASE: Omit<Video, "source"> = { id: "sample", title: "The Sample", tagline: "A line.", length: "1:00" };

function renderCard(source: Video["source"]): string {
  return renderToStaticMarkup(createElement(VideoCard, { video: { ...BASE, source } }));
}

test("every video has a unique id, a title and a length", () => {
  assert.equal(new Set(VIDEOS.map((video) => video.id)).size, VIDEOS.length);
  for (const video of VIDEOS) {
    assert.ok(video.title.trim(), `${video.id} has no title`);
    assert.match(video.length, /^\d{1,2}:\d{2}$/, `${video.id} has a bad length`);
  }
});

test("the page lists all twelve YouTube episodes with valid ids", () => {
  const ids = VIDEOS.flatMap((video) => (video.source.kind === "youtube" ? [video.source.id] : []));
  assert.equal(ids.length, 12);
  for (const id of ids) {
    assert.match(id, /^[\w-]{11}$/);
  }
});

test("The Evolution is first, with no player until it has a YouTube link", () => {
  const [first] = VIDEOS;
  assert.equal(first.title, "The Evolution");
  assert.equal(first.source.kind, "soon");
});

test("coming-soon posters exist on disk", () => {
  for (const { source } of VIDEOS) {
    if (source.kind === "soon") {
      assert.ok(existsSync(new URL(`../../public${source.poster}`, import.meta.url)), `${source.poster} is missing`);
    }
  }
});

test("a YouTube video renders the privacy-enhanced embed, lazily", () => {
  const html = renderCard({ kind: "youtube", id: "abc123DEF45" });
  assert.match(html, /<iframe[^>]*src="https:\/\/www\.youtube-nocookie\.com\/embed\/abc123DEF45"/);
  assert.match(html, /loading="lazy"/);
  assert.match(html, /The Sample/);
});

test("a coming-soon video renders a label and no player", () => {
  const html = renderCard({ kind: "soon", poster: "/videos/sample.jpg" });
  assert.match(html, /Coming soon/);
  assert.doesNotMatch(html, /<iframe/);
});
