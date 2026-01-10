import { BlockProps } from '@/core/resume/types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface SummaryBlockProps extends BlockProps {
    content: string;
}

export function SummaryBlock({ content, renderMode }: SummaryBlockProps) {
    if (!content.trim()) return null;

    const titleSize = renderMode === 'print' ? 'text-lg' : 'text-xl';
    const textSize = renderMode === 'print' ? 'text-sm' : 'text-base';

    return (
        <div className="mb-8">
            <h2 className={`${titleSize} font-bold text-gray-900 mb-3 border-b-2 border-gray-300 pb-1`}>
                Summary
            </h2>
            <div className={`${textSize} text-gray-700 prose prose-sm max-w-none`}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content}
                </ReactMarkdown>
            </div>
        </div>
    );
}