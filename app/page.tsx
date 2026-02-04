"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  calculateWorkTime,
  DEFAULT_HOURS_PER_DAY,
  formatHoursMinutes,
  type IncomeMode,
} from "@/lib/calculations";
import { useLocalStorage } from "@/lib/use-local-storage";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  mode: z.enum(["hourly", "salary"]),
  hourlyRate: z.number().min(1, "Enter a positive hourly rate."),
  annualSalary: z.number().min(1000, "Enter a realistic salary."),
  itemPrice: z.number().min(1, "Enter an item price."),
  includeTax: z.boolean(),
  taxRate: z.number().min(0).max(0.4),
});

type FormValues = z.infer<typeof formSchema>;

const defaultValues: FormValues = {
  mode: "hourly",
  hourlyRate: 35,
  annualSalary: 72000,
  itemPrice: 249,
  includeTax: false,
  taxRate: 0.22,
};

export default function HomePage() {
  const storage = useLocalStorage<FormValues>("hourfy-settings", defaultValues);
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: storage.value,
    mode: "onChange",
  });

  const values = watch();

  React.useEffect(() => {
    if (storage.hydrated) {
      Object.entries(storage.value).forEach(([key, value]) => {
        setValue(key as keyof FormValues, value as never, {
          shouldValidate: true,
          shouldDirty: false,
        });
      });
    }
  }, [setValue, storage.hydrated, storage.value]);

  React.useEffect(() => {
    if (!storage.hydrated) return;
    storage.setValue(values);
  }, [storage, values]);

  const calculation = calculateWorkTime(values);
  const time = formatHoursMinutes(calculation.minutesRequired);

  const shareText = `Hourfy \u2022 ${values.itemPrice.toFixed(2)} costs ${time.hours}h ${
    time.minutes
  }m of work (${calculation.workdaysRequired.toFixed(2)} days).`;

  const [copyState, setCopyState] = React.useState("Copy share card");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopyState("Copied!");
      setTimeout(() => setCopyState("Copy share card"), 2000);
    } catch {
      setCopyState("Copy failed");
      setTimeout(() => setCopyState("Copy share card"), 2000);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "Hourfy",
        text: shareText,
      });
    } else {
      handleCopy();
    }
  };

  return (
    <main className="min-h-screen bg-background px-4 py-10 text-foreground">
      <div className="mx-auto flex w-full max-w-xl flex-col gap-8">
        <header className="space-y-4 text-center animate-fade-in">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">
            Hourfy
          </p>
          <h1 className="text-3xl font-semibold sm:text-4xl">
            Put price tags into <span className="gradient-text">work hours</span>.
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Hourfy helps you translate purchases into time. Set your income, add a
            price, and instantly see how many hours and days it represents.
          </p>
        </header>

        <Card className="glass-panel animate-fade-in">
          <CardHeader>
            <CardTitle>Income setup</CardTitle>
            <p className="text-sm text-muted-foreground">
              Toggle between hourly rate or annual salary. Hourfy stores your
              settings locally.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs
              value={values.mode}
              onValueChange={(value) => setValue("mode", value as IncomeMode)}
            >
              <TabsList className="w-full">
                <TabsTrigger className="w-full" value="hourly">
                  Hourly rate
                </TabsTrigger>
                <TabsTrigger className="w-full" value="salary">
                  Annual salary
                </TabsTrigger>
              </TabsList>
              <TabsContent value="hourly">
                <div className="space-y-2">
                  <Label htmlFor="hourlyRate">Hourly rate</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    step="0.01"
                    {...register("hourlyRate", { valueAsNumber: true })}
                  />
                  {errors.hourlyRate ? (
                    <p className="text-xs text-red-400">
                      {errors.hourlyRate.message}
                    </p>
                  ) : null}
                </div>
              </TabsContent>
              <TabsContent value="salary">
                <div className="space-y-2">
                  <Label htmlFor="annualSalary">Annual salary</Label>
                  <Input
                    id="annualSalary"
                    type="number"
                    step="1"
                    {...register("annualSalary", { valueAsNumber: true })}
                  />
                  {errors.annualSalary ? (
                    <p className="text-xs text-red-400">
                      {errors.annualSalary.message}
                    </p>
                  ) : null}
                </div>
              </TabsContent>
            </Tabs>

            <div className="grid gap-4 rounded-2xl border border-border bg-muted/40 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="includeTax">After-tax estimate</Label>
                  <p className="text-xs text-muted-foreground">
                    Apply a simple effective tax rate to your income.
                  </p>
                </div>
                <Switch
                  id="includeTax"
                  checked={values.includeTax}
                  onCheckedChange={(checked) => setValue("includeTax", checked)}
                />
              </div>
              <div
                className={cn(
                  "space-y-3 transition-opacity",
                  values.includeTax ? "opacity-100" : "opacity-50"
                )}
              >
                <div className="flex items-center justify-between text-sm">
                  <span>Estimated tax rate</span>
                  <span className="font-semibold">
                    {(values.taxRate * 100).toFixed(0)}%
                  </span>
                </div>
                <Slider
                  min={0}
                  max={40}
                  step={1}
                  value={[Math.round(values.taxRate * 100)]}
                  onValueChange={([value]) =>
                    setValue("taxRate", value / 100, { shouldDirty: true })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel animate-fade-in">
          <CardHeader>
            <CardTitle>Item price</CardTitle>
            <p className="text-sm text-muted-foreground">
              Enter any price to see the equivalent time cost.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="itemPrice">Item price</Label>
              <Input
                id="itemPrice"
                type="number"
                step="0.01"
                {...register("itemPrice", { valueAsNumber: true })}
              />
              {errors.itemPrice ? (
                <p className="text-xs text-red-400">
                  {errors.itemPrice.message}
                </p>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel animate-fade-in">
          <CardHeader>
            <CardTitle>Result</CardTitle>
            <p className="text-sm text-muted-foreground">
              Based on a {DEFAULT_HOURS_PER_DAY}h workday.
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-border bg-muted/40 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  Time required
                </p>
                <p className="mt-2 text-2xl font-semibold">
                  {time.hours}h {time.minutes}m
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-muted/40 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  Workdays
                </p>
                <p className="mt-2 text-2xl font-semibold">
                  {calculation.workdaysRequired.toFixed(2)}
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-muted/40 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  Effective rate
                </p>
                <p className="mt-2 text-2xl font-semibold">
                  ${calculation.hourlyRate.toFixed(2)}/hr
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card/90 p-6 shadow-glow">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
                    Shareable card
                  </p>
                  <p className="mt-3 text-lg font-semibold">
                    ${values.itemPrice.toFixed(2)} requires
                  </p>
                  <p className="text-3xl font-semibold text-primary">
                    {time.hours}h {time.minutes}m
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    That&apos;s {calculation.workdaysRequired.toFixed(2)} workdays at
                    {" "}
                    {DEFAULT_HOURS_PER_DAY}h/day.
                  </p>
                </div>
                <div className="rounded-full bg-muted/60 px-3 py-1 text-xs text-muted-foreground animate-pulse-soft">
                  Ready to share
                </div>
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button type="button" onClick={handleShare}>
                  Share result
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCopy}
                >
                  {copyState}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel animate-fade-in">
          <CardHeader>
            <CardTitle>Quick tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Hourfy keeps your values on this device. No account or tracking—just
              your math.
            </p>
            <p>
              Toggle after-tax to compare take-home impact. Adjust the tax slider
              to your best estimate.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
