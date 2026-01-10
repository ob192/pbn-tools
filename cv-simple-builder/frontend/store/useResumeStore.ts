import { create } from 'zustand';
import {
    ResumeData,
    ExperienceItem,
    EducationItem,
    ProfileImage,
    WhoData,
    ContactItem,
    ContentMode,
    StyleSettings,
    LayoutSettings
} from '@/core/resume/types';
import { DEFAULT_RESUME } from '@/core/resume/defaults';

interface ResumeStore {
    resume: ResumeData;
    setTemplateId: (id: string) => void;
    setProfileImage: (image: ProfileImage | null) => void;
    setWho: (who: WhoData) => void;
    // NEW: Contact management
    setContacts: (contacts: ContactItem[]) => void;
    addContact: (contact?: Partial<ContactItem>) => void;
    updateContact: (id: string, data: Partial<ContactItem>) => void;
    removeContact: (id: string) => void;
    setMarkdownContent: (content: string) => void;
    setSummary: (summary: string) => void;
    setExperience: (experience: ExperienceItem[]) => void;
    addExperience: () => void;
    updateExperience: (id: string, data: Partial<ExperienceItem>) => void;
    removeExperience: (id: string) => void;
    setEducation: (education: EducationItem[]) => void;
    addEducation: () => void;
    updateEducation: (id: string, data: Partial<EducationItem>) => void;
    removeEducation: (id: string) => void;
    setContentMode: (mode: ContentMode) => void;
    syncMarkdownToForm: () => void;
    syncFormToMarkdown: () => void;
    setStyleSettings: (settings: Partial<StyleSettings>) => void;
    setLayoutSettings: (settings: Partial<LayoutSettings>) => void;
}

// Helper functions remain the same...
function formDataToMarkdown(resume: ResumeData): string {
    let markdown = '';

    if (resume.summary) {
        markdown += `${resume.summary}\n\n`;
    }

    if (resume.experience.length > 0) {
        markdown += `## Professional Experience\n\n`;
        resume.experience.forEach((exp) => {
            markdown += `### ${exp.role}${exp.company ? ` at ${exp.company}` : ''}\n`;
            if (exp.period) {
                markdown += `*${exp.period}*\n\n`;
            }
            if (exp.description) {
                markdown += `${exp.description}\n\n`;
            }
        });
    }

    if (resume.education.length > 0) {
        markdown += `## Education\n\n`;
        resume.education.forEach((edu) => {
            markdown += `### ${edu.degree}\n`;
            if (edu.institution || edu.period) {
                const parts = [];
                if (edu.institution) parts.push(`**${edu.institution}**`);
                if (edu.period) parts.push(`*${edu.period}*`);
                markdown += `${parts.join(' | ')}\n\n`;
            }
            if (edu.description) {
                markdown += `${edu.description}\n\n`;
            }
        });
    }

    return markdown.trim();
}

