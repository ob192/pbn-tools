import Link from "next/link";
import {FileText, Zap, Smartphone, ShieldCheck, ChevronDown} from "lucide-react";

export default function HomePage() {
    return (
        <div className="min-h-screen px-5">
            <main className="mx-auto max-w-2xl py-20">
                {/* HERO */}
                <header className="mb-24">
                    <h1 className="heading text-4xl sm:text-6xl font-semibold leading-tight mb-10">
                        Build your Markdown CV in under 1 minute
                        <br/>
                        <span className="text-emerald-600">from your phone</span>
                    </h1>

                    <p className="text-xl sm:text-2xl text-gray-700 mb-12 max-w-xl leading-relaxed">
                        Free to use. Built for mobile.
                        <span className="text-gray-900 font-medium">
      Designed to pass ATS screening.
    </span>
                    </p>

                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                        <Link
                            href="/editor"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-8 py-4 text-lg font-medium text-white hover:bg-gray-800 transition shadow-sm"
                        >
                            <FileText size={20}/>
                            Start in 1 minute
                        </Link>

                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Zap size={16} className="text-emerald-600"/>
                            No sign-up · Runs locally · Nothing uploaded
                        </div>
                    </div>
                </header>


                {/* VALUE HIGHLIGHTS */}
                <section className="mb-24 space-y-10">
                    <div className="flex gap-5">
                        <Smartphone className="text-emerald-600" size={26}/>
                        <p className="text-lg sm:text-xl text-gray-700">
                            Designed mobile-first. Write, preview, and export your CV directly
                            from your phone.
                        </p>
                    </div>

                    <div className="flex gap-5">
                        <Zap className="text-emerald-600" size={26}/>
                        <p className="text-lg sm:text-xl text-gray-700">
                            Instant preview and PDF export — no servers, no waiting.
                        </p>
                    </div>

                    <div className="flex gap-5">
                        <ShieldCheck className="text-emerald-600" size={26}/>
                        <p className="text-lg sm:text-xl text-gray-700">
                            Your CV never leaves your device. No uploads. No tracking.
                        </p>
                    </div>
                </section>

                {/* PROBLEM */}
                <section className="mb-24">
                    <h2 className="heading text-2xl sm:text-3xl font-semibold mb-8">
                        What problem does this solve?
                    </h2>

                    <div className="space-y-6 text-lg sm:text-xl text-gray-700">
                        <p>
                            Most resume builders focus on visual templates and formatting
                            controls.
                        </p>

                        <p className="font-medium text-gray-900">
                            Applicant Tracking Systems don’t understand those layouts.
                        </p>

                        <p>
                            The result is broken parsing, lost keywords, and silent rejection —
                            before a recruiter ever sees your CV.
                        </p>
                    </div>
                </section>

                {/* FAQ */}
                {/* FAQ */}
                <section className="border-t border-gray-200 pt-20">
                    <h2 className="heading text-2xl sm:text-3xl font-semibold mb-12">
                        Frequently asked questions
                    </h2>

                    <div className="space-y-10">
                        {[
                            {
                                q: "Is this Markdown CV builder really free?",
                                a: (
                                    <>
                                        Yes. This is a completely free Markdown resume builder.
                                        There are no accounts, subscriptions, watermarks, or export limits.
                                        You can create and download your CV as many times as you want.
                                    </>
                                ),
                            },
                            {
                                q: "How can I build a CV in under 1 minute?",
                                a: (
                                    <>
                                        The editor is designed for speed.
                                        You write your CV in simple Markdown, preview it instantly,
                                        and export a clean PDF directly from your browser.
                                        No templates to fight, no formatting tools to configure.
                                    </>
                                ),
                            },
                            {
                                q: "Is a Markdown CV ATS-friendly?",
                                a: (
                                    <>
                                        Yes. Markdown resumes produce clean, single-column layouts
                                        with predictable structure — exactly what Applicant Tracking
                                        Systems (ATS) are built to parse.
                                        No columns, no visual tricks, no broken text order.
                                    </>
                                ),
                            },
                            {
                                q: "Can I really create my CV from my phone?",
                                a: (
                                    <>
                                        Absolutely. The editor is mobile-first and works on modern
                                        smartphones and tablets.
                                        You can write, preview, and export your CV directly from your phone
                                        without installing anything.
                                    </>
                                ),
                            },
                            {
                                q: "Does my CV get uploaded or stored anywhere?",
                                a: (
                                    <>
                                        No. Everything runs locally in your browser.
                                        Your CV never leaves your device, and nothing is stored on a server.
                                        This tool does not track, save, or analyze your data.
                                    </>
                                ),
                            },
                            {
                                q: "Why not use a two-column or designed resume template?",
                                a: (
                                    <>
                                        Multi-column resumes often break when parsed by ATS software.
                                        Content can be read out of order or skipped entirely.
                                        A clean, single-column Markdown resume gives you the best chance
                                        of reaching a human reviewer.
                                    </>
                                ),
                            },
                        ].map(({ q, a }) => (
                            <details key={q} className="group">
                                <summary className="flex cursor-pointer items-center justify-between text-lg sm:text-xl font-medium">
                                    {q}
                                    <ChevronDown className="text-gray-400 transition group-open:rotate-180" />
                                </summary>

                                <div className="mt-5 text-base sm:text-lg text-gray-700 leading-relaxed max-w-2xl">
                                    {a}
                                </div>
                            </details>
                        ))}
                    </div>
                </section>


                {/* FOOTER CTA */}
                <footer className="mt-24 text-center">
                    <Link
                        href="/editor"
                        className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-gray-900 px-10 py-5 text-lg font-medium text-white hover:bg-gray-800 transition"
                    >
                        <FileText size={20}/>
                        Start writing
                    </Link>

                    <p className="mt-6 text-base text-gray-500">
                        Free · Instant · Mobile-first · No uploads
                    </p>
                </footer>
            </main>
        </div>
    );
}
