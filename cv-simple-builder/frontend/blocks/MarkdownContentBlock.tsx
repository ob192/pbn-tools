import { BlockProps, StyleSettings, BulletStyle, HeadingStyle } from '@/core/resume/types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownContentBlockProps extends BlockProps {
    content: string;
    styleSettings: StyleSettings;
}

function getBulletChar(style: BulletStyle): string {
    switch (style) {
        case 'circle': return '◦';
        case 'square': return '▪';
        case 'arrow': return '➤';
        case 'arrow-right': return '→';
        case 'chevron': return '›';
        case 'check': return '✓';
        case 'plus': return '+';
        case 'star': return '★';
        case 'diamond': return '◆';
        case 'disc':
        default: return '•';
    }
}

function getHeadingClasses(style: HeadingStyle, color: string, baseSize: string): string {
    const colorClass = `text-[${color}]`;
    let styleClass = '';

    switch (style) {
        case 'bold':
            styleClass = 'font-bold';
            break;
        case 'bold-underline':
            styleClass = 'font-bold border-b-2 pb-1';
            break;
        case 'bold-border':
            styleClass = 'font-bold border-b-4 pb-2';
            break;
        case 'bold-background':
            styleClass = 'font-bold px-3 py-1 -mx-3 rounded';
            break;
        case 'uppercase-spaced':
            styleClass = 'font-bold uppercase tracking-wider';
            break;
    }

    return `${baseSize} ${styleClass} ${colorClass} mb-4 mt-8 first:mt-0`;
}

