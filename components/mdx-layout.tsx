"use client";

import { NierShell } from "@/components/nier-shell";

export default function MdxLayout({ children }: { children: React.ReactNode }) {
  return (
    <NierShell>
      <article className="flex flex-col gap-0">{children}</article>
    </NierShell>
  );
}
