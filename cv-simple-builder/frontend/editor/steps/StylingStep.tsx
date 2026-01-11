'use client';

import { useResumeStore } from '@/store/useResumeStore';
import { BulletStyle, HeadingStyle } from '@/core/resume/types';
import { COLOR_PALETTES, SEPARATOR_OPTIONS } from '@/core/resume/defaults';
import { Palette, Type, List, Minus } from 'lucide-react';

/* -----------------------------
   Reusable Color Picker
------------------------------ */
function ColorPicker({
                         label,
                         value,
                         onChange,
                     }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
}) {
    return (
        <div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                </label>

                <div className="flex gap-2 items-center min-w-0">
                    {/* Color swatch */}
                    <label className="relative w-12 h-10 cursor-pointer flex-shrink-0">
                        <input
                            type="color"
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <div
                            className="w-12 h-10 rounded border border-gray-300"
                            style={{ backgroundColor: value }}
                        />
                    </label>

                    {/* Hex input */}
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="h-10 min-w-0 flex-1 px-3 border border-gray-300 rounded-lg font-mono text-sm"
                        placeholder="#000000"
                    />
                </div>
            </div>
        </div>
    );
}

/* -----------------------------
   Main Component
------------------------------ */
export function StylingStep() {
    const { resume, setStyleSettings } = useResumeStore();
    const { styleSettings } = resume;

    const headingStyles: {
        value: HeadingStyle;
        label: string;
        preview: string;
    }[] = [
        { value: 'bold', label: 'Bold', preview: 'Professional Experience' },
        { value: 'bold-underline', label: 'Bold + Underline', preview: 'Professional Experience' },
        { value: 'bold-border', label: 'Bold + Thick Border', preview: 'Professional Experience' },
        { value: 'bold-background', label: 'Bold + Background', preview: 'Professional Experience' },
        { value: 'uppercase-spaced', label: 'Uppercase Spaced', preview: 'PROFESSIONAL EXPERIENCE' },
    ];

    const bulletStyles: { value: BulletStyle; label: string; char: string }[] = [
        { value: 'disc', label: 'Disc', char: '•' },
        { value: 'circle', label: 'Circle', char: '◦' },
        { value: 'square', label: 'Square', char: '▪' },
        { value: 'arrow', label: 'Arrow', char: '➤' },
        { value: 'arrow-right', label: 'Arrow Right', char: '→' },
        { value: 'chevron', label: 'Chevron', char: '›' },
        { value: 'check', label: 'Check', char: '✓' },
        { value: 'plus', label: 'Plus', char: '+' },
        { value: 'star', label: 'Star', char: '★' },
        { value: 'diamond', label: 'Diamond', char: '◆' },
    ];

    return (
        <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-2">
                <Palette className="text-blue-600" size={28} />
                <h2 className="text-2xl font-bold text-gray-900">
                    Customize Styling
                </h2>
            </div>
            <p className="text-gray-600 mb-8">
                Personalize your CV&apos;s appearance with colors and formatting
            </p>

            <div className="space-y-8">
                {/* Color Palettes */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Palette size={20} className="text-gray-600" />
                        Color Palette
                    </h3>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {COLOR_PALETTES.map((palette) => (
                            <button
                                key={palette.name}
                                onClick={() =>
                                    setStyleSettings({
                                        headingColor: palette.headingColor,
                                        subheadingColor: palette.subheadingColor,
                                        accentColor: palette.accentColor,
                                        bulletColor: palette.bulletColor,
                                    })
                                }
                                className={`p-4 border-2 rounded-lg transition-all text-left ${
                                    styleSettings.headingColor === palette.headingColor
                                        ? 'border-blue-600 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <div className="font-semibold text-gray-900 mb-3">
                                    {palette.name}
                                </div>

                                <div className="flex gap-2">
                                    <div className="w-8 h-8 rounded" style={{ backgroundColor: palette.headingColor }} />
                                    <div className="w-8 h-8 rounded" style={{ backgroundColor: palette.subheadingColor }} />
                                    <div className="w-8 h-8 rounded" style={{ backgroundColor: palette.accentColor }} />
                                    <div className="w-8 h-8 rounded" style={{ backgroundColor: palette.bulletColor }} />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Custom Colors */}
                <div className="pt-6 border-t">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Custom Colors
                    </h3>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
                        <ColorPicker
                            label="Heading Color"
                            value={styleSettings.headingColor}
                            onChange={(v) => setStyleSettings({ headingColor: v })}
                        />
                        <ColorPicker
                            label="Subheading Color"
                            value={styleSettings.subheadingColor}
                            onChange={(v) => setStyleSettings({ subheadingColor: v })}
                        />
                        <ColorPicker
                            label="Accent Color"
                            value={styleSettings.accentColor}
                            onChange={(v) => setStyleSettings({ accentColor: v })}
                        />
                        <ColorPicker
                            label="Bullet Color"
                            value={styleSettings.bulletColor}
                            onChange={(v) => setStyleSettings({ bulletColor: v })}
                        />
                    </div>
                </div>

                {/* Contact Separator */}
                <div className="pt-6 border-t">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Minus size={20} className="text-gray-600" />
                        Contact Separator
                    </h3>

                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                        {SEPARATOR_OPTIONS.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => setStyleSettings({ contactSeparator: option.value })}
                                className={`p-3 border-2 rounded-lg transition-all ${
                                    styleSettings.contactSeparator === option.value
                                        ? 'border-blue-600 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <div className="text-2xl text-center mb-1">{option.value}</div>
                                <div className="text-xs text-gray-600 text-center">
                                    {option.label}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Bullet Style */}
                <div className="pt-6 border-t">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <List size={20} className="text-gray-600" />
                        Bullet Point Style
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                        {bulletStyles.map((style) => (
                            <button
                                key={style.value}
                                onClick={() => setStyleSettings({ bulletStyle: style.value })}
                                className={`p-4 border-2 rounded-lg transition-all ${
                                    styleSettings.bulletStyle === style.value
                                        ? 'border-blue-600 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <div
                                    className="text-3xl text-center mb-2"
                                    style={{ color: styleSettings.bulletColor }}
                                >
                                    {style.char}
                                </div>
                                <div className="text-sm font-medium text-gray-700 text-center">
                                    {style.label}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
