// File: components/simulations/ProjectileMotionSimulation.tsx
"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";

interface Projectile {
    x: number;
    y: number;
    vx: number;
    vy: number;
    trail: { x: number; y: number }[];
}

export default function ProjectileMotionSimulation() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>();
    const lastTimeRef = useRef<number>(0);

    const [isRunning, setIsRunning] = useState(false);
    const [angle, setAngle] = useState(45);
    const [velocity, setVelocity] = useState(50);
    const [projectile, setProjectile] = useState<Projectile | null>(null);

    const gravity = 9.81;
    const scale = 3;

    const launch = useCallback(() => {
        const angleRad = (angle * Math.PI) / 180;
        setProjectile({
            x: 50,
            y: 350,
            vx: velocity * Math.cos(angleRad),
            vy: -velocity * Math.sin(angleRad),
            trail: [],
        });
        setIsRunning(true);
    }, [angle, velocity]);

    const updatePhysics = useCallback((deltaTime: number) => {
        if (!projectile) return;

        const dt = Math.min(deltaTime, 0.05);

        const newVy = projectile.vy + gravity * dt * scale;
        const newX = projectile.x + projectile.vx * dt * scale;
        const newY = projectile.y + newVy * dt * scale;

        if (newY >= 350) {
            setIsRunning(false);
            setProjectile((prev) =>
                prev
                    ? {
                        ...prev,
                        y: 350,
                        vy: 0,
                        vx: 0,
                        trail: [...prev.trail, { x: prev.x, y: prev.y }],
                    }
                    : null
            );
            return;
        }

        setProjectile((prev) =>
            prev
                ? {
                    ...prev,
                    x: newX,
                    y: newY,
                    vy: newVy,
                    trail: [...prev.trail.slice(-100), { x: prev.x, y: prev.y }],
                }
                : null
        );
    }, [projectile]);

    const draw = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = "#334155";
        ctx.fillRect(0, 350, width, 50);

        ctx.strokeStyle = "#1e293b";
        ctx.lineWidth = 1;
        for (let x = 0; x < width; x += 50) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, 350);
            ctx.stroke();
        }
        for (let y = 0; y < 350; y += 50) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        const launchX = 50;
        const launchY = 350;
        const angleRad = (angle * Math.PI) / 180;
        const barrelLength = 40;

        ctx.save();
        ctx.translate(launchX, launchY);
        ctx.rotate(-angleRad);

        ctx.fillStyle = "#64748b";
        ctx.fillRect(0, -5, barrelLength, 10);
        ctx.restore();

        ctx.beginPath();
        ctx.arc(launchX, launchY, 15, 0, Math.PI * 2);
        ctx.fillStyle = "#475569";
        ctx.fill();

        if (projectile) {
            if (projectile.trail.length > 1) {
                ctx.beginPath();
                ctx.moveTo(projectile.trail[0].x, projectile.trail[0].y);

                for (let i = 1; i < projectile.trail.length; i++) {
                    ctx.lineTo(projectile.trail[i].x, projectile.trail[i].y);
                }

                ctx.strokeStyle = "rgba(234, 179, 8, 0.5)";
                ctx.lineWidth = 2;
                ctx.stroke();
            }

            const gradient = ctx.createRadialGradient(
                projectile.x - 3,
                projectile.y - 3,
                0,
                projectile.x,
                projectile.y,
                12
            );
            gradient.addColorStop(0, "#fbbf24");
            gradient.addColorStop(1, "#d97706");

            ctx.beginPath();
            ctx.arc(projectile.x, projectile.y, 12, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();

            if (isRunning) {
                const vecScale = 2;
                ctx.beginPath();
                ctx.moveTo(projectile.x, projectile.y);
                ctx.lineTo(
                    projectile.x + projectile.vx * vecScale,
                    projectile.y + projectile.vy * vecScale
                );
                ctx.strokeStyle = "#22c55e";
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        }

        ctx.fillStyle = "#e2e8f0";
        ctx.font = "14px system-ui";
        ctx.fillText(`Launch Angle: ${angle}°`, 20, 30);
        ctx.fillText(`Initial Velocity: ${velocity} m/s`, 20, 50);

        if (projectile) {
            const height = Math.max(0, (350 - projectile.y) / scale);
            const distance = (projectile.x - 50) / scale;
            const speed = Math.sqrt(projectile.vx ** 2 + projectile.vy ** 2);

            ctx.fillText(`Height: ${height.toFixed(1)} m`, 20, 70);
            ctx.fillText(`Distance: ${distance.toFixed(1)} m`, 20, 90);
            ctx.fillText(`Speed: ${speed.toFixed(1)} m/s`, 20, 110);
        }
    }, [projectile, angle, velocity, isRunning]);

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
        setProjectile(null);
        setIsRunning(false);
    };

    return (
        <div className="space-y-4">
            <canvas
                ref={canvasRef}
                width={600}
                height={400}
                className="w-full h-auto rounded-lg"
                style={{ maxWidth: "600px" }}
            />

            <div className="flex flex-wrap gap-2">
                <Button onClick={launch} disabled={isRunning}>
                    Launch
                </Button>
                <Button variant="outline" onClick={handleReset}>
                    Reset
                </Button>
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium">
                    Launch Angle: {angle}°
                </label>
                <input
                    type="range"
                    min="5"
                    max="85"
                    value={angle}
                    onChange={(e) => setAngle(Number(e.target.value))}
                    disabled={isRunning}
                    className="w-full"
                />

                <label className="block text-sm font-medium">
                    Initial Velocity: {velocity} m/s
                </label>
                <input
                    type="range"
                    min="10"
                    max="100"
                    value={velocity}
                    onChange={(e) => setVelocity(Number(e.target.value))}
                    disabled={isRunning}
                    className="w-full"
                />
            </div>
        </div>
    );
}