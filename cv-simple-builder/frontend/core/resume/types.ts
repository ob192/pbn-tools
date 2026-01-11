export type RenderMode = 'web' | 'print';

export interface ProfileImage {
    url: string;
    alt: string;
}

export interface WhoData {
    fullName: string;
    title: string;
    location: string;
}

export interface ContactItem {
    id: string;
    label: string;
    value: string;
    icon?: string;
}

export interface ExperienceItem {
    id: string;
    company: string;
    role: string;
    period: string;
    description: string;
}

export interface EducationItem {
    id: string;
    institution: string;
    degree: string;
    period: string;
    description: string;
}

export type ContentMode = 'markdown' | 'form';
export type BulletStyle = 'disc' | 'circle' | 'square' | 'arrow' | 'arrow-right' | 'chevron' | 'check' | 'plus' | 'star' | 'diamond';
export type HeadingStyle = 'bold' | 'bold-underline' | 'bold-border' | 'bold-background' | 'uppercase-spaced';

export interface StyleSettings {
    headingStyle: HeadingStyle;
    subheadingStyle: HeadingStyle;
    bulletStyle: BulletStyle;
    headingColor: string;
    subheadingColor: string;
    accentColor: string;
    bulletColor: string;
    contactSeparator: string;
}

export interface ResumeData {
    profileImage: ProfileImage | null;
    who: WhoData;
    contacts: ContactItem[];
    markdownContent: string;
    summary: string;
    experience: ExperienceItem[];
    education: EducationItem[];
    contentMode: ContentMode;
    styleSettings: StyleSettings;
}

export interface TemplateProps {
    data: ResumeData;
    renderMode: RenderMode;
}

export interface BlockProps {
    renderMode: RenderMode;
}