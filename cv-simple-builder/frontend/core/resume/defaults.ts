import { ResumeData } from './types';

export const DEFAULT_RESUME: ResumeData = {
    profileImage: null,
    who: {
        fullName: '',
        title: '',
        location: '',
    },
    contacts: [],
    markdownContent: '',
    summary: '',
    experience: [],
    education: [],
    contentMode: 'markdown',
    styleSettings: {
        headingStyle: 'bold-underline',
        subheadingStyle: 'bold',
        bulletStyle: 'chevron',
        headingColor: '#1f2937',
        subheadingColor: '#374151',
        accentColor: '#2563eb',
        bulletColor: '#3b82f6',
        contactSeparator: '|',
    },
};

export const COLOR_PALETTES = [
    {
        name: 'Classic Blue',
        headingColor: '#1e40af',
        subheadingColor: '#3b82f6',
        accentColor: '#2563eb',
        bulletColor: '#60a5fa',
    },
    {
        name: 'Professional Gray',
        headingColor: '#1f2937',
        subheadingColor: '#374151',
        accentColor: '#4b5563',
        bulletColor: '#6b7280',
    },
    {
        name: 'Modern Teal',
        headingColor: '#0f766e',
        subheadingColor: '#14b8a6',
        accentColor: '#0d9488',
        bulletColor: '#5eead4',
    },
    {
        name: 'Elegant Purple',
        headingColor: '#6b21a8',
        subheadingColor: '#9333ea',
        accentColor: '#7c3aed',
        bulletColor: '#a78bfa',
    },
];

export const COMMON_CONTACT_TYPES = [
    { label: 'Email', icon: '✉️' },
    { label: 'Phone', icon: '📱' },
    { label: 'LinkedIn', icon: '💼' },
    { label: 'Website', icon: '🌐' },
    { label: 'GitHub', icon: '💻' },
    { label: 'Portfolio', icon: '🎨' },
];

export const SEPARATOR_OPTIONS = [
    { label: 'Pipe', value: '|' },
    { label: 'Bullet', value: '•' },
    { label: 'Slash', value: '/' },
    { label: 'Dash', value: '-' },
    { label: 'Arrow', value: '→' },
    { label: 'Comma', value: ',' },
];