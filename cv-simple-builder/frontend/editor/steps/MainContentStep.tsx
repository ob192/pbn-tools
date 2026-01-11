'use client';

import { useResumeStore } from '@/store/useResumeStore';
import { MarkdownEditor } from '@/editor/components/MarkdownEditor';
import { SOFTWARE_DEV_SAMPLE_MARKDOWN } from '@/editor/samples/resumeSamples';
import { useState } from 'react';
import {
    FileText,
    Layout,
    Plus,
    Trash2,
    BookOpen,
    Briefcase,
} from 'lucide-react';

export function MainContentStep() {
    const {
        resume,
        setMarkdownContent,
        setSummary,
        addExperience,
        updateExperience,
        removeExperience,
        addEducation,
        updateEducation,
        removeEducation,
        setContentMode,
        syncMarkdownToForm,
        syncFormToMarkdown,
    } = useResumeStore();

    const [localMode, setLocalMode] = useState(resume.contentMode);
    const [copied, setCopied] = useState(false);

    const handleModeSwitch = (newMode: 'markdown' | 'form') => {
        if (newMode === 'form' && localMode === 'markdown') {
            syncMarkdownToForm();
        } else if (newMode === 'markdown' && localMode === 'form') {
            syncFormToMarkdown();
        }
        setLocalMode(newMode);
        setContentMode(newMode);
    };

    const handleInsertSample = () => {
        setMarkdownContent(SOFTWARE_DEV_SAMPLE_MARKDOWN);
    };

    const handleCopySample = async () => {
        await navigator.clipboard.writeText(SOFTWARE_DEV_SAMPLE_MARKDOWN);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:justify-between sm:items-start">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <FileText className="text-blue-600" size={28} />
                        <h2 className="text-2xl font-bold text-gray-900">
                            Resume Content
                        </h2>
                    </div>
                    <p className="text-gray-600">
                        Write your CV in Markdown or use the structured form
                    </p>
                </div>

                {/* Mode Toggle */}
                <div className="flex w-full sm:w-auto bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => handleModeSwitch('markdown')}
                        className={`flex-1 sm:flex-none px-4 py-3 rounded-md text-sm font-medium
                        transition-colors flex items-center justify-center gap-2
                        ${
                            localMode === 'markdown'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        <FileText size={16} />
                        Markdown
                    </button>
                    <button
                        onClick={() => handleModeSwitch('form')}
                        className={`flex-1 sm:flex-none px-4 py-3 rounded-md text-sm font-medium
                        transition-colors flex items-center justify-center gap-2
                        ${
                            localMode === 'form'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        <Layout size={16} />
                        Form
                    </button>
                </div>
            </div>

            {/* MARKDOWN MODE */}
            {localMode === 'markdown' ? (
                <div>
                    {/* Sample Section */}
                    <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-3">
                        <p className="text-sm text-gray-700">
                            💡 <strong>Sample content:</strong> Written for
                            <strong> Software Developers</strong>, but works for
                            <strong> any profession</strong>.
                        </p>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <button
                                onClick={handleInsertSample}
                                className="w-full sm:w-auto px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                            >
                                Use sample as starting point
                            </button>

                            <button
                                onClick={handleCopySample}
                                className="w-full sm:w-auto px-4 py-3 border border-gray-300 rounded-lg
                                hover:bg-gray-100 transition-colors text-sm flex items-center justify-center gap-2"
                            >
                                {copied ? '✅ Copied!' : 'Copy sample to clipboard'}
                            </button>
                        </div>

                        {copied && (
                            <p className="text-sm text-green-600">
                                Sample content copied to clipboard
                            </p>
                        )}
                    </div>

                    {/* Markdown Tips */}
                    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h3 className="font-semibold text-blue-900 mb-3">
                            💡 Markdown Tips
                        </h3>
                        <div className="text-sm text-blue-800 space-y-2">
                            <p>✨ Write freely — beautifully rendered</p>
                            <p>🧩 Use #, ##, ### for sections</p>
                            <p>📌 Use - for bullet points</p>
                        </div>
                    </div>

                    <MarkdownEditor
                        value={resume.markdownContent}
                        onChange={setMarkdownContent}
                        placeholder="Write your CV content here using Markdown..."
                        rows={16}
                        className="min-h-[60vh] sm:min-h-[500px]"
                    />
                </div>
            ) : (
                /* FORM MODE */
                <div className="space-y-8">
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-sm text-amber-800">
                            💡 <strong>Tip:</strong> Markdown mode is more flexible.
                        </p>
                    </div>

                    {/* Summary */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <FileText size={20} />
                            Professional Summary
                        </h3>
                        <MarkdownEditor
                            value={resume.summary}
                            onChange={setSummary}
                            rows={3}
                            className="min-h-[120px]"
                        />
                    </div>

                    {/* Experience */}
                    <div className="pt-6 border-t">
                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center mb-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Briefcase size={20} />
                                Professional Experience
                            </h3>
                            <button
                                onClick={addExperience}
                                className="w-full sm:w-auto px-4 py-3 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2"
                            >
                                <Plus size={16} /> Add Experience
                            </button>
                        </div>

                        <div className="space-y-6">
                            {resume.experience.map((exp, idx) => (
                                <div
                                    key={exp.id}
                                    className="p-4 border rounded-lg space-y-3"
                                >
                                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
                                        <span className="text-sm text-gray-600">
                                            Experience #{idx + 1}
                                        </span>
                                        <button
                                            onClick={() => removeExperience(exp.id)}
                                            className="text-red-600 text-sm flex items-center gap-1"
                                        >
                                            <Trash2 size={14} />
                                            Remove
                                        </button>
                                    </div>

                                    <MarkdownEditor
                                        value={exp.description}
                                        onChange={(v) =>
                                            updateExperience(exp.id, {
                                                description: v,
                                            })
                                        }
                                        rows={4}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Education */}
                    <div className="pt-6 border-t">
                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center mb-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <BookOpen size={20} />
                                Education
                            </h3>
                            <button
                                onClick={addEducation}
                                className="w-full sm:w-auto px-4 py-3 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2"
                            >
                                <Plus size={16} /> Add Education
                            </button>
                        </div>

                        <div className="space-y-6">
                            {resume.education.map((edu, idx) => (
                                <div
                                    key={edu.id}
                                    className="p-4 border rounded-lg space-y-3"
                                >
                                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
                                        <span className="text-sm text-gray-600">
                                            Education #{idx + 1}
                                        </span>
                                        <button
                                            onClick={() => removeEducation(edu.id)}
                                            className="text-red-600 text-sm flex items-center gap-1"
                                        >
                                            <Trash2 size={14} />
                                            Remove
                                        </button>
                                    </div>

                                    <MarkdownEditor
                                        value={edu.description}
                                        onChange={(v) =>
                                            updateEducation(edu.id, { description: v })
                                        }
                                        rows={3}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
