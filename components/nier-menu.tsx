"use client";

interface MenuItem {
  id: string;
  label: string;
}

interface NierMenuProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  items?: MenuItem[];
}

const defaultMenuItems: MenuItem[] = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

export function NierMenu({
  activeSection,
  onSectionChange,
  items,
}: NierMenuProps) {
  const menuItems = items ?? defaultMenuItems;
  return (
    <nav aria-label="Main navigation" className="w-full">
      <ul className="flex flex-col gap-1.5">
        {menuItems.map((item) => {
          const isActive = activeSection === item.id;

          return (
            <li key={item.id} className="flex items-center">
              {/* Diamond cursor indicator - only visible on active */}
              <div className="flex w-5 shrink-0 items-center justify-center">
                {isActive && (
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    className="text-foreground"
                    aria-hidden="true"
                  >
                    <path d="M5 0 L10 5 L5 10 L0 5 Z" fill="currentColor" />
                  </svg>
                )}
              </div>

              {/* Menu bar */}
              <button
                onClick={() => onSectionChange(item.id)}
                className={`group flex w-full items-center gap-3 px-3 py-3 text-left transition-all duration-200 ${
                  isActive
                    ? "bg-foreground/90"
                    : "bg-foreground/[0.07] hover:bg-foreground/[0.12]"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {/* Square bullet */}
                <span
                  className={`nier-bullet inline-block h-3 w-3 shrink-0 border transition-colors duration-200 ${
                    isActive
                      ? "nier-bullet-active border-background/60 bg-background/50"
                      : "border-foreground/30 bg-foreground/12 group-hover:border-foreground/50 group-hover:bg-foreground/25"
                  }`}
                  aria-hidden="true"
                />

                <span
                  className={`font-sans text-sm tracking-wide transition-colors duration-200 ${
                    isActive
                      ? "text-background"
                      : "text-foreground/80 group-hover:text-foreground"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
