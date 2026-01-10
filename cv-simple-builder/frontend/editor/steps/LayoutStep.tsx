'use client';

import { useResumeStore } from '@/store/useResumeStore';
import { SEPARATOR_OPTIONS } from '@/core/resume/defaults';

export function LayoutStep() {
    const { resume, setLayoutSettings } = useResumeStore();
    const { layoutSettings } = resume;

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Layout Settings
            </h2>
            <p className="text-gray-600 mb-8">
                Customize spacing and margins for your CV
            </p>

            <div className="space-y-8">
                {/* Margins */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Page Margins (mm)
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Top Margin: {layoutSettings.marginTop}mm
                            </label>
                            <input
                                type="range"
                                min="10"
                                max="40"
                                step="5"
                                value={layoutSettings.marginTop}
                                onChange={(e) => setLayoutSettings({ marginTop: Number(e.target.value) })}
                                className="w-full"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>10mm</span>
                                <span>40mm</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Bottom Margin: {layoutSettings.marginBottom}mm
                            </label>
                            <input
                                type="range"
                                min="10"
                                max="40"
                                step="5"
                                value={layoutSettings.marginBottom}
                                onChange={(e) => setLayoutSettings({ marginBottom: Number(e.target.value) })}
                                className="w-full"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>10mm</span>
                                <span>40mm</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Left Margin: {layoutSettings.marginLeft}mm
                            </label>
                            <input
                                type="range"
                                min="10"
                                max="40"
                                step="5"
                                value={layoutSettings.marginLeft}
                                onChange={(e) => setLayoutSettings({ marginLeft: Number(e.target.value) })}
                                className="w-full"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>10mm</span>
                                <span>40mm</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Right Margin: {layoutSettings.marginRight}mm
                            </label>
                            <input
                                type="range"
                                min="10"
                                max="40"
                                step="5"
                                value={layoutSettings.marginRight}
                                onChange={(e) => setLayoutSettings({ marginRight: Number(e.target.value) })}
                                className="w-full"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>10mm</span>
                                <span>40mm</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Spacing */}
                <div className="pt-6 border-t">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Text Spacing
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Line Height: {layoutSettings.lineHeight.toFixed(1)}
                            </label>
                            <input
                                type="range"
                                min="1.2"
                                max="2.0"
                                step="0.1"
                                value={layoutSettings.lineHeight}
                                onChange={(e) => setLayoutSettings({ lineHeight: Number(e.target.value) })}
                                className="w-full"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>Tight (1.2)</span>
                                <span>Loose (2.0)</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Paragraph Spacing: {layoutSettings.paragraphSpacing.toFixed(2)}rem
                            </label>
                            <input
                                type="range"
                                min="0.25"
                                max="1.5"
                                step="0.25"
                                value={layoutSettings.paragraphSpacing}
                                onChange={(e) => setLayoutSettings({ paragraphSpacing: Number(e.target.value) })}
                                className="w-full"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>Compact (0.25)</span>
                                <span>Spacious (1.5)</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Separator */}
                <div className="pt-6 border-t">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Contact Separator
                    </h3>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                        {SEPARATOR_OPTIONS.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => setLayoutSettings({ contactSeparator: option.value })}
                                className={`p-3 border-2 rounded-lg transition-all ${
                                    layoutSettings.contactSeparator === option.value
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

                {/* Preview */}
                <div className="pt-6 border-t">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Preview
                    </h3>
                    <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                        <div
                            className="bg-white p-6 rounded shadow-sm"
                            style={{
                                lineHeight: layoutSettings.lineHeight,
                            }}
                        >
                            <p className="text-gray-700" style={{ marginBottom: `${layoutSettings.paragraphSpacing}rem` }}>
                                This is a paragraph with current line height and spacing settings.
                                Notice how the text flows with the selected line height.
                            </p>
                            <p className="text-gray-700" style={{ marginBottom: `${layoutSettings.paragraphSpacing}rem` }}>
                                This is another paragraph to demonstrate paragraph spacing.
                                You can adjust these values to make your CV more compact or spacious.
                            </p>

                            <div className="mt-4 pt-4 border-t">
                                <div className="text-sm text-gray-600 text-center flex items-center justify-center gap-3">
                                    <span>email@example.com</span>
                                    <span className="text-gray-400">{layoutSettings.contactSeparator}</span>
                                    <span>+1 234 567 890</span>
                                    <span className="text-gray-400">{layoutSettings.contactSeparator}</span>
                                    <span>linkedin.com/in/profile</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}