"use client";

import { useState, useEffect, useCallback, useTransition, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { NierBackground } from "@/components/nier-background";
import { NierMenu } from "@/components/nier-menu";
import { NierScrollArea } from "@/components/nier-scroll-area";

const menuItems = [
  { id: "/", label: "About" },
  { id: "/blog", label: "Blog" },
  { id: "/projects", label: "Projects" },
  { id: "/cv", label: "CV" },
  { id: "/uses", label: "Uses" },
  { id: "/bookmarks", label: "Bookmarks" },
  { id: "/playlist", label: "Playlist" },
  { id: "/cat", label: "Cat" },
  { id: "/map", label: "Map" },
  { id: "/changelog", label: "Changelog" },
  { id: "/contact", label: "Contact" },
];

function getActiveId(pathname: string) {
  if (pathname === "/") return "/";
  // match /uses/colophon to /uses
  const match = menuItems.find(
    (item) => item.id !== "/" && pathname.startsWith(item.id),
  );
  return match?.id ?? "/";
}

function getPageLabel(pathname: string) {
  if (pathname === "/uses/colophon") return "Colophon";
  const item = menuItems.find((i) => i.id === getActiveId(pathname));
  return item?.label ?? "About";
}

export function NierLoadingIndicator() {
  const [dots, setDots] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((d) => (d + 1) % 4);
    }, 350);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        {/* Rotating diamond */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          className="animate-spin text-foreground/50"
          style={{ animationDuration: "2.5s" }}
          aria-hidden="true"
        >
          <path
            d="M12 0 L24 12 L12 24 L0 12 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
          <path
            d="M12 4 L20 12 L12 20 L4 12 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
          />
        </svg>

        <div className="flex items-center gap-1">
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground/60">
            Loading
          </span>
          <span className="w-5 font-mono text-xs text-muted-foreground/60">
            {".".repeat(dots)}
          </span>
        </div>
      </div>
    </div>
  );
}

