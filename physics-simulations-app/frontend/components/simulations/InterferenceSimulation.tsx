// File: components/simulations/InterferenceSimulation.tsx
"use client";

import React, {
    useRef,
    useEffect,
    useState,
} from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const SIM_WIDTH = 200;
const SIM_HEIGHT = 140;
const MAX_SOURCES = 16;
const DRAW_SPACING = 6; // minimum distance (in sim pixels) between drawn sources

type ColorMode = "grayscale" | "rainbow";

type WavePresetId =
    | "double-slit"
    | "single"
    | "dipole-vertical"
    | "phased-array"
    | "lateral-line"
    | "doppler-like";

interface Source {
    x: number;
    y: number;
    amplitude: number;
    phase: number; // radians
    frequencyOffset: number; // relative, e.g. 0.2 = +20%
    color: string; // hex color, e.g. "#ef4444"
}

interface WavePreset {
    id: WavePresetId;
    label: string;
    description: string;
    baseWavelength: number;
    baseFrequency: number;
    createSources: (width: number, height: number) => Source[];
}

interface InterferenceSimulationProps {
    /**
     * "full"    – canvas + controls + explanation
     * "preview" – canvas only (for small cards / hero previews)
     */
    variant?: "full" | "preview";
    /** Where to navigate when preview is clicked (only used in preview mode) */
    linkTo?: string;
}

const SOURCE_COLOR_PALETTE = [
    "#ef4444", // red
    "#22c55e", // green
    "#3b82f6", // blue
    "#eab308", // yellow
    "#a855f7", // purple
    "#f97316", // orange
    "#06b6d4", // cyan
    "#facc15", // amber
];

function getDefaultColor(index: number): string {
    return SOURCE_COLOR_PALETTE[index % SOURCE_COLOR_PALETTE.length];
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
    let clean = hex.trim().toLowerCase();
    if (clean.startsWith("#")) clean = clean.slice(1);

    if (clean.length === 3) {
        const r = clean[0];
        const g = clean[1];
        const b = clean[2];
        clean = r + r + g + g + b + b;
    }

    if (clean.length !== 6) {
        return { r: 255, g: 255, b: 255 };
    }

    const num = parseInt(clean, 16);
    return {
        r: (num >> 16) & 255,
        g: (num >> 8) & 255,
        b: num & 255,
    };
}

const WAVE_PRESETS: WavePreset[] = [
    {
        id: "double-slit",
        label: "Two sources (classic)",
        description: "Two coherent point sources – classic double-source interference.",
        baseWavelength: 25,
        baseFrequency: 1.5,
        createSources: (w, h) => {
            const x = 18;
            const midY = h / 2;
            const sep = 40;
            return [
                {
                    x,
                    y: midY - sep / 2,
                    amplitude: 1,
                    phase: 0,
                    frequencyOffset: 0,
                    color: getDefaultColor(0),
                },
                {
                    x,
                    y: midY + sep / 2,
                    amplitude: 1,
                    phase: 0,
                    frequencyOffset: 0,
                    color: getDefaultColor(1),
                },
            ];
        },
    },
    {
        id: "single",
        label: "Single source",
        description: "One isotropic source radiating waves.",
        baseWavelength: 25,
        baseFrequency: 1.2,
        createSources: (_w, h) => [
            {
                x: 18,
                y: h / 2,
                amplitude: 1,
                phase: 0,
                frequencyOffset: 0,
                color: getDefaultColor(0),
            },
        ],
    },
    {
        id: "dipole-vertical",
        label: "Dipole (vertical)",
        description:
            "Two nearby sources with opposite phase – dipole-like angular pattern.",
        baseWavelength: 22,
        baseFrequency: 1.3,
        createSources: (w, h) => {
            const x = 25;
            const midY = h / 2;
            const sep = 16;
            return [
                {
                    x,
                    y: midY - sep / 2,
                    amplitude: 1,
                    phase: 0,
                    frequencyOffset: 0,
                    color: getDefaultColor(0),
                },
                {
                    x,
                    y: midY + sep / 2,
                    amplitude: 1,
                    phase: Math.PI,
                    frequencyOffset: 0,
                    color: getDefaultColor(1),
                },
            ];
        },
    },
    {
        id: "phased-array",
        label: "Phased array",
        description:
            "Five sources in a vertical line with progressive phase shift – steered interference pattern.",
        baseWavelength: 18,
        baseFrequency: 1.8,
        createSources: (_w, h) => {
            const x = 20;
            const count = 5;
            const span = 80;
            const startY = h / 2 - span / 2;
            const phaseStep = (Math.PI / 2) / count;
            const sources: Source[] = [];
            for (let i = 0; i < count; i++) {
                sources.push({
                    x,
                    y: startY + (i * span) / (count - 1),
                    amplitude: 1,
                    phase: phaseStep * i,
                    frequencyOffset: 0,
                    color: getDefaultColor(i),
                });
            }
            return sources;
        },
    },
    {
        id: "lateral-line",
        label: "Lateral / line source",
        description:
            "Several in-phase sources forming an approximate vertical line – lateral / plane-like wave.",
        baseWavelength: 20,
        baseFrequency: 1.6,
        createSources: (_w, h) => {
            const x = 15;
            const count = 7;
            const span = 90;
            const startY = h / 2 - span / 2;
            const sources: Source[] = [];
            for (let i = 0; i < count; i++) {
                sources.push({
                    x,
                    y: startY + (i * span) / (count - 1),
                    amplitude: 1,
                    phase: 0,
                    frequencyOffset: 0,
                    color: getDefaultColor(i),
                });
            }
            return sources;
        },
    },
    {
        id: "doppler-like",
        label: "“Doppler-like”",
        description:
            "Two sources with slightly different frequency – moving interference fringes (qualitative Doppler feel).",
        baseWavelength: 24,
        baseFrequency: 1.5,
        createSources: (_w, h) => {
            const x = 18;
            const midY = h / 2;
            const sep = 28;
            return [
                {
                    x,
                    y: midY - sep / 2,
                    amplitude: 1,
                    phase: 0,
                    frequencyOffset: 0,
                    color: getDefaultColor(0),
                },
                {
                    x,
                    y: midY + sep / 2,
                    amplitude: 1,
                    phase: 0,
                    frequencyOffset: 0.12, // ~12% higher frequency
                    color: getDefaultColor(1),
                },
            ];
        },
    },
];

