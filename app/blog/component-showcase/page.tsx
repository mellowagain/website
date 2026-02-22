"use client"

import { useState } from "react"
import { NierShell } from "@/components/nier-shell"
import { NierWindow, NierStatRow } from "@/components/nier-window"
import { NierMenu } from "@/components/nier-menu"
import { NierPortrait } from "@/components/nier-portrait"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link"

const sectionOrder = [
  "intro",
  "custom",
  "buttons",
  "inputs",
  "data",
  "layout",
  "feedback",
] as const

export default function ComponentShowcasePage() {
  const [demoMenuActive, setDemoMenuActive] = useState("about")

  return (
    <NierShell>
      <div className="flex flex-col gap-10">
        {/* Blog post header */}
        <div className="flex flex-col gap-3">
          <Link
            href="/blog"
            className="font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground/50 transition-colors hover:text-foreground/70"
          >
            &larr; back to blog
          </Link>
          <h1 className="font-sans text-2xl font-medium tracking-wide text-foreground">
            Building a Nier: Automata-Inspired Component System
          </h1>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-muted-foreground/60">
              2026-02-21
            </span>
            <span className="text-muted-foreground/20" aria-hidden="true">
              |
            </span>
            <div className="flex gap-2">
              {["design", "components", "ui"].map((tag) => (
                <span
                  key={tag}
                  className="font-sans text-[11px] uppercase tracking-[0.15em] text-muted-foreground/50"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-border/20" aria-hidden="true" />

        {/* Intro section */}
        <section id="intro" className="flex flex-col gap-4">
          <p className="font-sans text-sm leading-relaxed text-foreground/85">
            When I first played Nier: Automata, the menu UI captivated me just
            as much as the story. The warm parchment tones, the geometric line
            decorations, the small rotating square bullets next to each menu
            option -- it all felt deliberate and beautiful. So I decided to
            build a component system inspired by it.
          </p>
          <p className="font-sans text-sm leading-relaxed text-foreground/85">
            This post is a living showcase of every component used on this site.
            Each section below demonstrates the components with interactive
            examples, all themed with the same dark Nier palette you see across
            the rest of mari.zip.
          </p>
        </section>

        <div className="h-px w-full bg-border/20" aria-hidden="true" />

        {/* Custom Nier Components */}
        <section id="custom" className="flex flex-col gap-8">
          <SectionHeading
            title="Custom Nier Components"
            description="Bespoke components built specifically for the Nier aesthetic -- the building blocks of every page on this site."
          />

          <h3 className="font-sans text-base font-medium text-foreground/90">
            NierWindow
          </h3>
          <p className="font-sans text-sm text-foreground/70">
            The core container. A muted header bar with a square bullet icon,
            followed by a body area. Used everywhere for grouping content.
          </p>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <NierWindow title="System Info">
              <div className="flex flex-col">
                <NierStatRow label="Unit" value="YoRHa No.2 Type B" />
                <NierStatRow label="Class" value="Battle" />
                <NierStatRow label="Affiliation" value="YoRHa" />
                <NierStatRow label="Status" value="Active" />
              </div>
            </NierWindow>
            <NierWindow title="Mission Log">
              <p className="font-sans text-sm leading-relaxed text-foreground/85">
                Reconnaissance of the abandoned factory sector complete. Machine
                lifeform activity detected at grid reference 7-Alpha. Awaiting
                further orders from Command.
              </p>
            </NierWindow>
          </div>

          <Separator className="bg-border/20" />

          <h3 className="font-sans text-base font-medium text-foreground/90">
            NierMenu
          </h3>
          <p className="font-sans text-sm text-foreground/70">
            The sidebar navigation. Active items get an inverted bar with a
            diamond cursor. Inactive items are semi-transparent strips. Square
            bullets rotate 45 degrees on hover.
          </p>
          <div className="w-64">
            <NierMenu
              activeSection={demoMenuActive}
              onSectionChange={setDemoMenuActive}
            />
          </div>

          <Separator className="bg-border/20" />

          <h3 className="font-sans text-base font-medium text-foreground/90">
            NierPortrait
          </h3>
          <p className="font-sans text-sm text-foreground/70">
            A tall narrow image container with a warm sepia filter that reveals
            the original colors on hover. Hover the image below to see it.
          </p>
          <div className="flex gap-4">
            <div className="w-36">
              <NierPortrait
                src="/images/portrait.jpg"
                alt="Showcase portrait"
              />
            </div>
          </div>

          <Separator className="bg-border/20" />

          <h3 className="font-sans text-base font-medium text-foreground/90">
            NierStatRow
          </h3>
          <p className="font-sans text-sm text-foreground/70">
            Label-value pairs connected by a decorative dotted line. Commonly
            used inside NierWindow for character stats, metadata, or key-value
            displays.
          </p>
          <NierWindow title="Character Stats">
            <div className="flex flex-col">
              <NierStatRow label="HP" value="800 / 800" />
              <NierStatRow label="Attack (Light)" value="665" />
              <NierStatRow label="Attack (Heavy)" value="815" />
              <NierStatRow label="Ranged Attack" value="150" />
              <NierStatRow label="Defense" value="100" />
            </div>
          </NierWindow>
        </section>

        <div className="h-px w-full bg-border/20" aria-hidden="true" />

        {/* Buttons & Badges */}
        <section id="buttons" className="flex flex-col gap-8">
          <SectionHeading
            title="Buttons & Badges"
            description="All shadcn/ui button variants and badge styles, themed to match the Nier dark palette."
          />

          <NierWindow title="Button Variants">
            <div className="flex flex-wrap gap-3">
              <Button variant="default">Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
              <Button variant="destructive">Destructive</Button>
            </div>
          </NierWindow>

          <NierWindow title="Button Sizes">
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
            </div>
          </NierWindow>

          <NierWindow title="States">
            <div className="flex flex-wrap gap-3">
              <Button>Enabled</Button>
              <Button disabled>Disabled</Button>
            </div>
          </NierWindow>

          <NierWindow title="Badge Variants">
            <div className="flex flex-wrap gap-3">
              <Badge variant="default">Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
            </div>
          </NierWindow>

          <NierWindow title="Tooltips">
            <div className="flex gap-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Hover me</Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Pod 042 reporting.</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="secondary">And me</Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Analysis: Hovering detected.</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </NierWindow>
        </section>

        <div className="h-px w-full bg-border/20" aria-hidden="true" />

        {/* Inputs & Forms */}
        <section id="inputs" className="flex flex-col gap-8">
          <SectionHeading
            title="Inputs & Forms"
            description="Form controls for data entry, all respecting the dark theme tokens."
          />

          <NierWindow title="Text Fields">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Operator Name</Label>
                <Input id="name" placeholder="Enter designation..." />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="disabled-input">Locked Field</Label>
                <Input
                  id="disabled-input"
                  placeholder="Access denied"
                  disabled
                />
              </div>
            </div>
          </NierWindow>

          <NierWindow title="Textarea">
            <div className="flex flex-col gap-2">
              <Label htmlFor="report">Mission Report</Label>
              <Textarea id="report" placeholder="Enter mission report..." />
            </div>
          </NierWindow>

          <NierWindow title="Select">
            <div className="flex flex-col gap-2">
              <Label>Assigned Unit</Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select unit..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2b">2B - Battle Unit</SelectItem>
                  <SelectItem value="9s">9S - Scanner Unit</SelectItem>
                  <SelectItem value="a2">A2 - Attacker Unit</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </NierWindow>

          <NierWindow title="Checkbox & Switch">
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <Checkbox id="auto-heal" defaultChecked />
                <Label htmlFor="auto-heal">Auto-heal enabled</Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox id="hud" />
                <Label htmlFor="hud">Display HUD overlay</Label>
              </div>
              <Separator className="bg-border/20" />
              <div className="flex items-center justify-between">
                <Label htmlFor="flight-mode">Flight Unit Mode</Label>
                <Switch id="flight-mode" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="pod-assist">Pod Assist</Label>
                <Switch id="pod-assist" defaultChecked />
              </div>
            </div>
          </NierWindow>

          <NierWindow title="Radio Group">
            <RadioGroup defaultValue="normal">
              <div className="flex items-center gap-3">
                <RadioGroupItem value="easy" id="easy" />
                <Label htmlFor="easy">Easy</Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="normal" id="normal" />
                <Label htmlFor="normal">Normal</Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="hard" id="hard" />
                <Label htmlFor="hard">Hard</Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="very-hard" id="very-hard" />
                <Label htmlFor="very-hard">Very Hard</Label>
              </div>
            </RadioGroup>
          </NierWindow>

          <NierWindow title="Slider">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <Label>Master Volume</Label>
                <Slider defaultValue={[75]} max={100} step={1} />
              </div>
              <div className="flex flex-col gap-3">
                <Label>BGM Volume</Label>
                <Slider defaultValue={[60]} max={100} step={1} />
              </div>
              <div className="flex flex-col gap-3">
                <Label>SFX Volume</Label>
                <Slider defaultValue={[85]} max={100} step={1} />
              </div>
            </div>
          </NierWindow>
        </section>

        <div className="h-px w-full bg-border/20" aria-hidden="true" />

        {/* Data Display */}
        <section id="data" className="flex flex-col gap-8">
          <SectionHeading
            title="Data Display"
            description="Cards, accordions, and tabs for organizing structured information."
          />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Weapon: Virtuous Contract</CardTitle>
                <CardDescription>
                  A white katana used by YoRHa units.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Attack:</span>
                    <span>180 - 340</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Combo Speed:</span>
                    <span>Fast</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm">
                  Equip
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Weapon: Cruel Oath</CardTitle>
                <CardDescription>
                  A black katana paired with Virtuous Contract.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Attack:</span>
                    <span>160 - 380</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Combo Speed:</span>
                    <span>Fast</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm">
                  Equip
                </Button>
              </CardFooter>
            </Card>
          </div>

          <NierWindow title="Accordion">
            <Accordion type="single" collapsible>
              <AccordionItem value="machines">
                <AccordionTrigger>Machine Lifeforms</AccordionTrigger>
                <AccordionContent>
                  Alien-created robots that have developed a rudimentary form of
                  consciousness. They mimic human behavior in increasingly
                  complex ways and have begun forming their own societies.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="yorha">
                <AccordionTrigger>YoRHa</AccordionTrigger>
                <AccordionContent>
                  An elite android military force created to fight the machine
                  lifeforms on behalf of humanity. They operate from an orbital
                  base known as the Bunker.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="pods">
                <AccordionTrigger>Tactical Support Pods</AccordionTrigger>
                <AccordionContent>
                  Autonomous support units assigned to YoRHa androids. They
                  provide ranged fire support, utility functions, and strategic
                  analysis during combat operations.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </NierWindow>

          <NierWindow title="Tabs">
            <Tabs defaultValue="weapons">
              <TabsList>
                <TabsTrigger value="weapons">Weapons</TabsTrigger>
                <TabsTrigger value="items">Items</TabsTrigger>
                <TabsTrigger value="chips">Plug-in Chips</TabsTrigger>
              </TabsList>
              <TabsContent value="weapons" className="mt-4">
                <div className="flex flex-col gap-2 text-sm text-foreground/85">
                  <p>
                    Small Swords: Virtuous Contract, Cruel Oath, Type-3 Sword
                  </p>
                  <p>
                    Large Swords: Virtuous Treaty, Cruel Blood Oath, Iron Pipe
                  </p>
                  <p>Spears: Virtuous Dignity, Cruel Arrogance, Type-3 Lance</p>
                </div>
              </TabsContent>
              <TabsContent value="items" className="mt-4">
                <div className="flex flex-col gap-2 text-sm text-foreground/85">
                  <p>
                    Recovery: Small Recovery, Medium Recovery, Large Recovery
                  </p>
                  <p>
                    Boost: Strength Up (S), Strength Up (M), Strength Up (L)
                  </p>
                  <p>Materials: Broken Circuit, Dented Plate, Severed Cable</p>
                </div>
              </TabsContent>
              <TabsContent value="chips" className="mt-4">
                <div className="flex flex-col gap-2 text-sm text-foreground/85">
                  <p>Attack: Weapon Attack Up, Ranged Attack Up, Critical Up</p>
                  <p>Defense: Max HP Up, Melee Defense, Ranged Defense</p>
                  <p>System: Auto-Heal, Auto-Item Use, HUD: HP Gauge</p>
                </div>
              </TabsContent>
            </Tabs>
          </NierWindow>
        </section>

        <div className="h-px w-full bg-border/20" aria-hidden="true" />

        {/* Layout */}
        <section id="layout" className="flex flex-col gap-8">
          <SectionHeading
            title="Layout"
            description="Separators, nested windows, and grid compositions."
          />

          <NierWindow title="Separators">
            <div className="flex flex-col gap-4">
              <p className="text-sm text-foreground/85">
                Content above the separator
              </p>
              <Separator />
              <p className="text-sm text-foreground/85">
                Content below the separator
              </p>
              <div className="flex h-8 items-center gap-4">
                <span className="text-sm text-foreground/85">Left</span>
                <Separator orientation="vertical" />
                <span className="text-sm text-foreground/85">Center</span>
                <Separator orientation="vertical" />
                <span className="text-sm text-foreground/85">Right</span>
              </div>
            </div>
          </NierWindow>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <NierWindow title="Primary Panel">
                <div className="flex flex-col gap-3">
                  <p className="text-sm text-foreground/85">
                    Main content area. The 3:2 grid split mirrors the game
                    inventory screen where items are listed on the left and
                    details are shown on the right.
                  </p>
                  <NierWindow title="Nested Window">
                    <p className="text-sm text-foreground/85">
                      Windows can be nested to create deeper hierarchies,
                      similar to sub-menus in the game interface.
                    </p>
                  </NierWindow>
                </div>
              </NierWindow>
            </div>
            <div className="flex flex-col gap-4 lg:col-span-2">
              <NierWindow title="Side Panel A">
                <NierStatRow label="Status" value="Operational" />
                <NierStatRow label="Uptime" value="2,847 hrs" />
              </NierWindow>
              <NierWindow title="Side Panel B">
                <NierStatRow label="Memory" value="512 MB" />
                <NierStatRow label="Storage" value="2.4 GB" />
              </NierWindow>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {["Alpha", "Beta", "Gamma", "Delta"].map((name, i) => (
              <NierWindow key={name} title={`Sector ${name}`}>
                <div className="flex flex-col items-center gap-1 py-2">
                  <span className="text-2xl font-light text-foreground/60">
                    {[42, 87, 13, 56][i]}
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    units
                  </span>
                </div>
              </NierWindow>
            ))}
          </div>
        </section>

        <div className="h-px w-full bg-border/20" aria-hidden="true" />

        {/* Feedback & Loading */}
        <section id="feedback" className="flex flex-col gap-8">
          <SectionHeading
            title="Feedback & Loading"
            description="Progress indicators, skeletons, and a combined terminal example."
          />

          <NierWindow title="Progress Bars">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Memory Scan</span>
                  <span className="text-foreground/70">78%</span>
                </div>
                <Progress value={78} />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Data Sync</span>
                  <span className="text-foreground/70">45%</span>
                </div>
                <Progress value={45} />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Upload Complete</span>
                  <span className="text-foreground/70">100%</span>
                </div>
                <Progress value={100} />
              </div>
            </div>
          </NierWindow>

          <NierWindow title="Skeleton Loading">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12" />
                <div className="flex flex-1 flex-col gap-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
              <Skeleton className="h-24 w-full" />
              <div className="flex gap-3">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          </NierWindow>

          <NierWindow title="Operator Terminal">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Label htmlFor="terminal-cmd">Command Input</Label>
                <div className="flex gap-2">
                  <Input
                    id="terminal-cmd"
                    placeholder="Enter command..."
                    className="flex-1"
                  />
                  <Button>Execute</Button>
                </div>
              </div>

              <Separator className="bg-border/20" />

              <div className="flex flex-wrap gap-2">
                <Badge>Online</Badge>
                <Badge variant="secondary">Pod 042</Badge>
                <Badge variant="outline">Priority: Normal</Badge>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Connection Strength
                  </span>
                  <span className="text-foreground/70">92%</span>
                </div>
                <Progress value={92} />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="encrypt">Encrypt Transmission</Label>
                <Switch id="encrypt" defaultChecked />
              </div>

              <Textarea
                placeholder="Transmission log will appear here..."
                className="min-h-20"
              />

              <div className="flex justify-end gap-2">
                <Button variant="ghost">Clear</Button>
                <Button variant="outline">Save Log</Button>
                <Button>Transmit</Button>
              </div>
            </div>
          </NierWindow>
        </section>
      </div>
    </NierShell>
  )
}

function SectionHeading({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col gap-1">
      <h2 className="font-sans text-lg font-medium tracking-wide text-foreground">
        {title}
      </h2>
      <p className="font-sans text-sm font-light text-muted-foreground">
        {description}
      </p>
    </div>
  )
}
