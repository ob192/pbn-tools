'use client';

import { ReactNode } from 'react';
import Link from 'next/link';

interface WizardShellProps {
    currentStep: number;
    totalSteps: number;
    onNext?: () => void;
    onPrev?: () => void;
    onStepChange?: (step: number) => void;
    nextLabel?: string;
    prevLabel?: string;
    nextDisabled?: boolean;
    footerSlot?: ReactNode;
    children: ReactNode;
}

export function WizardShell({
                                currentStep,
                                totalSteps,
                                onNext,
                                onPrev,
                                onStepChange,
                                nextLabel = 'Next',
                                prevLabel = 'Previous',
                                nextDisabled = false,
                                footerSlot,
                                children,
                            }: WizardShellProps) {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Content */}
            <div className="max-w-3xl mx-auto px-4 pt-6 pb-32 sm:pb-8">
                {/* Progress */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep} of {totalSteps}
            </span>
                        <Link
                            href="/preview"
                            className="text-sm text-blue-600 hover:text-blue-700"
                        >
                            Preview
                        </Link>
                    </div>

                    {/* Clickable progress bar */}
                    <div className="flex gap-2">
                        {Array.from({ length: totalSteps }).map((_, index) => {
                            const step = index + 1;
                            const isCompleted = step <= currentStep;

                            return (
                                <button
                                    key={step}
                                    type="button"
                                    onClick={() => {
                                        if (step < currentStep) {
                                            onStepChange?.(step);
                                        }
                                    }}
                                    disabled={step > currentStep}
                                    aria-label={`Go to step ${step}`}
                                    className={`flex-1 h-2 rounded-full transition-all ${
                                        isCompleted
                                            ? 'bg-blue-600 cursor-pointer'
                                            : 'bg-gray-200 cursor-not-allowed'
                                    }`}
                                />
                            );
                        })}
                    </div>
                </div>

                {/* Step content */}
                <div className="bg-white rounded-xl shadow-sm p-5 sm:p-8">
                    {children}
                </div>
            </div>

            {/* Bottom bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t sm:static sm:border-0">
                <div className="max-w-3xl mx-auto px-4 py-4 space-y-3">
                    {footerSlot && <div className="flex gap-2 overflow-x-auto">{footerSlot}</div>}

                    <div className="flex gap-3">
                        <button
                            onClick={onPrev}
                            disabled={!onPrev}
                            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium
              hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {prevLabel}
                        </button>

                        {onNext ? (
                            <button
                                onClick={onNext}
                                disabled={nextDisabled}
                                className="flex-1 px-4 py-3 rounded-xl bg-blue-600 text-white font-medium
                hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {nextLabel}
                            </button>
                        ) : (
                            <Link
                                href="/preview"
                                className="flex-1 px-4 py-3 rounded-xl bg-green-600 text-white font-medium
                hover:bg-green-700 text-center"
                            >
                                Finish
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
