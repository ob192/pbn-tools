// File: lib/categories.ts
import { CategoryInfo } from "@/types/simulation";

export const CATEGORIES: CategoryInfo[] = [
    {
        name: "Mechanics",
        slug: "mechanics",
        description: "Classical mechanics simulations including motion, forces, and energy",
        icon: "⚙️",
    },
    {
        name: "Waves",
        slug: "waves",
        description: "Wave phenomena including interference, diffraction, and standing waves",
        icon: "🌊",
    },
    {
        name: "Optics",
        slug: "optics",
        description: "Light and optics simulations including refraction and lenses",
        icon: "🔦",
    },
    {
        name: "Thermodynamics",
        slug: "thermodynamics",
        description: "Heat, temperature, and energy transfer simulations",
        icon: "🌡️",
    },
    {
        name: "Electromagnetism",
        slug: "electromagnetism",
        description: "Electric and magnetic field simulations",
        icon: "⚡",
    },
];

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://physics-simulations.com";
export const SITE_NAME = "Physics Simulations";
export const SITE_DESCRIPTION = "Interactive physics simulations for learning and exploration";