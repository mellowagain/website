import { NierShell } from "@/components/nier-shell";
import { NierWindow, NierStatRow } from "@/components/nier-window";
import ContactMethods from "@/components/custom/contact";

const pgpFingerprint = "FC7E 9DF4 B088 55C8 8059 C631 EE71 F041 55E9 C6FD";

export const metadata = { title: "Contact" };
export default function ContactPage() {
    return (
        <NierShell>
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                    <p className="font-sans text-sm leading-relaxed text-foreground/85">
                        I'm always open to interesting conversations about Rust, transit infrastructure, developer tooling or anything else
                        that's cool. Prefer async communication. I'll usually reply within a day or two.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
                    {/* Links */}
                    <div className="lg:col-span-3">
                        <NierWindow title="Channels">
                            <div className="flex flex-col">
                                <ContactMethods />
                            </div>
                        </NierWindow>
                    </div>

                    {/* Info */}
                    <div className="lg:col-span-2">
                        <NierWindow title="Info">
                            <div className="flex flex-col">
                                <NierStatRow label="Timezone" value="CET / CEST" />
                                <NierStatRow label="Preferred" value="Email or Signal" />
                                <NierStatRow label="Languages" value="EN, DE" />
                            </div>
                        </NierWindow>
                    </div>
                </div>

                {/* PGP */}
                <NierWindow title="PGP">
                    <div className="flex flex-col gap-2">
                        <p className="font-sans text-sm text-foreground/70">If you need to send something encrypted:</p>
                        <code className="break-all font-mono text-xs leading-relaxed text-foreground/50">
                            <a
                                href="/pgp.asc"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center justify-between border-b border-border/15 py-2.5 transition-colors last:border-b-0"
                            >
                                {pgpFingerprint}
                            </a>
                        </code>
                    </div>
                </NierWindow>
            </div>
        </NierShell>
    );
}
