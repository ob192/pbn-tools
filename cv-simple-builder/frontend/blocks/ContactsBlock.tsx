import { BlockProps, ContactItem } from '@/core/resume/types';

interface ContactsBlockProps extends BlockProps {
    contacts: ContactItem[];
    separator: string;
}

export function ContactsBlock({ contacts, separator, renderMode }: ContactsBlockProps) {
    if (contacts.length === 0) return null;

    const textSize = renderMode === 'print' ? 'text-xs' : 'text-sm';

    return (
        <div className="mb-8">
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-1">
                {contacts.map((contact, index) => (
                    <div key={contact.id} className="flex items-center gap-3">
                        <div className={`${textSize} text-gray-700 flex items-center gap-1.5`}>
                            {contact.icon && <span>{contact.icon}</span>}
                            {renderMode === 'print' ? (
                                <span>{contact.value}</span>
                            ) : (
                                <a
                                    href={
                                        contact.label.toLowerCase().includes('email')
                                            ? `mailto:${contact.value}`
                                            : contact.label.toLowerCase().includes('phone')
                                                ? `tel:${contact.value}`
                                                : contact.value.startsWith('http')
                                                    ? contact.value
                                                    : `https://${contact.value}`
                                    }
                                    className="hover:text-blue-600 transition-colors"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {contact.value}
                                </a>
                            )}
                        </div>
                        {index < contacts.length - 1 && (
                            <span className="text-gray-400 text-sm">{separator}</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}