import { BlockProps, WhoData } from '@/core/resume/types';

interface WhoBlockProps extends BlockProps {
    data: WhoData;
}

export function WhoBlock({ data, renderMode }: WhoBlockProps) {
    const titleSize = renderMode === 'print' ? 'text-2xl' : 'text-3xl';
    const subtitleSize = renderMode === 'print' ? 'text-base' : 'text-lg';

    return (
        <div className="text-center mb-6">
            <h1 className={`${titleSize} font-bold text-gray-900 mb-2`}>
                {data.fullName || 'Your Name'}
            </h1>
            {data.title && (
                <p className={`${subtitleSize} text-gray-700 mb-1`}>
                    {data.title}
                </p>
            )}
            {data.location && (
                <p className="text-sm text-gray-600">
                    {data.location}
                </p>
            )}
        </div>
    );
}