export function MarkdownContentBlock({
                                         content,
                                         styleSettings,
                                         renderMode
                                     }: MarkdownContentBlockProps) {
    if (!content.trim()) return null;

    const textSize = renderMode === 'print' ? 'text-sm' : 'text-base';
    const bulletChar = getBulletChar(styleSettings.bulletStyle);
    const bulletSize = ['star', 'check', 'plus'].includes(styleSettings.bulletStyle) ? '1.1em' : '1em';

    return (
        <div className={`${textSize} prose prose-sm max-w-none markdown-content-wrapper`}>
            <style jsx global>{`
                .markdown-content ul {
                    list-style: none;
                    padding-left: 1.5rem;
                    margin-bottom: 1.25rem;
                }

                .markdown-content ul li {
                    position: relative;
                    padding-left: 0.5rem;
                    margin-bottom: 0.5rem;
                }

                .markdown-content ul li::before {
                    content: '${bulletChar}';
                    position: absolute;
                    left: -1.5rem;
                    color: ${styleSettings.bulletColor};
                    font-weight: bold;
                    font-size: ${bulletSize};
                }

                .markdown-content p {
                    margin-bottom: 1rem;
                }

                .markdown-content h1 {
                    margin-top: 2rem;
                    margin-bottom: 1rem;
                }

                .markdown-content h2 {
                    margin-top: 1.75rem;
                    margin-bottom: 0.875rem;
                }

                .markdown-content h3 {
                    margin-top: 1.5rem;
                    margin-bottom: 0.75rem;
                }

                .markdown-content h4 {
                    margin-top: 1.25rem;
                    margin-bottom: 0.625rem;
                }

                .markdown-content h1:first-child,
                .markdown-content h2:first-child,
                .markdown-content h3:first-child,
                .markdown-content h4:first-child {
                    margin-top: 0;
                }

                .markdown-content-h1-bg {
                    background-color: ${styleSettings.headingColor}15;
                }
                .markdown-content-h2-bg {
                    background-color: ${styleSettings.headingColor}15;
                }
                .markdown-content-h3-bg {
                    background-color: ${styleSettings.subheadingColor}15;
                }
                .markdown-content-h4-bg {
                    background-color: ${styleSettings.subheadingColor}15;
                }

                @media print {
                    .markdown-content-wrapper h1,
                    .markdown-content-wrapper h2,
                    .markdown-content-wrapper h3,
                    .markdown-content-wrapper h4 {
                        page-break-after: avoid;
                        break-after: avoid;
                        page-break-inside: avoid;
                        break-inside: avoid;
                    }

                    .markdown-content-wrapper p,
                    .markdown-content-wrapper ul,
                    .markdown-content-wrapper ol,
                    .markdown-content-wrapper blockquote {
                        page-break-inside: avoid;
                        break-inside: avoid;
                        orphans: 3;
                        widows: 3;
                    }

                    .markdown-content-wrapper li {
                        page-break-inside: avoid;
                        break-inside: avoid;
                    }
                }
            `}</style>

            <div className="markdown-content">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        h1: ({ node, ...props }) => (
                            <h1
                                className={getHeadingClasses(
                                    styleSettings.headingStyle,
                                    styleSettings.headingColor,
                                    'text-3xl'
                                ) + (styleSettings.headingStyle === 'bold-background' ? ' markdown-content-h1-bg' : '')}
                                style={{
                                    color: styleSettings.headingColor,
                                    borderColor: styleSettings.headingColor,
                                }}
                                {...props}
                            />
                        ),
                        h2: ({ node, ...props }) => (
                            <h2
                                className={getHeadingClasses(
                                    styleSettings.headingStyle,
                                    styleSettings.headingColor,
                                    'text-2xl'
                                ) + (styleSettings.headingStyle === 'bold-background' ? ' markdown-content-h2-bg' : '')}
                                style={{
                                    color: styleSettings.headingColor,
                                    borderColor: styleSettings.headingColor,
                                }}
                                {...props}
                            />
                        ),
                        h3: ({ node, ...props }) => (
                            <h3
                                className={getHeadingClasses(
                                    styleSettings.subheadingStyle,
                                    styleSettings.subheadingColor,
                                    'text-xl'
                                ) + (styleSettings.subheadingStyle === 'bold-background' ? ' markdown-content-h3-bg' : '')}
                                style={{
                                    color: styleSettings.subheadingColor,
                                    borderColor: styleSettings.subheadingColor,
                                }}
                                {...props}
                            />
                        ),
                        h4: ({ node, ...props }) => (
                            <h4
                                className={getHeadingClasses(
                                    styleSettings.subheadingStyle,
                                    styleSettings.subheadingColor,
                                    'text-lg'
                                ) + (styleSettings.subheadingStyle === 'bold-background' ? ' markdown-content-h4-bg' : '')}
                                style={{
                                    color: styleSettings.subheadingColor,
                                    borderColor: styleSettings.subheadingColor,
                                }}
                                {...props}
                            />
                        ),
                        p: ({ node, ...props }) => (
                            <p className="text-gray-700" {...props} />
                        ),
                        ul: ({ node, ...props }) => (
                            <ul className="text-gray-700" {...props} />
                        ),
                        ol: ({ node, ...props }) => (
                            <ol className="text-gray-700 pl-6 list-decimal mb-4" {...props} />
                        ),
                        li: ({ node, ...props }) => (
                            <li {...props} />
                        ),
                        strong: ({ node, ...props }) => (
                            <strong
                                className="font-semibold"
                                style={{ color: styleSettings.accentColor }}
                                {...props}
                            />
                        ),
                        em: ({ node, ...props }) => (
                            <em
                                className="italic"
                                style={{ color: styleSettings.subheadingColor }}
                                {...props}
                            />
                        ),
                        blockquote: ({ node, ...props }) => (
                            <blockquote
                                className="border-l-4 pl-4 italic my-4"
                                style={{ borderColor: styleSettings.accentColor }}
                                {...props}
                            />
                        ),
                        code: ({ node, inline, ...props }: any) =>
                            inline ? (
                                <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono" {...props} />
                            ) : (
                                <code className="block bg-gray-100 p-3 rounded overflow-x-auto mb-3 text-sm font-mono" {...props} />
                            ),
                        a: ({ node, ...props }) => (
                            <a
                                className="underline hover:no-underline"
                                style={{ color: styleSettings.accentColor }}
                                {...props}
                            />
                        ),
                        hr: ({ node, ...props }) => (
                            <hr className="my-6 border-gray-300" {...props} />
                        ),
                    }}
                >
                    {content}
                </ReactMarkdown>
            </div>
        </div>
    );
}