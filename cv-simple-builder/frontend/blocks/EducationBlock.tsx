import { BlockProps, EducationItem } from '@/core/resume/types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface EducationBlockProps extends BlockProps {
    items: EducationItem[];
}

export function EducationBlock({ items, renderMode }: EducationBlockProps) {
    if (items.length === 0) return null;

    const titleSize = renderMode === 'print' ? 'text-lg' : 'text-xl';
    const itemTitleSize = renderMode === 'print' ? 'text-base' : 'text-lg';
    const textSize = renderMode === 'print' ? 'text-sm' : 'text-base';

    return (
        <div className="mb-8">
            <h2 className={`${titleSize} font-bold text-gray-900 mb-3 border-b-2 border-gray-300 pb-1`}>
                Education
            </h2>
            <div className="space-y-6">
                {items.map((item) => (
                    <div key={item.id} className="break-inside-avoid">
                        <div className="mb-2">
                            <h3 className={`${itemTitleSize} font-semibold text-gray-900`}>
                                {item.degree || 'Degree'}
                            </h3>
                            <div className="flex justify-between items-baseline flex-wrap gap-2">
                                <p className={`${textSize} text-gray-700 font-medium`}>
                                    {item.institution || 'Institution'}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {item.period || 'Period'}
                                </p>
                            </div>
                        </div>
                        {item.description && (
                            <div className={`${textSize} text-gray-700 prose prose-sm max-w-none`}>
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {item.description}
                                </ReactMarkdown>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}