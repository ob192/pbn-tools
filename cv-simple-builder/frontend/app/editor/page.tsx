'use client';

import {useState} from 'react';
import Link from 'next/link';
import {ArrowLeft} from 'lucide-react';

import {WizardShell} from '@/editor/components/WizardShell';
import {ImageStep} from '@/editor/steps/ImageStep';
import {WhoContactsStep} from '@/editor/steps/WhoContactsStep';
import {StylingStep} from '@/editor/steps/StylingStep';
import {MainContentStep} from '@/editor/steps/MainContentStep';
import {useResumeStore} from '@/store/useResumeStore';
import {COMMON_CONTACT_TYPES} from '@/core/resume/defaults';

export default function EditorPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const {resume, addContact} = useResumeStore();

    const totalSteps = 4;

    const isStepValid = (step: number): boolean => {
        switch (step) {
            case 1:
                return true;
            case 2:
                return !!(resume.who.fullName && resume.who.title);
            case 3:
                return true;
            case 4:
                return true;
            default:
                return false;
        }
    };

    const handleNext = () => {
        if (currentStep < totalSteps && isStepValid(currentStep)) {
            setCurrentStep((s) => s + 1);
        }
    };

    const handlePrev = () => {
        if (currentStep > 1) {
            setCurrentStep((s) => s - 1);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <ImageStep/>;
            case 2:
                return <WhoContactsStep/>;
            case 3:
                return <StylingStep/>;
            case 4:
                return <MainContentStep/>;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen">
            {/* Back to home */}
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-100">
                <div className="px-4 py-3 max-w-5xl mx-auto flex items-center">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-lg px-3 py-2
                 text-sm font-medium text-gray-600
                 hover:text-gray-900 hover:bg-gray-100
                 active:scale-[0.98] transition"
                    >
                        <ArrowLeft size={18}/>
                        Home
                    </Link>

                    <span className="ml-auto text-xs text-gray-400">
      Editor
    </span>
                </div>
            </div>

            <WizardShell
                currentStep={currentStep}
                totalSteps={totalSteps}
                onNext={currentStep < totalSteps ? handleNext : undefined}
                onPrev={currentStep > 1 ? handlePrev : undefined}
                nextDisabled={!isStepValid(currentStep)}
                onStepChange={(step) => setCurrentStep(step)}
                footerSlot={
                    currentStep === 2 && (
                        <div className="pb-2">
                            <p className="text-xs text-gray-500 mb-2">
                                Add contact method
                            </p>

                            <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2">
                                {COMMON_CONTACT_TYPES.map((type) => (
                                    <button
                                        key={type.label}
                                        onClick={() =>
                                            addContact({
                                                label: type.label,
                                                icon: type.icon,
                                            })
                                        }
                                        className="snap-start flex-shrink-0 px-5 py-3 bg-blue-100 text-blue-700
                      rounded-xl font-medium whitespace-nowrap
                      active:scale-95 transition"
                                    >
                                        + {type.label}
                                    </button>
                                ))}
                            </div>

                            <div className="h-3"/>
                        </div>
                    )
                }
            >
                {renderStep()}
            </WizardShell>
        </div>
    );
}
