export async function GET(req) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BLOG ||
    "https://blog.globaltechnicalinstitute.com/";

  // Fetch slugs from WordPress custom API
  const res = await fetch(`${baseUrl}/wp-json/custom/v1/slugs`, {
    next: { revalidate: 60 }, // revalidate every 60 seconds
  });

  if (!res.ok) {
    return new Response("Failed to fetch slugs", { status: 500 });
  }

  const data = await res.json();
  const slugs = ["", "about", ...data.slugs];

  // ✅ Streaming XML response
  const stream = new ReadableStream({
    start(controller) {
      // Write XML header
      controller.enqueue(
        new TextEncoder().encode(`<?xml version="1.0" encoding="UTF-8"?>\n`)
      );
      controller.enqueue(
        new TextEncoder().encode(
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`
        )
      );

      // Stream each slug
      for (const slug of slugs) {
        const url = `https://globaltechnicalinstitute.com/${slug}`;
        controller.enqueue(
          new TextEncoder().encode(
            `  <url><loc>${url}</loc><changefreq>daily</changefreq><priority>0.7</priority></url>\n`
          )
        );
      }

      // Close XML
      controller.enqueue(new TextEncoder().encode(`</urlset>`));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
