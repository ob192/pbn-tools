'use client';

import {useResumeStore} from '@/store/useResumeStore';
import {MinimalTemplate} from '@/templates/MinimalTemplate';
import {exportToPdf} from '@/pdf/exportToPdf';
import Link from 'next/link';
import {useState} from 'react';
import {
    ArrowLeft,
    Download,
    Loader2,
    FileText,
    Sparkles,
} from 'lucide-react';

import {useEffect} from 'react';
import {gaEvent} from '@/lib/ga';


export default function PreviewPage() {

    useEffect(() => {
        gaEvent({
            action: 'lead',
            category: 'conversion',
            label: 'preview_open',
        });
    }, []);
    const {resume} = useResumeStore();
    const [isExporting, setIsExporting] = useState(false);

    const handleExportPdf = async () => {
        setIsExporting(true);
        try {
            const filename = resume.who.fullName
                ? `${resume.who.fullName.replace(/\s+/g, '_')}_CV.pdf`
                : 'resume.pdf';

            await exportToPdf(resume, filename);
        } catch (error) {
            console.error('PDF generation error:', error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Export overlay */}
            {isExporting && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-white rounded-xl p-8 shadow-xl flex flex-col items-center gap-4">
                        <Loader2 className="h-12 w-12 text-blue-600 animate-spin"/>
                        <p className="text-lg font-semibold text-gray-900">
                            Generating PDF
                        </p>
                        <p className="text-sm text-gray-600 text-center">
                            Creating your professional CV…
                        </p>
                    </div>
                </div>
            )}

            {/* Top bar */}
            <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link
                        href="/editor"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition"
                    >
                        <ArrowLeft className="h-4 w-4"/>
                        Back to Editor
                    </Link>

                    <button
                        onClick={handleExportPdf}
                        disabled={isExporting}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium
                                   hover:bg-blue-700 active:scale-[0.98] transition
                                   disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Download className="h-5 w-5"/>
                        Download PDF
                    </button>
                </div>
            </header>

            {/* Content */}
            <main className="py-8 px-4">
                <div className="max-w-5xl mx-auto space-y-4">
                    {/* Info banner */}
                    <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <Sparkles className="h-5 w-5 text-blue-600 mt-0.5"/>
                        <p className="text-sm text-blue-900">
                            <strong>Preview Mode:</strong> Your CV will be exported
                            as a searchable PDF with selectable text.
                        </p>
                    </div>

                    {/* Preview */}
                    <div className="bg-white shadow-xl rounded-xl overflow-hidden ring-1 ring-gray-200">
                        <div className="flex items-center gap-2 px-4 py-3 border-b bg-gray-50 text-sm text-gray-600">
                            <FileText className="h-4 w-4"/>
                            CV Preview
                        </div>
                        <MinimalTemplate data={resume} renderMode="web"/>
                    </div>
                </div>
            </main>
        </div>
    );
}
