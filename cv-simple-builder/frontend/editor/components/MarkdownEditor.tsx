'use client';

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
    rows?: number;
    className?: string;
}

export function MarkdownEditor({
                                   value,
                                   onChange,
                                   placeholder = 'Enter markdown here...',
                                   label,
                                   rows = 6,
                                   className,
                               }: MarkdownEditorProps) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                </label>
            )}

            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={rows}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg
                focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y
                font-mono text-sm ${className ?? ''}`}
            />

            <p className="mt-1 text-xs text-gray-500">
                Supports Markdown formatting (bold, italic, lists, etc.)
            </p>
        </div>
    );
}
