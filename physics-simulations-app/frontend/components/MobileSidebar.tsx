// File: components/MobileSidebar.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/lib/categories";
import { GroupedSimulations } from "@/types/simulation";

interface MobileSidebarProps {
    groupedSimulations: GroupedSimulations;
}

export default function MobileSidebar({ groupedSimulations }: MobileSidebarProps) {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
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
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-72 p-0">
                <SheetHeader className="p-4 border-b">
                    <SheetTitle className="flex items-center gap-2">
                        <span className="text-2xl">🔬</span>
                        <span>Physics Simulations</span>
                    </SheetTitle>
                </SheetHeader>

                <ScrollArea className="h-[calc(100vh-80px)] p-4">
                    <nav className="space-y-2">
                        <Link
                            href="/simulations"
                            onClick={() => setOpen(false)}
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

                            return (
                                <Collapsible
                                    key={category.slug}
                                    open={isOpen}
                                    onOpenChange={() => toggleCategory(category.slug)}
                                >
                                    <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 rounded-md text-sm font-medium hover:bg-muted">
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
                                                    onClick={() => setOpen(false)}
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
                                    </CollapsibleContent>
                                </Collapsible>
                            );
                        })}
                    </nav>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}