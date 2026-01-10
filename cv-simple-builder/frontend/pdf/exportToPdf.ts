import { ResumeData } from '@/core/resume/types';
import { generatePdf } from './pdfGenerator';

/**
 * Export resume to PDF using native text rendering
 * This method renders text as actual text (selectable, searchable)
 * rather than as images
 */
export async function exportToPdf(
    data: ResumeData,
    filename: string = 'resume.pdf'
): Promise<void> {
    try {
        // Use the advanced PDF generator that renders text properly
        generatePdf(data, filename);
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw error;
    }
}