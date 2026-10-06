import { NextResponse } from "next/server";
import { createHash } from "crypto";
import type { NewsItem } from "@/features/news/types";

const BASE_URL = "https://freenewsapi.ai/v1/search";
const NEWS_QUERY = "cryptocurrency"; // change to "forex" etc. if needed

// ---- helpers: the response shape isn't documented to me, so be defensive ----
const pick = (obj: unknown, keys: string[]): unknown => {
  const source = obj as Record<string, unknown> | null | undefined;

  for (const k of keys) {
    const v = source?.[k];
    if (v !== undefined && v !== null && v !== "") return v;
  }
  return undefined;
};

function toUnixSeconds(value: unknown): number {
  if (typeof value === "number") {
    return value > 1e12 ? Math.floor(value / 1000) : Math.floor(value);
  }
  if (typeof value === "string") {
    const ms = Date.parse(value);
    if (!Number.isNaN(ms)) return Math.floor(ms / 1000);
  }
  return Math.floor(Date.now() / 1000);
}

function extractArticles(json: unknown): unknown[] {
  if (Array.isArray(json)) return json;
  if (typeof json === "object" && json !== null) {
    for (const key of ["articles", "results", "data", "items", "news"]) {
      const value = (json as Record<string, unknown>)[key];
      if (Array.isArray(value)) return value;
    }
  }
  return [];
}

export async function GET() {
  const headers: HeadersInit = {};
  // Only if the API requires a key — adjust the header name per its docs
  if (process.env.FREENEWSAPI_KEY) {
    headers.authorization = `Bearer ${process.env.FREENEWSAPI_KEY}`;
  }

  const res = await fetch(
    `${BASE_URL}?q=${encodeURIComponent(NEWS_QUERY)}&size=20`,
    { headers, next: { revalidate: 300 } },
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: `News provider error: ${res.status}` },
      { status: 502 },
    );
  }

  const json = await res.json();

  const news: NewsItem[] = extractArticles(json)
    .map((n): NewsItem | null => {
      const title = pick(n, ["title", "headline"]);
      const url = pick(n, ["url", "link", "source_url"]);
      if (!title || !url) return null;

      const src = pick(n, ["source", "source_name", "publisher", "domain"]);
      const categories = pick(n, ["categories", "tags", "topics"]);
      const imageUrl = pick(n, [
        "image",
        "image_url",
        "imageUrl",
        "urlToImage",
        "thumbnail",
        "cover",
      ]);

      return {
        // no id from the API -> stable short hash of the URL
        id: String(
          pick(n, ["id", "uuid"]) ??
            createHash("sha1").update(String(url)).digest("hex").slice(0, 16),
        ),
        title: String(title),
        body: String(
          pick(n, ["description", "summary", "content", "snippet", "body"]) ?? "",
        ),
        imageUrl: imageUrl == null ? null : String(imageUrl),
        url: String(url),
        source:
          typeof src === "object" && src !== null && "name" in src
            ? String(src.name ?? "")
            : String(src ?? ""),
        publishedAt: toUnixSeconds(
          pick(n, ["published_at", "publishedAt", "published", "date", "pubDate", "timestamp"]),
        ),
        categories: Array.isArray(categories)
          ? categories.map((c: unknown) => {
              if (typeof c === "object" && c !== null && "name" in c) {
                return String((c as { name?: unknown }).name ?? c);
              }
              return String(c);
            }).slice(0, 4)
          : [],
      };
    })
    .filter((n): n is NewsItem => n !== null);

  return NextResponse.json({ news });
}
