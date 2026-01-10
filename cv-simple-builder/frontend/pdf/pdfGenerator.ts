import jsPDF from 'jspdf';
import { ResumeData } from '@/core/resume/types';

interface PdfSection {
    type: 'h1' | 'h2' | 'h3' | 'h4' | 'paragraph' | 'list' | 'contact';
    content: string;
    style?: {
        color?: string;
        fontSize?: number;
        bold?: boolean;
        italic?: boolean;
        underline?: boolean;
    };
    items?: string[];
}

export class PdfGenerator {
    private pdf: jsPDF;
    private currentY: number;
    private pageWidth: number;
    private pageHeight: number;
    private margins: { top: number; bottom: number; left: number; right: number };
    private contentWidth: number;

    constructor() {
        this.pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        });

        this.pageWidth = 210;
        this.pageHeight = 297;
        this.margins = { top: 20, bottom: 20, left: 20, right: 20 };
        this.contentWidth = this.pageWidth - this.margins.left - this.margins.right;
        this.currentY = this.margins.top;
    }

    /** Spacing BEFORE blocks (prevents headings sticking to previous text) */
    private addBlockSpacing(space: number): void {
        if (this.currentY > this.margins.top + 1) {
            this.currentY += space;
        }
    }

    private checkPageBreak(requiredHeight: number): void {
        const availableHeight = this.pageHeight - this.margins.bottom;
        if (this.currentY + requiredHeight > availableHeight) {
            this.pdf.addPage();
            this.currentY = this.margins.top;
        }
    }

    private hexToRgb(hex: string): { r: number; g: number; b: number } {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
            ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
            : { r: 0, g: 0, b: 0 };
    }

    private parseMarkdownToSections(markdown: string): PdfSection[] {
        const sections: PdfSection[] = [];
        const lines = markdown.split('\n');
        let i = 0;

        while (i < lines.length) {
            const line = lines[i].trim();
            if (!line) {
                i++;
                continue;
            }

            // IMPORTANT: check longest first so #### doesn't get caught by ###
            if (line.startsWith('#### ')) {
                sections.push({ type: 'h4', content: line.replace('#### ', '') });
                i++;
                continue;
            }

            if (line.startsWith('### ')) {
                sections.push({ type: 'h3', content: line.replace('### ', '') });
                i++;
                continue;
            }

            if (line.startsWith('## ')) {
                sections.push({ type: 'h2', content: line.replace('## ', '') });
                i++;
                continue;
            }

            if (line.startsWith('# ')) {
                sections.push({ type: 'h1', content: line.replace('# ', '') });
                i++;
                continue;
            }

            // List
            if (line.startsWith('- ') || line.startsWith('* ')) {
                const items: string[] = [];
                while (i < lines.length && (lines[i].trim().startsWith('- ') || lines[i].trim().startsWith('* '))) {
                    items.push(lines[i].trim().substring(2));
                    i++;
                }
                sections.push({ type: 'list', content: '', items });
                continue;
            }

            // Paragraph (including italic-only line detection)
            if (line.match(/^\*.+\*$/)) {
                sections.push({
                    type: 'paragraph',
                    content: line.replace(/^\*|\*$/g, ''),
                    style: { italic: true },
                });
                i++;
            } else {
                sections.push({ type: 'paragraph', content: line });
                i++;
            }
        }

        return sections;
    }

    private cleanMarkdown(text: string): string {
        return text
            .replace(/\*\*(.+?)\*\*/g, '$1') // Bold
            .replace(/\*(.+?)\*/g, '$1') // Italic
            .replace(/`(.+?)`/g, '$1') // Code
            .replace(/\[(.+?)\]\(.+?\)/g, '$1'); // Links
    }

    private splitTextToLines(text: string, maxWidth: number, fontSize: number): string[] {
        this.pdf.setFontSize(fontSize);
        const words = text.split(' ');
        const lines: string[] = [];
        let currentLine = '';

        for (const word of words) {
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            const textWidth = this.pdf.getTextWidth(testLine);

            if (textWidth > maxWidth && currentLine) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        }

        if (currentLine) lines.push(currentLine);
        return lines;
    }

    public generateFromData(data: ResumeData): jsPDF {
        const { who, contacts, markdownContent, styleSettings } = data;

        // Header - Name and Title
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.setFontSize(24);
        this.pdf.setTextColor(0, 0, 0);

        const nameWidth = this.pdf.getTextWidth(who.fullName);
        const nameX = (this.pageWidth - nameWidth) / 2;
        this.pdf.text(who.fullName, nameX, this.currentY);
        this.currentY += 8;

        // Title
        if (who.title) {
            this.pdf.setFont('helvetica', 'normal');
            this.pdf.setFontSize(14);
            const titleWidth = this.pdf.getTextWidth(who.title);
            const titleX = (this.pageWidth - titleWidth) / 2;
            this.pdf.text(who.title, titleX, this.currentY);
            this.currentY += 6;
        }

        // Location
        if (who.location) {
            this.pdf.setFont('helvetica', 'normal');
            this.pdf.setFontSize(10);
            this.pdf.setTextColor(100, 100, 100);
            const locationWidth = this.pdf.getTextWidth(who.location);
            const locationX = (this.pageWidth - locationWidth) / 2;
            this.pdf.text(who.location, locationX, this.currentY);
            this.currentY += 5;
        }

        // Contacts
        if (contacts.length > 0) {
            this.currentY += 2;
            this.pdf.setFont('helvetica', 'normal');
            this.pdf.setFontSize(9);
            this.pdf.setTextColor(60, 60, 60);

            const separator = ` ${styleSettings.contactSeparator} `;
            const contactTexts = contacts.map(c => c.value);
            const contactLine = contactTexts.join(separator);

            const contactWidth = this.pdf.getTextWidth(contactLine);
            const contactX = (this.pageWidth - contactWidth) / 2;
            this.pdf.text(contactLine, contactX, this.currentY);
            this.currentY += 10;
        }

        // Content
        const sections = this.parseMarkdownToSections(this.normalizeArrows(markdownContent));
        const headingColor = this.hexToRgb(styleSettings.headingColor);
        const subheadingColor = this.hexToRgb(styleSettings.subheadingColor);
        const bulletColor = this.hexToRgb(styleSettings.bulletColor);

        sections.forEach((section) => {
            // H1 (#)
            if (section.type === 'h1') {
                this.addBlockSpacing(8);
                this.checkPageBreak(16);

                this.pdf.setFont('helvetica', 'bold');
                this.pdf.setFontSize(18);
                this.pdf.setTextColor(headingColor.r, headingColor.g, headingColor.b);
                this.pdf.text(this.cleanMarkdown(section.content), this.margins.left, this.currentY);

                // Optional underline/border (same rules as before)
                if (styleSettings.headingStyle === 'bold-underline' || styleSettings.headingStyle === 'bold-border') {
                    const lineWidth = styleSettings.headingStyle === 'bold-border' ? 1.2 : 0.6;
                    this.pdf.setLineWidth(lineWidth);
                    this.pdf.setDrawColor(headingColor.r, headingColor.g, headingColor.b);
                    this.pdf.line(
                        this.margins.left,
                        this.currentY + 1.5,
                        this.margins.left + this.contentWidth,
                        this.currentY + 1.5
                    );
                }

                this.currentY += 9;
            }

            // H2 (##)
            else if (section.type === 'h2') {
                this.addBlockSpacing(6);
                this.checkPageBreak(12);

                this.pdf.setFont('helvetica', 'bold');
                this.pdf.setFontSize(16);
                this.pdf.setTextColor(headingColor.r, headingColor.g, headingColor.b);
                this.pdf.text(this.cleanMarkdown(section.content), this.margins.left, this.currentY);

                if (styleSettings.headingStyle === 'bold-underline' || styleSettings.headingStyle === 'bold-border') {
                    const lineWidth = styleSettings.headingStyle === 'bold-border' ? 1 : 0.5;
                    this.pdf.setLineWidth(lineWidth);
                    this.pdf.setDrawColor(headingColor.r, headingColor.g, headingColor.b);
                    this.pdf.line(
                        this.margins.left,
                        this.currentY + 1,
                        this.margins.left + this.contentWidth,
                        this.currentY + 1
                    );
                }

                this.currentY += 8;
            }

            // H3 (###)
            else if (section.type === 'h3') {
                this.addBlockSpacing(4);
                this.checkPageBreak(10);

                this.pdf.setFont('helvetica', 'bold');
                this.pdf.setFontSize(12);
                this.pdf.setTextColor(subheadingColor.r, subheadingColor.g, subheadingColor.b);
                this.pdf.text(this.cleanMarkdown(section.content), this.margins.left, this.currentY);

                this.currentY += 6;
            }

            // H4 (####)
            else if (section.type === 'h4') {
                this.addBlockSpacing(3);
                this.checkPageBreak(9);

                this.pdf.setFont('helvetica', 'bold');
                this.pdf.setFontSize(11);
                this.pdf.setTextColor(subheadingColor.r, subheadingColor.g, subheadingColor.b);
                this.pdf.text(this.cleanMarkdown(section.content), this.margins.left, this.currentY);

                this.currentY += 5.5;
            }

            // Paragraph
            else if (section.type === 'paragraph') {
                const fontSize = section.style?.italic ? 9 : 10;
                const font = section.style?.italic ? 'italic' : 'normal';

                this.pdf.setFont('helvetica', font);
                this.pdf.setFontSize(fontSize);
                this.pdf.setTextColor(80, 80, 80);

                const lines = this.splitTextToLines(
                    this.cleanMarkdown(section.content),
                    this.contentWidth,
                    fontSize
                );

                lines.forEach((line) => {
                    this.checkPageBreak(5);
                    this.pdf.text(line, this.margins.left, this.currentY);
                    this.currentY += 4.5;
                });

                this.currentY += 1;
            }

            // List
            else if (section.type === 'list' && section.items) {
                this.addBlockSpacing(2);

                this.pdf.setFont('helvetica', 'normal');
                this.pdf.setFontSize(10);
                this.pdf.setTextColor(60, 60, 60);

                const bulletChar = this.getBulletChar(styleSettings.bulletStyle);
                const bulletX = this.margins.left + 2;
                const textX = this.margins.left + 7;

                section.items.forEach((item) => {
                    const lines = this.splitTextToLines(
                        this.cleanMarkdown(item),
                        this.contentWidth - 7,
                        10
                    );

                    this.checkPageBreak(lines.length * 4.5 + 1);

                    // Bullet
                    this.pdf.setTextColor(bulletColor.r, bulletColor.g, bulletColor.b);
                    this.pdf.text(bulletChar, bulletX, this.currentY);

                    // Text
                    this.pdf.setTextColor(60, 60, 60);
                    lines.forEach((line, idx) => {
                        this.pdf.text(line, textX, this.currentY + idx * 4.5);
                    });

                    this.currentY += lines.length * 4.5 + 1;
                });

                this.currentY += 2;
            }
        });

        return this.pdf;
    }

    private getBulletChar(style: string): string {
        switch (style) {
            case 'circle': return '◦';
            case 'square': return '▪';
            case 'arrow': return '➤';
            case 'arrow-right': return '→';
            case 'chevron': return '›';
            case 'check': return '✓';
            case 'plus': return '+';
            case 'star': return '★';
            case 'diamond': return '◆';
            case 'disc':
            default: return '•';
        }
    }

    private normalizeArrows(text: string): string {
        return text
            .replace(/\u2192/g, '->')
            .replace(/\u21D2/g, '=>')
            .replace(/\u2190/g, '<-')
            .replace(/\u21D0/g, '<=');
    }


    public save(filename: string): void {
        this.pdf.save(filename);
    }
}

export function generatePdf(data: ResumeData, filename: string): void {
    const generator = new PdfGenerator();
    generator.generateFromData(data);
    generator.save(filename);
}
