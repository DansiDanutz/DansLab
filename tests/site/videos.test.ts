import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { VideoCard } from "../../src/components/danslab/VideoCard";
import { VIDEOS, type Video } from "../../src/lib/videos";

const RELEASE_URL = "https://github.com/DansiDanutz/Claude-Youtube/releases/download/episodes-v1/";

const BASE: Omit<Video, "source"> = {
  id: "sample",
  title: "The Sample",
  tagline: "A line.",
  length: "1:00",
  poster: "/videos/sample.jpg",
};

function renderCard(source: Video["source"]): string {
  return renderToStaticMarkup(createElement(VideoCard, { video: { ...BASE, source } }));
}

test("every video has a unique id, a title, a length and a poster on disk", () => {
  assert.equal(new Set(VIDEOS.map((video) => video.id)).size, VIDEOS.length);
  for (const video of VIDEOS) {
    assert.ok(video.title.trim(), `${video.id} has no title`);
    assert.match(video.length, /^\d{1,2}:\d{2}$/, `${video.id} has a bad length`);
    const poster = new URL(`../../public${video.poster}`, import.meta.url);
    assert.ok(existsSync(poster), `${video.poster} is missing`);
  }
});

test("the page lists the eleven episodes in order, after The Evolution", () => {
  assert.deepEqual(
    VIDEOS.map((video) => video.title),
    [
      "The Evolution",
      "The Origin",
      "The Survivors",
      "The Trader",
      "The Overseer",
      "The Brain",
      "The Marketplace",
      "The Factory",
      "The Studio",
      "The Player",
      "The Payroll",
      "The Flywheel",
    ],
  );
});

test("playable files come from the public episodes release, in 1080p", () => {
  const files = VIDEOS.flatMap((video) => (video.source.kind === "file" ? [video.source.url] : []));
  assert.equal(files.length, 11);
  for (const url of files) {
    assert.ok(url.startsWith(RELEASE_URL), `${url} is outside the release`);
    assert.match(url, /1080P/);
  }
});

test("The Evolution has no player until it has a YouTube link", () => {
  const evolution = VIDEOS.find((video) => video.id === "the-evolution");
  assert.equal(evolution?.source.kind, "soon");
});

test("a file video renders a player that downloads nothing until pressed", () => {
  const html = renderCard({ kind: "file", url: `${RELEASE_URL}sample.mp4` });
  assert.match(html, /<video[^>]*controls/);
  assert.match(html, /preload="none"/);
  assert.match(html, /poster="\/videos\/sample\.jpg"/);
  assert.match(html, /The Sample/);
});

test("a YouTube video renders the privacy-enhanced embed", () => {
  const html = renderCard({ kind: "youtube", id: "abc123DEF45" });
  assert.match(html, /<iframe[^>]*src="https:\/\/www\.youtube-nocookie\.com\/embed\/abc123DEF45"/);
  assert.match(html, /loading="lazy"/);
  assert.doesNotMatch(html, /<video/);
});

test("a coming-soon video renders a label and no player", () => {
  const html = renderCard({ kind: "soon" });
  assert.match(html, /Coming soon/);
  assert.doesNotMatch(html, /<video|<iframe/);
});
