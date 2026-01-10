'use client';

import { useResumeStore } from '@/store/useResumeStore';
import { BulletStyle, HeadingStyle } from '@/core/resume/types';
import { COLOR_PALETTES, SEPARATOR_OPTIONS } from '@/core/resume/defaults';
import { Palette, Type, List, Minus } from 'lucide-react';

export function StylingStep() {
    const { resume, setStyleSettings } = useResumeStore();
    const { styleSettings } = resume;

    const headingStyles: { value: HeadingStyle; label: string; preview: string }[] = [
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
            <div className="flex items-center gap-3 mb-2">
                <Palette className="text-blue-600" size={28} />
                <h2 className="text-2xl font-bold text-gray-900">
                    Customize Styling
                </h2>
            </div>
            <p className="text-gray-600 mb-8">
                Personalize your CV's appearance with colors and formatting
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
                                onClick={() => setStyleSettings({
                                    headingColor: palette.headingColor,
                                    subheadingColor: palette.subheadingColor,
                                    accentColor: palette.accentColor,
                                    bulletColor: palette.bulletColor,
                                })}
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
                                    <div
                                        className="w-8 h-8 rounded"
                                        style={{ backgroundColor: palette.headingColor }}
                                        title="Heading"
                                    />
                                    <div
                                        className="w-8 h-8 rounded"
                                        style={{ backgroundColor: palette.subheadingColor }}
                                        title="Subheading"
                                    />
                                    <div
                                        className="w-8 h-8 rounded"
                                        style={{ backgroundColor: palette.accentColor }}
                                        title="Accent"
                                    />
                                    <div
                                        className="w-8 h-8 rounded"
                                        style={{ backgroundColor: palette.bulletColor }}
                                        title="Bullets"
                                    />
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
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Heading Color
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="color"
                                    value={styleSettings.headingColor}
                                    onChange={(e) => setStyleSettings({ headingColor: e.target.value })}
                                    className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={styleSettings.headingColor}
                                    onChange={(e) => setStyleSettings({ headingColor: e.target.value })}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                                    placeholder="#000000"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Subheading Color
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="color"
                                    value={styleSettings.subheadingColor}
                                    onChange={(e) => setStyleSettings({ subheadingColor: e.target.value })}
                                    className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={styleSettings.subheadingColor}
                                    onChange={(e) => setStyleSettings({ subheadingColor: e.target.value })}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                                    placeholder="#000000"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Accent Color
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="color"
                                    value={styleSettings.accentColor}
                                    onChange={(e) => setStyleSettings({ accentColor: e.target.value })}
                                    className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={styleSettings.accentColor}
                                    onChange={(e) => setStyleSettings({ accentColor: e.target.value })}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                                    placeholder="#000000"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Bullet Color
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="color"
                                    value={styleSettings.bulletColor}
                                    onChange={(e) => setStyleSettings({ bulletColor: e.target.value })}
                                    className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={styleSettings.bulletColor}
                                    onChange={(e) => setStyleSettings({ bulletColor: e.target.value })}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                                    placeholder="#000000"
                                />
                            </div>
                        </div>
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
                                <div className="text-xs text-gray-600 text-center">{option.label}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Heading Style */}
                <div className="pt-6 border-t">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Type size={20} className="text-gray-600" />
                        Main Heading Style (H2)
                    </h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {headingStyles.map((style) => (
                            <button
                                key={style.value}
                                onClick={() => setStyleSettings({ headingStyle: style.value })}
                                className={`p-4 border-2 rounded-lg transition-all text-left ${
                                    styleSettings.headingStyle === style.value
                                        ? 'border-blue-600 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <div className="text-sm font-medium text-gray-600 mb-2">
                                    {style.label}
                                </div>
                                <div
                                    className={`text-lg ${
                                        style.value === 'bold' ? 'font-bold' :
                                            style.value === 'bold-underline' ? 'font-bold border-b-2 pb-1' :
                                                style.value === 'bold-border' ? 'font-bold border-b-4 pb-2' :
                                                    style.value === 'bold-background' ? 'font-bold px-2 py-1 -mx-2 rounded bg-gray-100' :
                                                        'font-bold uppercase tracking-wider text-sm'
                                    }`}
                                    style={{
                                        color: styleSettings.headingColor,
                                        borderColor: styleSettings.headingColor
                                    }}
                                >
                                    {style.preview}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Subheading Style */}
                <div className="pt-6 border-t">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Subheading Style (H3)
                    </h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {headingStyles.map((style) => (
                            <button
                                key={style.value}
                                onClick={() => setStyleSettings({ subheadingStyle: style.value })}
                                className={`p-4 border-2 rounded-lg transition-all text-left ${
                                    styleSettings.subheadingStyle === style.value
                                        ? 'border-blue-600 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <div className="text-sm font-medium text-gray-600 mb-2">
                                    {style.label}
                                </div>
                                <div
                                    className={`text-base ${
                                        style.value === 'bold' ? 'font-bold' :
                                            style.value === 'bold-underline' ? 'font-bold border-b-2 pb-1' :
                                                style.value === 'bold-border' ? 'font-bold border-b-4 pb-2' :
                                                    style.value === 'bold-background' ? 'font-bold px-2 py-1 -mx-2 rounded bg-gray-100' :
                                                        'font-bold uppercase tracking-wider text-xs'
                                    }`}
                                    style={{
                                        color: styleSettings.subheadingColor,
                                        borderColor: styleSettings.subheadingColor
                                    }}
                                >
                                    {style.preview}
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
                                <div className="text-3xl text-center mb-2" style={{ color: styleSettings.bulletColor }}>
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