// File: components/simulations/PendulumSimulation.tsx
"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";

interface PendulumState {
    angle: number;
    angularVelocity: number;
    length: number;
    gravity: number;
    damping: number;
}

export default function PendulumSimulation() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>();
    const lastTimeRef = useRef<number>(0);

    const [isRunning, setIsRunning] = useState(true);
    const [pendulum, setPendulum] = useState<PendulumState>({
        angle: Math.PI / 4,
        angularVelocity: 0,
        length: 150,
        gravity: 9.81,
        damping: 0.995,
    });

    const stateRef = useRef(pendulum);
    stateRef.current = pendulum;

    const updatePhysics = useCallback((deltaTime: number) => {
        const state = stateRef.current;
        const dt = Math.min(deltaTime, 0.05);

        const angularAcceleration = -(state.gravity / state.length) * Math.sin(state.angle);

        const newAngularVelocity = (state.angularVelocity + angularAcceleration * dt) * state.damping;
        const newAngle = state.angle + newAngularVelocity * dt;

        setPendulum((prev) => ({
            ...prev,
            angle: newAngle,
            angularVelocity: newAngularVelocity,
        }));
    }, []);

    const draw = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
        const state = stateRef.current;

        ctx.fillStyle = "#1a1a2e";
        ctx.fillRect(0, 0, width, height);

        const pivotX = width / 2;
        const pivotY = 80;

        const bobX = pivotX + state.length * Math.sin(state.angle);
        const bobY = pivotY + state.length * Math.cos(state.angle);

        ctx.beginPath();
        ctx.arc(pivotX, pivotY, 8, 0, Math.PI * 2);
        ctx.fillStyle = "#4a4e69";
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(pivotX, pivotY);
        ctx.lineTo(bobX, bobY);
        ctx.strokeStyle = "#9a8c98";
        ctx.lineWidth = 2;
        ctx.stroke();

        const trailAngle = state.angle - state.angularVelocity * 0.1;
        const trailX = pivotX + state.length * Math.sin(trailAngle);
        const trailY = pivotY + state.length * Math.cos(trailAngle);

        ctx.beginPath();
        ctx.arc(trailX, trailY, 20, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(244, 114, 182, 0.2)";
        ctx.fill();

        const gradient = ctx.createRadialGradient(bobX - 5, bobY - 5, 0, bobX, bobY, 25);
        gradient.addColorStop(0, "#f472b6");
        gradient.addColorStop(1, "#be185d");

        ctx.beginPath();
        ctx.arc(bobX, bobY, 25, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        const kineticEnergy = 0.5 * state.angularVelocity * state.angularVelocity * state.length * state.length;
        const potentialEnergy = state.gravity * state.length * (1 - Math.cos(state.angle));
        const totalEnergy = kineticEnergy + potentialEnergy;

        ctx.fillStyle = "#e2e8f0";
        ctx.font = "14px system-ui";
        ctx.fillText(`Angle: ${(state.angle * 180 / Math.PI).toFixed(1)}°`, 20, 30);
        ctx.fillText(`Angular Velocity: ${state.angularVelocity.toFixed(3)} rad/s`, 20, 50);
        ctx.fillText(`Total Energy: ${totalEnergy.toFixed(2)} J`, 20, 70);
    }, []);

    const animate = useCallback((timestamp: number) => {
        if (!lastTimeRef.current) lastTimeRef.current = timestamp;
        const deltaTime = (timestamp - lastTimeRef.current) / 1000;
        lastTimeRef.current = timestamp;

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");

        if (canvas && ctx) {
            if (isRunning) {
                updatePhysics(deltaTime);
            }
            draw(ctx, canvas.width, canvas.height);
        }

        animationRef.current = requestAnimationFrame(animate);
    }, [isRunning, updatePhysics, draw]);

    useEffect(() => {
        animationRef.current = requestAnimationFrame(animate);
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [animate]);

    const handleReset = () => {
        setPendulum({
            angle: Math.PI / 4,
            angularVelocity: 0,
            length: 150,
            gravity: 9.81,
            damping: 0.995,
        });
    };

    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const pivotX = canvas.width / 2;
        const pivotY = 80;

        const newAngle = Math.atan2(x - pivotX, y - pivotY);

        setPendulum((prev) => ({
            ...prev,
            angle: newAngle,
            angularVelocity: 0,
        }));
    };

    return (
        <div className="space-y-4">
            <canvas
                ref={canvasRef}
                width={600}
                height={400}
                onClick={handleCanvasClick}
                className="w-full h-auto cursor-pointer rounded-lg"
                style={{ maxWidth: "600px" }}
            />

            <div className="flex flex-wrap gap-2">
                <Button onClick={() => setIsRunning(!isRunning)}>
                    {isRunning ? "Pause" : "Play"}
                </Button>
                <Button variant="outline" onClick={handleReset}>
                    Reset
                </Button>
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium">
                    Length: {pendulum.length}px
                </label>
                <input
                    type="range"
                    min="50"
                    max="250"
                    value={pendulum.length}
                    onChange={(e) =>
                        setPendulum((prev) => ({ ...prev, length: Number(e.target.value) }))
                    }
                    className="w-full"
                />

                <label className="block text-sm font-medium">
                    Damping: {pendulum.damping.toFixed(3)}
                </label>
                <input
                    type="range"
                    min="0.9"
                    max="1"
                    step="0.001"
                    value={pendulum.damping}
                    onChange={(e) =>
                        setPendulum((prev) => ({ ...prev, damping: Number(e.target.value) }))
                    }
                    className="w-full"
                />
            </div>

            <p className="text-sm text-muted-foreground">
                Click anywhere on the canvas to set a new starting position for the pendulum.
            </p>
        </div>
    );
}