export function NierShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const prevPathname = useRef(pathname);

  const activeId = getActiveId(pathname);
  const pageLabel = getPageLabel(pathname);

  // Clear navigating state when pathname actually changes
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      setIsNavigating(false);
      prevPathname.current = pathname;
    }
  }, [pathname]);

  const showLoading = isPending || isNavigating;

  const handleNav = useCallback(
    (id: string) => {
      if (id === pathname) return;
      setIsNavigating(true);
      setShowMobileMenu(false);
      startTransition(() => {
        router.push(id);
      });
    },
    [router, pathname, startTransition],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const currentIndex = menuItems.findIndex((i) => i.id === activeId);

      if (e.key === "w" || e.key === "W" || e.key === "ArrowUp") {
        if (
          (e.target as HTMLElement)?.tagName === "INPUT" ||
          (e.target as HTMLElement)?.tagName === "TEXTAREA"
        )
          return;
        e.preventDefault();
        const prev = currentIndex > 0 ? currentIndex - 1 : menuItems.length - 1;
        handleNav(menuItems[prev].id);
      }

      if (e.key === "s" || e.key === "S" || e.key === "ArrowDown") {
        if (
          (e.target as HTMLElement)?.tagName === "INPUT" ||
          (e.target as HTMLElement)?.tagName === "TEXTAREA"
        )
          return;
        e.preventDefault();
        const next = currentIndex < menuItems.length - 1 ? currentIndex + 1 : 0;
        handleNav(menuItems[next].id);
      }

      if (e.key === "Escape") {
        setShowMobileMenu(false);
      }
    },
    [activeId, handleNav],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden bg-background">
      <NierBackground />

      {/* Main layout */}
      <div className="relative z-10 flex flex-1 overflow-hidden px-6 pt-8 md:px-16 md:pt-10 lg:px-32 lg:pt-12 xl:px-52 xl:pt-14 2xl:px-80 2xl:pt-16">
        {/* Left column: title + sidebar + metadata */}
        <div className="hidden shrink-0 flex-col md:flex md:w-56 lg:w-64">
          <header className="pb-10">
            <h1 className="whitespace-nowrap font-sans text-3xl font-medium tracking-[0.15em] text-foreground drop-shadow-[0_0_12px_rgba(200,191,168,0.25)] lg:text-4xl">
              mari.zip
            </h1>
            <p className="mt-2 font-sans text-sm font-light tracking-[0.3em] text-muted-foreground">
              &mdash; strangely quiet here without you
            </p>
          </header>

          <div className="flex-1 overflow-y-auto">
            <NierMenu
              activeSection={activeId}
              onSectionChange={handleNav}
              items={menuItems}
            />
          </div>

          <div className="mt-10 flex flex-col gap-1.5 px-1 pb-4">
            <span className="font-sans text-[11px] font-light tracking-wider text-muted-foreground/50">
              Creation: 1 January 2024
            </span>
            <span className="font-sans text-[11px] font-light tracking-wider text-muted-foreground/50">
              Last Update: 20 February 2026
            </span>
            <span className="font-sans text-[11px] font-light tracking-wider text-muted-foreground/50">
              Version: v2.1.0
            </span>
          </div>
        </div>

        {/* Mobile header */}
        <header className="fixed left-0 right-0 top-0 z-30 flex items-center justify-between border-b border-border/30 bg-background/95 px-6 py-3 backdrop-blur-sm md:hidden">
          <h1 className="whitespace-nowrap font-sans text-xl font-medium tracking-[0.15em] text-foreground drop-shadow-[0_0_12px_rgba(200,191,168,0.25)]">
            mari.zip
          </h1>
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="flex items-center gap-2 border border-border px-3 py-1.5 font-sans text-sm tracking-wide text-foreground transition-colors hover:bg-accent"
            aria-expanded={showMobileMenu}
            aria-controls="mobile-nav"
          >
            <span
              className="nier-bullet inline-block h-2.5 w-2.5 border border-foreground/50 bg-foreground/20"
              aria-hidden="true"
            />
            Menu
          </button>
        </header>

        {/* Mobile sidebar overlay */}
        {showMobileMenu && (
          <button
            className="fixed inset-0 z-30 bg-background/60 backdrop-blur-sm md:hidden"
            onClick={() => setShowMobileMenu(false)}
            aria-label="Close menu"
          />
        )}
        <aside
          id="mobile-nav"
          className={`${
            showMobileMenu ? "translate-x-0" : "-translate-x-full"
          } fixed inset-y-0 left-0 z-40 w-64 border-r border-border/30 bg-background pt-14 transition-transform duration-200 md:hidden`}
        >
          <div className="h-full overflow-y-auto px-4">
            <NierMenu
              activeSection={activeId}
              onSectionChange={handleNav}
              items={menuItems}
            />
          </div>
        </aside>

        {/* Content window */}
        <main className="flex flex-1 flex-col overflow-hidden pt-14 md:ml-10 md:pt-0 lg:ml-16 xl:ml-20">
          <div className="flex flex-1 flex-col overflow-hidden border border-border/40 bg-card/40">
            {/* Header bar */}
            <div className="flex items-center gap-2.5 border-b border-border/30 bg-accent/50 px-5 py-2.5">
              <span
                className="nier-bullet nier-bullet-active inline-block h-2.5 w-2.5 border border-foreground/40 bg-foreground/25"
                aria-hidden="true"
              />
              <span className="font-sans text-xs font-light uppercase tracking-[0.25em] text-foreground/70">
                {pageLabel}
              </span>
            </div>

            {/* Scrollable inner content */}
            {showLoading ? (
              <div className="flex-1">
                <NierLoadingIndicator />
              </div>
            ) : (
              <NierScrollArea className="px-6 py-6 md:px-8 md:py-8 lg:px-10 lg:py-10">
                {children}
              </NierScrollArea>
            )}
          </div>
        </main>
      </div>

      {/* Bottom bar */}
      <div className="relative z-10 flex items-center justify-between px-6 pb-8 pt-4 md:px-16 md:pb-10 lg:px-32 lg:pb-12 xl:px-52 xl:pb-14 2xl:px-80 2xl:pb-16">
        <div className="h-px flex-1 bg-border/20" aria-hidden="true" />
        <p className="pl-6 font-sans text-xs font-light italic tracking-wider text-muted-foreground/40">
          "Simplicity is not the absence of complexity, it's what you build
          after you understand it"
        </p>
      </div>
    </div>
  );
}
