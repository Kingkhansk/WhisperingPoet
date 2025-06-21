
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { generatePoem } from "@/ai/flows/generate-poem";
import type { GeneratePoemInput, GeneratePoemOutput } from "@/ai/flows/generate-poem";

const poemFormSchema = z.object({
  theme: z.string().min(3, { message: "Theme must be at least 3 characters." }).max(100, { message: "Theme must be 100 characters or less."}),
  style: z.string().min(1, { message: "Please select a style." }),
  language: z.string().min(1, { message: "Please select a language."}),
});

type PoemFormValues = z.infer<typeof poemFormSchema>;

const poemStyles = [
  { value: "Haiku", label: "Haiku" },
  { value: "Sonnet", label: "Sonnet" },
  { value: "Free Verse", label: "Free Verse" },
  { value: "Limerick", label: "Limerick" },
  { value: "Ode", label: "Ode" },
  { value: "Ballad", label: "Ballad" },
];

const poemLanguages = [
  { value: "English", label: "English" },
  { value: "Urdu", label: "Urdu (Roman)" },
];

export default function WhisperingPoetPageClient() {
  const [poem, setPoem] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<PoemFormValues>({
    resolver: zodResolver(poemFormSchema),
    defaultValues: {
      theme: "",
      style: "",
      language: "English",
    },
  });

  async function onSubmit(data: PoemFormValues) {
    setIsLoading(true);
    setPoem(null);
    try {
      const input: GeneratePoemInput = { theme: data.theme, style: data.style, language: data.language };
      const result: GeneratePoemOutput = await generatePoem(input);
      setPoem(result.poem);
    } catch (error) {
      console.error("Error generating poem:", error);
      toast({
        variant: "destructive",
        title: "Error Generating Poem",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 sm:py-12 lg:py-16">
      <header className="text-center mb-10 sm:mb-12">
        <h1 className="font-headline text-5xl sm:text-6xl md:text-7xl font-bold text-primary drop-shadow-sm">
          Whispering Poet
        </h1>
        <p className="mt-3 text-lg sm:text-xl text-muted-foreground">
          Craft beautiful poems with AI. Enter a theme, choose a style, and let your creativity bloom.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline text-3xl">Craft Your Verse</CardTitle>
            <CardDescription>Tell us about the poem you envision.</CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="theme"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Theme</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Spring morning, Lost love, Cosmic wonders" {...field} aria-label="Poem theme" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="style"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Poetic Style</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} aria-label="Poem style">
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a style" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {poemStyles.map((style) => (
                            <SelectItem key={style.value} value={style.value}>
                              {style.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Language</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} aria-label="Poem language">
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {poemLanguages.map((lang) => (
                            <SelectItem key={lang.value} value={lang.value}>
                              {lang.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading} className="w-full text-lg py-6">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Poem"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline text-3xl">Your Poetic Bloom</CardTitle>
            <CardDescription>The AI's interpretation of your muse.</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px] md:h-auto md:min-h-[calc(100%-120px)]"> {/* Adjust height as needed */}
            <ScrollArea className="h-full w-full rounded-md border p-4">
              {isLoading && (
                <div className="space-y-3">
                  <Skeleton className="h-5 w-4/5" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-3/5" />
                  <Skeleton className="h-5 w-4/5" />
                </div>
              )}
              {!isLoading && poem && (
                <pre className="whitespace-pre-wrap font-body text-base leading-relaxed">{poem}</pre>
              )}
              {!isLoading && !poem && (
                <p className="text-muted-foreground text-center pt-16">
                  Your generated poem will appear here. <br /> Let inspiration strike!
                </p>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
