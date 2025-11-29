// File: components/MarkdownRenderer.tsx
import React from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import type { PluggableList } from "unified";

interface MarkdownRendererProps {
    content: string;
}

// Custom MDX components
const components = {
    h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
        <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />
    ),
    h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
        <h2 className="text-2xl font-bold mt-6 mb-3" {...props} />
    ),
    h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
        <h3 className="text-xl font-semibold mt-4 mb-2" {...props} />
    ),
    p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
        <p className="my-4 leading-7" {...props} />
    ),
    ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
        <ul className="my-4 ml-6 list-disc" {...props} />
    ),
    ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
        <ol className="my-4 ml-6 list-decimal" {...props} />
    ),
    li: (props: React.HTMLAttributes<HTMLLIElement>) => (
        <li className="my-1" {...props} />
    ),
    code: (props: React.HTMLAttributes<HTMLElement>) => (
        <code
            className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono"
            {...props}
        />
    ),
    pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
        <pre
            className="bg-muted p-4 rounded-lg overflow-x-auto my-4"
            {...props}
        />
    ),
    blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
        <blockquote
            className="border-l-4 border-primary pl-4 italic my-4"
            {...props}
        />
    ),
    table: (props: React.HTMLAttributes<HTMLTableElement>) => (
        <div className="overflow-x-auto my-4">
            <table className="w-full border-collapse" {...props} />
        </div>
    ),
    th: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
        <th
            className="border border-border px-4 py-2 bg-muted font-semibold"
            {...props}
        />
    ),
    td: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
        <td className="border border-border px-4 py-2" {...props} />
    ),
    a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
        <a className="text-primary hover:underline" {...props} />
    ),
    img: function MDXImage(props: React.ImgHTMLAttributes<HTMLImageElement>) {
        // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
        return <img className="rounded-lg max-w-full h-auto my-4" {...props} />;
    },
};

import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

const remarkPlugins: PluggableList = [remarkGfm, remarkMath];
const rehypePlugins: PluggableList = [rehypeSlug, rehypeKatex];


export default async function MarkdownRenderer({ content }: MarkdownRendererProps) {
    return (
        <MDXRemote
            source={content}
            components={components}
            options={{
                mdxOptions: {
                    remarkPlugins,
                    rehypePlugins,
                },
            }}
        />
    );
}