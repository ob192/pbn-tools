'use client';

import { useResumeStore } from '@/store/useResumeStore';
import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

const COMPLIMENTS = [
    'Looking sharp 👌',
    'That’s a strong first impression',
    'Professional and confident 💼',
    'Great choice — this works well',
    'Clean, clear, and professional',
];

export function ImageStep() {
    const { resume, setProfileImage } = useResumeStore();

    const [preview, setPreview] = useState<string | null>(
        resume.profileImage?.url || null
    );
    const [compliment, setCompliment] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const url = reader.result as string;

            setPreview(url);
            setProfileImage({
                url,
                alt: 'Profile picture',
            });

            setCompliment(
                COMPLIMENTS[Math.floor(Math.random() * COMPLIMENTS.length)]
            );
        };
        reader.readAsDataURL(file);
    };

    const handleRemove = () => {
        setPreview(null);
        setProfileImage(null);
        setCompliment(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div>
            <div className="flex items-center gap-3 mb-2">
                <ImageIcon className="text-blue-600" size={28} />
                <h2 className="text-2xl font-bold text-gray-900">
                    Profile Picture
                </h2>
            </div>

            <p className="text-gray-600 mb-8">
                Upload a professional photo (optional)
            </p>

            <div className="flex flex-col items-center">
                {preview ? (
                    <div className="mb-6 w-full max-w-md">
                        <div className="w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-gray-200 mb-4">
                            <img
                                src={preview}
                                alt="Profile preview"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {compliment && (
                            <div className="mb-4 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
                                <p className="text-sm font-medium text-emerald-800">
                                    {compliment}
                                </p>
                            </div>
                        )}

                        <button
                            onClick={handleRemove}
                            className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                        >
                            <X size={18} />
                            Remove Image
                        </button>
                    </div>
                ) : (
                    <div className="mb-6 w-full max-w-md">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-gray-400 transition-colors">
                            <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                            <p className="text-gray-600 mb-4">
                                Click to upload or drag and drop
                            </p>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                                id="image-upload"
                            />

                            <label
                                htmlFor="image-upload"
                                className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Upload size={18} />
                                Choose File
                            </label>
                        </div>
                    </div>
                )}

                <p className="text-sm text-gray-500 text-center">
                    {preview
                        ? 'You can continue or change the image'
                        : 'Optional — skip this step if you prefer'}
                </p>
            </div>
        </div>
    );
}
