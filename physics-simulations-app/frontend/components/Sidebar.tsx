// File: components/Sidebar.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/lib/categories";
import { GroupedSimulations } from "@/types/simulation";

interface SidebarProps {
    groupedSimulations: GroupedSimulations;
}

export default function Sidebar({ groupedSimulations }: SidebarProps) {
    const pathname = usePathname();
    const [openCategories, setOpenCategories] = useState<string[]>(
        CATEGORIES.map((c) => c.slug)
    );

    const toggleCategory = (category: string) => {
        setOpenCategories((prev) =>
            prev.includes(category)
                ? prev.filter((c) => c !== category)
                : [...prev, category]
        );
    };

    return (
        <aside className="hidden lg:flex w-64 flex-col border-r bg-background">
            <div className="p-4 border-b">
                <Link href="/" className="flex items-center space-x-2">
                    <span className="text-2xl">🔬</span>
                    <span className="font-bold text-lg">Physics Sims</span>
                </Link>
            </div>

            <ScrollArea className="flex-1 p-4">
                <nav className="space-y-2">
                    <Link
                        href="/simulations"
                        className={cn(
                            "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                            pathname === "/simulations"
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-muted"
                        )}
                    >
                        All Simulations
                    </Link>

                    {CATEGORIES.map((category) => {
                        const simulations = groupedSimulations[category.slug] || [];
                        const isOpen = openCategories.includes(category.slug);
                        const isCategoryActive = pathname.includes(`/simulations/${category.slug}`);

                        return (
                            <Collapsible
                                key={category.slug}
                                open={isOpen}
                                onOpenChange={() => toggleCategory(category.slug)}
                            >
                                <CollapsibleTrigger
                                    className={cn(
                                        "flex items-center justify-between w-full px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                        isCategoryActive ? "bg-muted" : "hover:bg-muted"
                                    )}
                                >
                  <span className="flex items-center gap-2">
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                  </span>
                                    {isOpen ? (
                                        <ChevronDown className="h-4 w-4" />
                                    ) : (
                                        <ChevronRight className="h-4 w-4" />
                                    )}
                                </CollapsibleTrigger>

                                <CollapsibleContent className="pl-4 mt-1 space-y-1">
                                    {simulations.map((sim) => {
                                        const simPath = `/simulations/${category.slug}/${sim.slug}`;
                                        const isActive = pathname === simPath;

                                        return (
                                            <Link
                                                key={sim.slug}
                                                href={simPath}
                                                className={cn(
                                                    "block px-3 py-2 rounded-md text-sm transition-colors",
                                                    isActive
                                                        ? "bg-primary text-primary-foreground"
                                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                                )}
                                            >
                                                {sim.title}
                                            </Link>
                                        );
                                    })}

                                    {simulations.length === 0 && (
                                        <span className="block px-3 py-2 text-sm text-muted-foreground italic">
                      Coming soon...
                    </span>
                                    )}
                                </CollapsibleContent>
                            </Collapsible>
                        );
                    })}
                </nav>
            </ScrollArea>
        </aside>
    );
}