function markdownToFormData(markdown: string): Partial<ResumeData> {
    const lines = markdown.split('\n');
    const result: Partial<ResumeData> = {
        summary: '',
        experience: [],
        education: [],
    };

    let currentSection: 'summary' | 'experience' | 'education' | null = 'summary';
    let currentItem: any = null;
    let contentBuffer: string[] = [];

    const flushContent = () => {
        if (contentBuffer.length > 0) {
            const content = contentBuffer.join('\n').trim();
            if (currentSection === 'summary' && !currentItem) {
                result.summary = (result.summary ? result.summary + '\n\n' : '') + content;
            } else if (currentItem) {
                currentItem.description = content;
            }
            contentBuffer = [];
        }
    };

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.match(/^##\s+Professional Experience/i)) {
            flushContent();
            currentSection = 'experience';
            currentItem = null;
            continue;
        } else if (line.match(/^##\s+Education/i)) {
            flushContent();
            currentSection = 'education';
            currentItem = null;
            continue;
        } else if (line.match(/^##\s+/)) {
            if (!currentItem) {
                contentBuffer.push(line);
            }
            continue;
        }

        if (currentSection === 'experience' && line.startsWith('### ')) {
            flushContent();
            const titleMatch = line.match(/### (.+?)(?:\s+at\s+(.+))?$/);
            if (titleMatch) {
                currentItem = {
                    id: `exp-${Date.now()}-${Math.random()}`,
                    role: titleMatch[1]?.trim() || '',
                    company: titleMatch[2]?.trim() || '',
                    period: '',
                    description: '',
                };
                result.experience!.push(currentItem);
            }
        } else if (currentSection === 'experience' && currentItem && line.match(/^\*.+\*$/)) {
            currentItem.period = line.replace(/^\*|\*$/g, '').trim();
        } else if (currentSection === 'experience' && currentItem && line.trim() && !line.startsWith('#')) {
            contentBuffer.push(line);
        } else if (currentSection === 'experience' && !currentItem && line.trim() && !line.startsWith('#')) {
            contentBuffer.push(line);
        }

        if (currentSection === 'education' && line.startsWith('### ')) {
            flushContent();
            currentItem = {
                id: `edu-${Date.now()}-${Math.random()}`,
                degree: line.replace('### ', '').trim(),
                institution: '',
                period: '',
                description: '',
            };
            result.education!.push(currentItem);
        } else if (currentSection === 'education' && currentItem && line.match(/\*\*(.+?)\*\*\s*\|\s*\*(.+?)\*/)) {
            const match = line.match(/\*\*(.+?)\*\*\s*\|\s*\*(.+?)\*/);
            if (match) {
                currentItem.institution = match[1].trim();
                currentItem.period = match[2].trim();
            }
        } else if (currentSection === 'education' && currentItem && line.match(/^\*\*(.+?)\*\*$/)) {
            const match = line.match(/^\*\*(.+?)\*\*$/);
            if (match) {
                currentItem.institution = match[1].trim();
            }
        } else if (currentSection === 'education' && currentItem && line.match(/^\*(.+?)\*$/)) {
            const match = line.match(/^\*(.+?)\*$/);
            if (match) {
                currentItem.period = match[1].trim();
            }
        } else if (currentSection === 'education' && currentItem && line.trim() && !line.startsWith('#') && !line.includes('**')) {
            contentBuffer.push(line);
        } else if (currentSection === 'education' && !currentItem && line.trim() && !line.startsWith('#')) {
            contentBuffer.push(line);
        }

        if (currentSection === 'summary' && !currentItem && line.trim() && !line.startsWith('##')) {
            contentBuffer.push(line);
        }
    }

    flushContent();

    return result;
}

export const useResumeStore = create<ResumeStore>((set, get) => ({
    resume: DEFAULT_RESUME,

    setTemplateId: (id) =>
        set((state) => ({
            resume: { ...state.resume, templateId: id },
        })),

    setProfileImage: (image) =>
        set((state) => ({
            resume: { ...state.resume, profileImage: image },
        })),

    setWho: (who) =>
        set((state) => ({
            resume: { ...state.resume, who },
        })),

    // NEW: Contact management
    setContacts: (contacts) =>
        set((state) => ({
            resume: { ...state.resume, contacts },
        })),

    addContact: (contact = {}) =>
        set((state) => ({
            resume: {
                ...state.resume,
                contacts: [
                    ...state.resume.contacts,
                    {
                        id: `contact-${Date.now()}`,
                        label: contact.label || '',
                        value: contact.value || '',
                        icon: contact.icon || '',
                    },
                ],
            },
        })),

    updateContact: (id, data) =>
        set((state) => ({
            resume: {
                ...state.resume,
                contacts: state.resume.contacts.map((item) =>
                    item.id === id ? { ...item, ...data } : item
                ),
            },
        })),

    removeContact: (id) =>
        set((state) => ({
            resume: {
                ...state.resume,
                contacts: state.resume.contacts.filter((item) => item.id !== id),
            },
        })),

    setMarkdownContent: (content) =>
        set((state) => ({
            resume: { ...state.resume, markdownContent: content },
        })),

    setSummary: (summary) =>
        set((state) => ({
            resume: { ...state.resume, summary },
        })),

    setExperience: (experience) =>
        set((state) => ({
            resume: { ...state.resume, experience },
        })),

    addExperience: () =>
        set((state) => ({
            resume: {
                ...state.resume,
                experience: [
                    ...state.resume.experience,
                    {
                        id: `exp-${Date.now()}`,
                        company: '',
                        role: '',
                        period: '',
                        description: '',
                    },
                ],
            },
        })),

    updateExperience: (id, data) =>
        set((state) => ({
            resume: {
                ...state.resume,
                experience: state.resume.experience.map((item) =>
                    item.id === id ? { ...item, ...data } : item
                ),
            },
        })),

    removeExperience: (id) =>
        set((state) => ({
            resume: {
                ...state.resume,
                experience: state.resume.experience.filter((item) => item.id !== id),
            },
        })),

    setEducation: (education) =>
        set((state) => ({
            resume: { ...state.resume, education },
        })),

    addEducation: () =>
        set((state) => ({
            resume: {
                ...state.resume,
                education: [
                    ...state.resume.education,
                    {
                        id: `edu-${Date.now()}`,
                        institution: '',
                        degree: '',
                        period: '',
                        description: '',
                    },
                ],
            },
        })),

    updateEducation: (id, data) =>
        set((state) => ({
            resume: {
                ...state.resume,
                education: state.resume.education.map((item) =>
                    item.id === id ? { ...item, ...data } : item
                ),
            },
        })),

    removeEducation: (id) =>
        set((state) => ({
            resume: {
                ...state.resume,
                education: state.resume.education.filter((item) => item.id !== id),
            },
        })),

    setContentMode: (mode) =>
        set((state) => ({
            resume: { ...state.resume, contentMode: mode },
        })),

    syncMarkdownToForm: () =>
        set((state) => {
            const parsed = markdownToFormData(state.resume.markdownContent);
            return {
                resume: {
                    ...state.resume,
                    summary: parsed.summary || '',
                    experience: parsed.experience || [],
                    education: parsed.education || [],
                },
            };
        }),

    syncFormToMarkdown: () =>
        set((state) => {
            const markdown = formDataToMarkdown(state.resume);
            return {
                resume: {
                    ...state.resume,
                    markdownContent: markdown,
                },
            };
        }),

    setStyleSettings: (settings) =>
        set((state) => ({
            resume: {
                ...state.resume,
                styleSettings: { ...state.resume.styleSettings, ...settings }
            },
        })),

// Add to store implementation:
    setLayoutSettings: (settings) =>
        set((state) => ({
            resume: {
                ...state.resume,
                layoutSettings: { ...state.resume.layoutSettings, ...settings }
            },
        })),

}));