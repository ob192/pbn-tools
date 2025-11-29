// File: components/Article.tsx
import React from "react";
import { SimulationFrontmatter } from "@/types/simulation";
import { Calendar, Clock, User, Tag } from "lucide-react";

interface ArticleProps {
    frontmatter: SimulationFrontmatter;
    children: React.ReactNode;
}

export default function Article({ frontmatter, children }: ArticleProps) {
    return (
        <article className="prose prose-slate dark:prose-invert max-w-none">
            <header className="not-prose mb-8 pb-8 border-b">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                    {frontmatter.title}
                </h1>

                <p className="text-lg text-muted-foreground mb-4">
                    {frontmatter.description}
                </p>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
              {new Date(frontmatter.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
              })}
          </span>

                    <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
                        {frontmatter.readTime}
          </span>

                    <span className="flex items-center gap-1">
            <User className="h-4 w-4" />
                        {frontmatter.author}
          </span>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                    {frontmatter.tags.map((tag) => (
                        <span
                            key={tag}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-secondary text-secondary-foreground text-xs"
                        >
              <Tag className="h-3 w-3" />
                            {tag}
            </span>
                    ))}
                </div>
            </header>

            <div className="mdx-content">{children}</div>
        </article>
    );
}