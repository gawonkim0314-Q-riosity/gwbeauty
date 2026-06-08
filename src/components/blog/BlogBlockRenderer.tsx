import type { BlogBlock } from "@/lib/blog-blocks";

interface Props {
  blocks: BlogBlock[];
  className?: string;
}

export function BlogBlockRenderer({ blocks, className = "" }: Props) {
  return (
    <article className={`blog-content space-y-6 ${className}`}>
      {blocks.map((block) => (
        <Block key={block.id} block={block} />
      ))}
    </article>
  );
}

function Block({ block }: { block: BlogBlock }) {
  switch (block.type) {
    case "heading":
      if (block.level === 3) {
        return (
          <h3 className="text-lg font-semibold text-[var(--text)] mt-8 mb-2">
            {block.text}
          </h3>
        );
      }
      return (
        <h2 className="text-xl md:text-2xl font-semibold text-[var(--text)] mt-10 mb-3 font-display">
          {block.text}
        </h2>
      );

    case "paragraph":
      return (
        <p className="text-sm md:text-base leading-relaxed text-[var(--text-2)] whitespace-pre-wrap">
          {block.text}
        </p>
      );

    case "quote":
      return (
        <blockquote
          className="border-l-4 pl-5 py-2 my-6 italic text-[var(--text-2)]"
          style={{ borderColor: "var(--purple)" }}
        >
          {block.text}
        </blockquote>
      );

    case "image":
      if (!block.url) return null;
      return (
        <figure className="my-8">
          <div
            className="aspect-[16/10] overflow-hidden rounded-2xl bg-[var(--bg-2)]"
            style={{ border: "1px solid var(--border)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={block.url}
              alt={block.alt || ""}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          {block.caption && (
            <figcaption className="mt-3 text-center text-xs text-[var(--text-3)]">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );

    case "list":
      return (
        <ul className="list-disc pl-5 space-y-2 text-sm md:text-base text-[var(--text-2)]">
          {(block.items ?? []).filter(Boolean).map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );

    case "divider":
      return (
        <hr
          className="my-10 border-0 h-px"
          style={{ background: "var(--border)" }}
        />
      );

    default:
      return null;
  }
}
