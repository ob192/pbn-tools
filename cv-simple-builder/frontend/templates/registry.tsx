import { MinimalTemplate } from './MinimalTemplate';
import { TemplateProps } from '@/core/resume/types';

export interface TemplateDefinition {
    id: string;
    name: string;
    description: string;
    component: React.ComponentType<TemplateProps>;
}

export const TEMPLATES: TemplateDefinition[] = [
    {
        id: 'minimal',
        name: 'Minimal',
        description: 'Clean, professional single-column layout',
        component: MinimalTemplate,
    },
];

export function getTemplateById(id: string): TemplateDefinition {
    return TEMPLATES[0]; // Always return the only template
}