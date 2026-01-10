'use client';

import { useResumeStore } from '@/store/useResumeStore';
import { MarkdownEditor } from '@/editor/components/MarkdownEditor';
import { useState } from 'react';
import { FileText, Layout, Plus, Trash2, BookOpen, Briefcase } from 'lucide-react';

export function MainContentStep() {
    const {
        resume,
        setMarkdownContent,
        setSummary,
        addExperience,
        updateExperience,
        removeExperience,
        addEducation,
        updateEducation,
        removeEducation,
        setContentMode,
        syncMarkdownToForm,
        syncFormToMarkdown,
    } = useResumeStore();

    const [localMode, setLocalMode] = useState(resume.contentMode);

    const handleModeSwitch = (newMode: 'markdown' | 'form') => {
        if (newMode === 'form' && localMode === 'markdown') {
            syncMarkdownToForm();
        } else if (newMode === 'markdown' && localMode === 'form') {
            syncFormToMarkdown();
        }
        setLocalMode(newMode);
        setContentMode(newMode);
    };

    return (
        <div>
            <div className="flex justify-between items-start mb-6 gap-4 flex-wrap">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <FileText className="text-blue-600" size={28} />
                        <h2 className="text-2xl font-bold text-gray-900">
                            Resume Content
                        </h2>
                    </div>
                    <p className="text-gray-600">
                        Write your CV content in Markdown or use the structured form
                    </p>
                </div>

                {/* Mode Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => handleModeSwitch('markdown')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                            localMode === 'markdown'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        <FileText size={16} />
                        Markdown
                    </button>
                    <button
                        onClick={() => handleModeSwitch('form')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                            localMode === 'form'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        <Layout size={16} />
                        Form
                    </button>
                </div>
            </div>

            {localMode === 'markdown' ? (
                /* Markdown Mode - PRIMARY */
                <div>
                    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                            💡 Markdown Tips
                        </h3>

                        <div className="text-sm text-blue-800 space-y-2">
                            <p>
                                ✨ Write freely — your content will be beautifully rendered on your CV
                            </p>

                            <p>
                                🧩 Structure sections with{" "}
                                <code className="bg-blue-100 px-1 rounded">#</code>,{" "}
                                <code className="bg-blue-100 px-1 rounded">##</code>,{" "}
                                <code className="bg-blue-100 px-1 rounded">###</code>
                            </p>

                            <p>
                                🏷️ Use{" "}
                                <code className="bg-blue-100 px-1 rounded">### Subheading</code>{" "}
                                for roles, degrees, or positions
                            </p>

                            <p>
                                ✍️ Emphasize text with{" "}
                                <code className="bg-blue-100 px-1 rounded">**bold**</code>{" "}
                                and{" "}
                                <code className="bg-blue-100 px-1 rounded">*italic*</code>
                            </p>

                            <p>
                                📌 Create bullet points with{" "}
                                <code className="bg-blue-100 px-1 rounded">- item</code>{" "}
                                for achievements and responsibilities
                            </p>
                        </div>
                    </div>


                    <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <p className="text-sm text-gray-700">
                            💡 <strong>Note:</strong> PDF export does not yet support all Unicode characters.
                            Please avoid unsupported symbols or verify your final PDF output manually.
                        </p>
                    </div>

                    <MarkdownEditor
                        value={resume.markdownContent}
                        onChange={setMarkdownContent}
                        placeholder={`Write your CV content here using Markdown...

Example:

# About Me

Experienced software engineer with 5+ years building **scalable web applications**. Passionate about *clean code* and user experience.

## Professional Experience

### Senior Software Engineer at TechCorp
*January 2020 - Present*

- Led development of microservices architecture serving **10M+ users**
- Reduced API response time by *60%* through optimization
- Mentored team of ***5 junior developers***

### Software Engineer at StartupCo
*June 2018 - December 2019*

- Built RESTful APIs using Node.js and PostgreSQL
- Implemented CI/CD pipeline reducing deployment time by **80%**
- Collaborated with design team on user-facing features

## Education

### Bachelor of Science in Computer Science
**Stanford University** | *2014 - 2018*

- GPA: 3.8/4.0
- Dean's List all semesters
- Lead developer for senior capstone project

## Skills

#### Technical Skills
- **Languages:** JavaScript, TypeScript, Python, Go
- **Frameworks:** React, Next.js, Node.js, Express
- **Tools:** Docker, Kubernetes, AWS, PostgreSQL

#### Soft Skills
- Team leadership and mentorship
- Cross-functional collaboration
- Technical writing and documentation`}
                        rows={24}
                    />
                </div>
            ) : (
                /* Form Mode - ALTERNATIVE */
                <div className="space-y-8">
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-sm text-amber-800">
                            💡 <strong>Tip:</strong> Markdown mode is more flexible! Switch back to write freely without form constraints.
                        </p>
                    </div>

                    {/* Summary */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <FileText size={20} className="text-gray-600" />
                            Professional Summary
                        </h3>
                        <MarkdownEditor
                            value={resume.summary}
                            onChange={setSummary}
                            placeholder="Write a brief summary about yourself and your career goals..."
                            rows={4}
                        />
                    </div>

                    {/* Experience */}
                    <div className="pt-6 border-t">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <Briefcase size={20} className="text-gray-600" />
                                Professional Experience
                            </h3>
                            <button
                                onClick={addExperience}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2"
                            >
                                <Plus size={18} />
                                Add Experience
                            </button>
                        </div>

                        <div className="space-y-6">
                            {resume.experience.map((exp, idx) => (
                                <div
                                    key={exp.id}
                                    className="p-4 border border-gray-200 rounded-lg"
                                >
                                    <div className="flex justify-between items-start mb-4">
                    <span className="text-sm font-medium text-gray-600">
                      Experience #{idx + 1}
                    </span>
                                        <button
                                            onClick={() => removeExperience(exp.id)}
                                            className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1"
                                        >
                                            <Trash2 size={16} />
                                            Remove
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Role
                                                </label>
                                                <input
                                                    type="text"
                                                    value={exp.role}
                                                    onChange={(e) =>
                                                        updateExperience(exp.id, { role: e.target.value })
                                                    }
                                                    placeholder="Software Engineer"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Company
                                                </label>
                                                <input
                                                    type="text"
                                                    value={exp.company}
                                                    onChange={(e) =>
                                                        updateExperience(exp.id, { company: e.target.value })
                                                    }
                                                    placeholder="Tech Corp"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Period
                                            </label>
                                            <input
                                                type="text"
                                                value={exp.period}
                                                onChange={(e) =>
                                                    updateExperience(exp.id, { period: e.target.value })
                                                }
                                                placeholder="Jan 2020 - Present"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>

                                        <MarkdownEditor
                                            value={exp.description}
                                            onChange={(value) =>
                                                updateExperience(exp.id, { description: value })
                                            }
                                            label="Description"
                                            placeholder="- Led development of key features&#10;- Improved performance by 40%&#10;- Mentored junior developers"
                                            rows={4}
                                        />
                                    </div>
                                </div>
                            ))}

                            {resume.experience.length === 0 && (
                                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                                    <Briefcase className="mx-auto mb-3 text-gray-400" size={40} />
                                    <p className="text-gray-500">
                                        No experience added yet. Click "Add Experience" to get started.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Education */}
                    <div className="pt-6 border-t">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <BookOpen size={20} className="text-gray-600" />
                                Education
                            </h3>
                            <button
                                onClick={addEducation}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2"
                            >
                                <Plus size={18} />
                                Add Education
                            </button>
                        </div>

                        <div className="space-y-6">
                            {resume.education.map((edu, idx) => (
                                <div
                                    key={edu.id}
                                    className="p-4 border border-gray-200 rounded-lg"
                                >
                                    <div className="flex justify-between items-start mb-4">
                    <span className="text-sm font-medium text-gray-600">
                      Education #{idx + 1}
                    </span>
                                        <button
                                            onClick={() => removeEducation(edu.id)}
                                            className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1"
                                        >
                                            <Trash2 size={16} />
                                            Remove
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Degree
                                                </label>
                                                <input
                                                    type="text"
                                                    value={edu.degree}
                                                    onChange={(e) =>
                                                        updateEducation(edu.id, { degree: e.target.value })
                                                    }
                                                    placeholder="Bachelor of Science in Computer Science"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Institution
                                                </label>
                                                <input
                                                    type="text"
                                                    value={edu.institution}
                                                    onChange={(e) =>
                                                        updateEducation(edu.id, {
                                                            institution: e.target.value,
                                                        })
                                                    }
                                                    placeholder="University Name"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Period
                                            </label>
                                            <input
                                                type="text"
                                                value={edu.period}
                                                onChange={(e) =>
                                                    updateEducation(edu.id, { period: e.target.value })
                                                }
                                                placeholder="2016 - 2020"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>

                                        <MarkdownEditor
                                            value={edu.description}
                                            onChange={(value) =>
                                                updateEducation(edu.id, { description: value })
                                            }
                                            label="Description (optional)"
                                            placeholder="- GPA: 3.8/4.0&#10;- Dean's List all semesters&#10;- Relevant coursework: ..."
                                            rows={3}
                                        />
                                    </div>
                                </div>
                            ))}

                            {resume.education.length === 0 && (
                                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                                    <BookOpen className="mx-auto mb-3 text-gray-400" size={40} />
                                    <p className="text-gray-500">
                                        No education added yet. Click "Add Education" to get started.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}