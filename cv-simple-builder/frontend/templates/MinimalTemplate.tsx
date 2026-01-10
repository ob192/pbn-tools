import { TemplateProps } from '@/core/resume/types';
import { ProfileImageBlock } from '@/blocks/ProfileImageBlock';
import { WhoBlock } from '@/blocks/WhoBlock';
import { ContactsBlock } from '@/blocks/ContactsBlock';
import { MarkdownContentBlock } from '@/blocks/MarkdownContentBlock';

export function MinimalTemplate({ data, renderMode }: TemplateProps) {
    const containerClass = renderMode === 'print'
        ? 'max-w-4xl mx-auto bg-white p-12'
        : 'max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8';

    return (
        <div className={containerClass}>
            {data.profileImage && (
                <ProfileImageBlock
                    url={data.profileImage.url}
                    alt={data.profileImage.alt}
                    renderMode={renderMode}
                />
            )}

            <WhoBlock
                data={data.who}
                renderMode={renderMode}
            />

            <ContactsBlock
                contacts={data.contacts}
                separator={data.styleSettings.contactSeparator}
                renderMode={renderMode}
            />

            <div className="mt-8">
                <MarkdownContentBlock
                    content={data.markdownContent}
                    styleSettings={data.styleSettings}
                    renderMode={renderMode}
                />
            </div>
        </div>
    );
}