import { BlockProps } from '@/core/resume/types';
import Image from 'next/image';

interface ProfileImageBlockProps extends BlockProps {
    url: string;
    alt: string;
}

export function ProfileImageBlock({ url, alt, renderMode }: ProfileImageBlockProps) {
    const sizeClass = renderMode === 'print' ? 'w-24 h-24' : 'w-32 h-32';

    return (
        <div className="flex justify-center mb-6">
            <div className={`${sizeClass} relative rounded-full overflow-hidden border-4 border-white shadow-lg`}>
                <img
                    src={url}
                    alt={alt}
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    );
}