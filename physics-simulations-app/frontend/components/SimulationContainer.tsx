// File: components/SimulationContainer.tsx
"use client";

import React, { Suspense, lazy, ComponentType } from "react";

interface SimulationContainerProps {
    category: string;
    slug: string;
}

// Dynamic simulation loader
const simulationComponents: Record<string, ComponentType> = {};

function getSimulationComponent(category: string, slug: string): ComponentType | null {
    const key = `${category}/${slug}`;

    if (!simulationComponents[key]) {
        // Dynamically import based on slug
        const componentMap: Record<string, () => Promise<{ default: ComponentType }>> = {
            "mechanics/pendulum": () => import("@/components/simulations/PendulumSimulation"),
            "mechanics/projectile-motion": () => import("@/components/simulations/ProjectileMotionSimulation"),
            "waves/interference": () => import("@/components/simulations/InterferenceSimulation"),
        };

        const loader = componentMap[key];
        if (loader) {
            simulationComponents[key] = lazy(loader);
        }
    }

    return simulationComponents[key] || null;
}

function SimulationFallback() {
    return (
        <div className="w-full h-[400px] bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading simulation...</p>
            </div>
        </div>
    );
}

function SimulationNotFound() {
    return (
        <div className="w-full h-[400px] bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
                <p className="text-2xl mb-2">🔧</p>
                <p className="text-muted-foreground">Simulation coming soon!</p>
            </div>
        </div>
    );
}

export default function SimulationContainer({ category, slug }: SimulationContainerProps) {
    const SimulationComponent = getSimulationComponent(category, slug);

    return (
        <div className="w-full mb-8">
            <div className="bg-card border rounded-lg overflow-hidden">
                <div className="p-4 border-b bg-muted/50">
                    <h2 className="font-semibold">Interactive Simulation</h2>
                    <p className="text-sm text-muted-foreground">
                        Click and drag to interact with the simulation
                    </p>
                </div>

                <div className="p-4">
                    {SimulationComponent ? (
                        <Suspense fallback={<SimulationFallback />}>
                            <SimulationComponent />
                        </Suspense>
                    ) : (
                        <SimulationNotFound />
                    )}
                </div>
            </div>
        </div>
    );
}