export default function InterferenceSimulation({
                                                   variant = "full",
                                                   linkTo,
                                               }: InterferenceSimulationProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const animationRef = useRef<number | null>(null);
    const timeRef = useRef(0);

    // Distances from each pixel to each source: distanceBuffers[sourceIndex][pixelIndex]
    const distanceRef = useRef<Float32Array[] | null>(null);
    const sourceColorsRef = useRef<{ r: number; g: number; b: number }[] | null>(
        null
    );

    const [colorMode, setColorMode] = useState<ColorMode>("rainbow");
    const [isRunning, setIsRunning] = useState(true);
    const [simulationSpeed, setSimulationSpeed] = useState(1); // time multiplier
    const [wavelength, setWavelength] = useState(25);
    const [frequency, setFrequency] = useState(1.5);
    const [damping, setDamping] = useState(0); // 0 – no damping, up to ~0.05

    const [presetId, setPresetId] = useState<WavePresetId>("double-slit");
    const [sources, setSources] = useState<Source[]>(() =>
        WAVE_PRESETS.find((p) => p.id === "double-slit")!.createSources(
            SIM_WIDTH,
            SIM_HEIGHT
        )
    );

    // Drawing with mouse / finger
    const [isDrawing, setIsDrawing] = useState(false);
    const lastDrawPointRef = useRef<{ x: number; y: number } | null>(null);

    const currentPreset = WAVE_PRESETS.find((p) => p.id === presetId) ?? null;

    // Recompute distances whenever sources change
    const recomputeDistances = (currentSources: Source[]) => {
        if (currentSources.length === 0) {
            distanceRef.current = null;
            return;
        }

        const buffers: Float32Array[] = [];
        const pixelCount = SIM_WIDTH * SIM_HEIGHT;

        for (const s of currentSources) {
            const dist = new Float32Array(pixelCount);

            for (let y = 0; y < SIM_HEIGHT; y++) {
                for (let x = 0; x < SIM_WIDTH; x++) {
                    const idx = y * SIM_WIDTH + x;
                    const dx = x - s.x;
                    const dy = y - s.y;
                    dist[idx] = Math.sqrt(dx * dx + dy * dy);
                }
            }

            buffers.push(dist);
        }

        distanceRef.current = buffers;
    };

    useEffect(() => {
        recomputeDistances(sources);
        if (sources.length === 0) {
            sourceColorsRef.current = null;
        } else {
            sourceColorsRef.current = sources.map((s) =>
                hexToRgb(s.color || "#ffffff")
            );
        }
    }, [sources]);

    // Main render loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const imageData = ctx.createImageData(SIM_WIDTH, SIM_HEIGHT);
        const data = imageData.data;
        let lastTime = performance.now();

        const render = (now: number) => {
            animationRef.current = requestAnimationFrame(render);

            const distBuffers = distanceRef.current;
            const srcColors = sourceColorsRef.current;
            if (!distBuffers || distBuffers.length === 0) {
                ctx.fillStyle = "black";
                ctx.fillRect(0, 0, SIM_WIDTH, SIM_HEIGHT);
                return;
            }

            const dt = (now - lastTime) / 1000;
            lastTime = now;

            if (isRunning) {
                timeRef.current += dt * simulationSpeed;
            }

            const t = timeRef.current;
            const k = (2 * Math.PI) / wavelength;
            const baseOmega = 2 * Math.PI * frequency;
            const numSources = sources.length || 1;
            const len = SIM_WIDTH * SIM_HEIGHT;

            for (let i = 0; i < len; i++) {
                let real = 0;
                let imag = 0;

                let totalSourceIntensity = 0;
                let accumR = 0;
                let accumG = 0;
                let accumB = 0;

                for (let sIdx = 0; sIdx < distBuffers.length; sIdx++) {
                    const source = sources[sIdx];
                    const d = distBuffers[sIdx][i];

                    const omega = baseOmega * (1 + (source.frequencyOffset ?? 0));
                    const phaseArg = k * d - omega * t + (source.phase || 0);

                    const baseFalloff = 1 / (1 + 0.02 * d); // mild 1/r-like falloff
                    const dampingFactor = damping > 0 ? Math.exp(-d * damping) : 1;
                    const amp = (source.amplitude ?? 1) * baseFalloff * dampingFactor;

                    const srcReal = amp * Math.cos(phaseArg);
                    const srcImag = amp * Math.sin(phaseArg);

                    real += srcReal;
                    imag += srcImag;

                    const sourceIntensity = srcReal * srcReal + srcImag * srcImag;
                    totalSourceIntensity += sourceIntensity;

                    if (srcColors && srcColors[sIdx]) {
                        const c = srcColors[sIdx];
                        accumR += sourceIntensity * c.r;
                        accumG += sourceIntensity * c.g;
                        accumB += sourceIntensity * c.b;
                    }
                }

                // Use instantaneous field amplitude so pattern moves in time
                const field = real; // instantaneous real part of the field
                // Map field (roughly unbounded) to [0, 1] with a smooth squash
                const fieldNorm = 0.5 + 0.5 * Math.tanh(field * 1.5);
                const normIntensity = Math.max(0, Math.min(1, fieldNorm));

                const idx = i * 4;
                let r = 0;
                let g = 0;
                let b = 0;

                if (colorMode === "grayscale") {
                    const v = Math.max(0, Math.min(255, normIntensity * 255));
                    r = g = b = v;
                } else {
                    // "rainbow" mode uses per-source colors
                    if (totalSourceIntensity > 1e-6 && srcColors) {
                        const baseR = accumR / totalSourceIntensity; // 0..255
                        const baseG = accumG / totalSourceIntensity;
                        const baseB = accumB / totalSourceIntensity;
                        const brightnessFactor = Math.min(1, normIntensity * 1.2);

                        r = Math.max(0, Math.min(255, baseR * brightnessFactor));
                        g = Math.max(0, Math.min(255, baseG * brightnessFactor));
                        b = Math.max(0, Math.min(255, baseB * brightnessFactor));
                    } else {
                        const v = Math.max(0, Math.min(255, normIntensity * 255));
                        r = g = b = v;
                    }
                }

                data[idx] = r;
                data[idx + 1] = g;
                data[idx + 2] = b;
                data[idx + 3] = 255;
            }

            ctx.putImageData(imageData, 0, 0);

            // Draw sources on top
            ctx.save();
            ctx.lineWidth = 1;
            ctx.font = "8px system-ui";

            sources.forEach((s, index) => {
                ctx.beginPath();
                ctx.fillStyle = s.color || "#ef4444";
                ctx.strokeStyle = "#ffffff";
                ctx.arc(s.x, s.y, 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = "#ffffff";
                ctx.fillText(`S${index + 1}`, s.x + 5, s.y + 3);
            });

            ctx.restore();
        };

        animationRef.current = requestAnimationFrame(render);

        return () => {
            if (animationRef.current !== null) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [
        wavelength,
        frequency,
        isRunning,
        simulationSpeed,
        colorMode,
        damping,
        sources,
    ]);

    const handleApplyPreset = (preset: WavePreset) => {
        setPresetId(preset.id);
        setWavelength(preset.baseWavelength);
        setFrequency(preset.baseFrequency);
        const newSources = preset.createSources(SIM_WIDTH, SIM_HEIGHT);
        setSources(newSources);
        timeRef.current = 0;
    };

    const handleClearSources = () => {
        setSources([]);
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (variant !== "full") return;

        const canvas = e.currentTarget;
        const rect = canvas.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * SIM_WIDTH;
        const y = ((e.clientY - rect.top) / rect.height) * SIM_HEIGHT;
        const clampedX = Math.max(0, Math.min(SIM_WIDTH - 1, x));
        const clampedY = Math.max(0, Math.min(SIM_HEIGHT - 1, y));

        setSources((prev) => {
            if (prev.length >= MAX_SOURCES) return prev;
            return [
                ...prev,
                {
                    x: clampedX,
                    y: clampedY,
                    amplitude: 1,
                    phase: 0,
                    frequencyOffset: 0,
                    color: getDefaultColor(prev.length),
                },
            ];
        });

        lastDrawPointRef.current = { x: clampedX, y: clampedY };
        setIsDrawing(true);
        try {
            canvas.setPointerCapture(e.pointerId);
        } catch {
            // ignore if not supported
        }
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (!isDrawing || variant !== "full") return;
        const canvas = e.currentTarget;
        const rect = canvas.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * SIM_WIDTH;
        const y = ((e.clientY - rect.top) / rect.height) * SIM_HEIGHT;
        const clampedX = Math.max(0, Math.min(SIM_WIDTH - 1, x));
        const clampedY = Math.max(0, Math.min(SIM_HEIGHT - 1, y));

        const last = lastDrawPointRef.current;
        if (!last) {
            lastDrawPointRef.current = { x: clampedX, y: clampedY };
            return;
        }

        const dx = clampedX - last.x;
        const dy = clampedY - last.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < DRAW_SPACING) return;

        setSources((prev) => {
            if (prev.length >= MAX_SOURCES) return prev;
            return [
                ...prev,
                {
                    x: clampedX,
                    y: clampedY,
                    amplitude: 1,
                    phase: 0,
                    frequencyOffset: 0,
                    color: getDefaultColor(prev.length),
                },
            ];
        });

        lastDrawPointRef.current = { x: clampedX, y: clampedY };
    };

    const endDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
        setIsDrawing(false);
        lastDrawPointRef.current = null;
        try {
            e.currentTarget.releasePointerCapture(e.pointerId);
        } catch {
            // ignore
        }
    };

    const updateSource = (index: number, partial: Partial<Source>) => {
        setSources((prev) =>
            prev.map((s, i) => (i === index ? { ...s, ...partial } : s))
        );
    };

    const removeSource = (index: number) => {
        setSources((prev) => prev.filter((_s, i) => i !== index));
    };

    // Canvas element (used in both preview + full modes)
    const canvasNode = (
        <canvas
            ref={canvasRef}
            width={SIM_WIDTH}
            height={SIM_HEIGHT}
            className="h-auto w-full max-w-xl rounded-lg border bg-black"
            style={{
                imageRendering: "pixelated",
                touchAction: "none",
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endDrawing}
            onPointerLeave={endDrawing}
        />
    );

    return (
        <div className={variant === "full" ? "space-y-3 sm:space-y-4" : ""}>
            {/* Canvas – optionally wrapped in a clickable link in preview mode */}
            <div className="flex w-full justify-center">
                {variant === "preview" && linkTo ? (
                    <Link
                        href={linkTo}
                        className="group relative block w-full max-w-xl"
                        aria-label="Open full interactive interference simulation"
                    >
                        {canvasNode}

                        {/* subtle overlay on hover / focus */}
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/10 group-hover:opacity-100 group-focus-visible:bg-black/10 group-focus-visible:opacity-100">
              <span className="rounded-full bg-background/90 px-3 py-1 text-xs font-medium shadow-sm">
                Tap to open interactive simulation →
              </span>
                        </div>
                    </Link>
                ) : (
                    canvasNode
                )}
            </div>

            {/* Full UI only in full mode */}
            {variant === "full" && (
                <>
                    {/* Playback + color + static expert badge */}
                    <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs">
                        <Button
                            size="sm"
                            onClick={() => setIsRunning((prev) => !prev)}
                        >
                            {isRunning ? "Pause" : "Play"}
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                                timeRef.current = 0;
                            }}
                        >
                            Reset Time
                        </Button>

                        <div className="mx-2 hidden h-6 w-px bg-border sm:block" />

                        <div className="flex items-center gap-1">
                            <span className="font-medium">Color:</span>
                            <Button
                                size="sm"
                                variant={colorMode === "rainbow" ? "default" : "outline"}
                                onClick={() => setColorMode("rainbow")}
                            >
                                Per-source colors
                            </Button>
                            <Button
                                size="sm"
                                variant={colorMode === "grayscale" ? "default" : "outline"}
                                onClick={() => setColorMode("grayscale")}
                            >
                                B&amp;W
                            </Button>
                        </div>

                        <div className="mx-2 hidden h-6 w-px bg-border sm:block" />

                        <div className="flex items-center gap-1">
              <span className="rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                Expert mode
              </span>
                        </div>
                    </div>

                    {/* Core sliders + presets */}
                    <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                        <div className="space-y-3">
                            <div>
                                <div className="flex items-center justify-between text-[11px] sm:text-xs">
                                    <span className="font-medium">Wavelength</span>
                                    <span>{wavelength.toFixed(0)} px</span>
                                </div>
                                <input
                                    type="range"
                                    min={8}
                                    max={80}
                                    step={1}
                                    value={wavelength}
                                    onChange={(e) =>
                                        setWavelength(Number(e.target.value))
                                    }
                                    className="mt-1 w-full"
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between text-[11px] sm:text-xs">
                                    <span className="font-medium">Frequency</span>
                                    <span>{frequency.toFixed(2)} a.u.</span>
                                </div>
                                <input
                                    type="range"
                                    min={0.3}
                                    max={3}
                                    step={0.05}
                                    value={frequency}
                                    onChange={(e) =>
                                        setFrequency(Number(e.target.value))
                                    }
                                    className="mt-1 w-full"
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between text-[11px] sm:text-xs">
                                    <span className="font-medium">Simulation speed</span>
                                    <span>{simulationSpeed.toFixed(2)}×</span>
                                </div>
                                <input
                                    type="range"
                                    min={0.2}
                                    max={3}
                                    step={0.1}
                                    value={simulationSpeed}
                                    onChange={(e) =>
                                        setSimulationSpeed(Number(e.target.value))
                                    }
                                    className="mt-1 w-full"
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between text-[11px] sm:text-xs">
                                    <span className="font-medium">Damping</span>
                                    <span>{damping.toFixed(3)}</span>
                                </div>
                                <input
                                    type="range"
                                    min={0}
                                    max={0.05}
                                    step={0.001}
                                    value={damping}
                                    onChange={(e) =>
                                        setDamping(Number(e.target.value))
                                    }
                                    className="mt-1 w-full"
                                />
                                <p className="mt-1 text-[11px] text-muted-foreground">
                                    Higher damping makes distant fringes fade out faster.
                                </p>
                            </div>
                        </div>

                        {/* Presets + drawing info (mobile-optimized card) */}
                        <div className="space-y-3">
                            <div className="rounded-md border bg-background/40 p-3 space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <p className="text-xs font-semibold sm:text-sm">
                                            Wave presets
                                        </p>
                                        <p className="text-[11px] text-muted-foreground sm:text-xs">
                                            Quick starting setups for classic interference scenes.
                                        </p>
                                    </div>
                                    <Button
                                        size="xs"
                                        variant="outline"
                                        onClick={handleClearSources}
                                        className="shrink-0"
                                    >
                                        Clear
                                    </Button>
                                </div>

                                <div className="mt-1 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                                    {WAVE_PRESETS.map((preset) => (
                                        <Button
                                            key={preset.id}
                                            size="xs"
                                            variant={
                                                preset.id === presetId ? "default" : "outline"
                                            }
                                            onClick={() => handleApplyPreset(preset)}
                                            className="w-full justify-start text-[11px] sm:text-xs"
                                        >
                                            {preset.label}
                                        </Button>
                                    ))}
                                </div>

                                <p className="mt-2 text-[11px] text-muted-foreground sm:text-xs">
                                    On mobile, tap a preset, then tap or drag on the canvas
                                    to add more sources (max {MAX_SOURCES}).
                                </p>

                                <div className="mt-2 rounded bg-muted/60 px-2 py-1.5">
                                    <p className="text-[11px] font-medium sm:text-xs">
                                        {currentPreset?.label ?? "Preset info"}
                                    </p>
                                    <p className="text-[11px] text-muted-foreground sm:text-xs">
                                        {currentPreset?.description ??
                                            "Choose a preset above to see its description."}
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-md border p-2 text-[11px] leading-snug text-muted-foreground sm:text-xs">
                                <p className="mb-1 font-medium">What you&apos;re seeing</p>
                                <p>
                                    Brightness shows the instantaneous wave amplitude
                                    from all sources (an oscillating interference pattern).
                                    In color mode, each pixel is tinted by how much each
                                    source contributes there.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Expert per-source controls (always on) */}
                    <div className="space-y-2 rounded-md border p-3">
                        <p className="text-xs font-semibold sm:text-sm">
                            Per-source parameters
                        </p>
                        {sources.length === 0 ? (
                            <p className="text-[11px] text-muted-foreground sm:text-xs">
                                No sources yet – pick a preset or draw on the canvas.
                            </p>
                        ) : (
                            <div className="grid max-h-64 gap-2 overflow-y-auto sm:max-h-72 sm:grid-cols-2">
                                {sources.map((s, index) => {
                                    const phaseDeg =
                                        ((s.phase || 0) * 180) / Math.PI;
                                    return (
                                        <div
                                            key={index}
                                            className="space-y-1 rounded border bg-background/40 p-2"
                                        >
                                            <div className="flex items-center justify-between text-[11px] sm:text-xs">
                        <span className="font-medium">
                          Source S{index + 1}
                        </span>
                                                <Button
                                                    size="xs"
                                                    variant="ghost"
                                                    onClick={() => removeSource(index)}
                                                >
                                                    ✕
                                                </Button>
                                            </div>
                                            <div className="flex items-center justify-between text-[10px] text-muted-foreground sm:text-[11px]">
                        <span>
                          Pos: ({s.x.toFixed(0)}, {s.y.toFixed(0)})
                        </span>
                                                <label className="flex items-center gap-1">
                                                    <span>Color</span>
                                                    <input
                                                        type="color"
                                                        value={s.color}
                                                        onChange={(e) =>
                                                            updateSource(index, {
                                                                color: e.target.value,
                                                            })
                                                        }
                                                        className="h-4 w-8 cursor-pointer rounded border bg-transparent p-0"
                                                    />
                                                </label>
                                            </div>

                                            <div>
                                                <div className="flex items-center justify-between text-[10px] sm:text-[11px]">
                                                    <span>Amplitude</span>
                                                    <span>{s.amplitude.toFixed(2)}</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min={0.1}
                                                    max={1.8}
                                                    step={0.05}
                                                    value={s.amplitude}
                                                    onChange={(e) =>
                                                        updateSource(index, {
                                                            amplitude: Number(
                                                                e.target.value
                                                            ),
                                                        })
                                                    }
                                                    className="mt-0.5 w-full"
                                                />
                                            </div>

                                            <div>
                                                <div className="flex items-center justify-between text-[10px] sm:text-[11px]">
                                                    <span>Phase</span>
                                                    <span>{phaseDeg.toFixed(0)}°</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min={0}
                                                    max={360}
                                                    step={15}
                                                    value={phaseDeg}
                                                    onChange={(e) =>
                                                        updateSource(index, {
                                                            phase:
                                                                (Number(e.target.value) *
                                                                    Math.PI) /
                                                                180,
                                                        })
                                                    }
                                                    className="mt-0.5 w-full"
                                                />
                                            </div>

                                            <div>
                                                <div className="flex items-center justify-between text-[10px] sm:text-[11px]">
                                                    <span>Freq offset</span>
                                                    <span>
                            {(
                                (s.frequencyOffset || 0) * 100
                            ).toFixed(0)}
                                                        %
                          </span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min={-0.5}
                                                    max={0.5}
                                                    step={0.05}
                                                    value={s.frequencyOffset || 0}
                                                    onChange={(e) =>
                                                        updateSource(index, {
                                                            frequencyOffset: Number(
                                                                e.target.value
                                                            ),
                                                        })
                                                    }
                                                    className="mt-0.5 w-full"
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};
