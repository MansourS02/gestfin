import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Layout from "@/components/Layout";
import SectionTitle from "@/components/SectionTitle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CalendarDays, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const schema = z.object({
  nom: z.string().trim().min(2, "Nom requis").max(100),
  entreprise: z.string().trim().max(100).optional(),
  telephone: z.string().trim().min(8, "Téléphone requis").max(20),
  email: z.string().trim().email("Email invalide").max(255),
  service: z.string().min(1, "Veuillez choisir un service"),
  date: z.string().min(1, "Veuillez choisir une date"),
  message: z.string().trim().max(1000).optional(),
});

type FormData = z.infer<typeof schema>;

const serviceOptions = [
  "Étude marketing",
  "Étude économique et financière",
  "Business plan",
  "Gestion et développement d'affaires",
  "Gestion de patrimoine",
  "Audit et contrôle de gestion",
  "Audit marketing",
  "Plan stratégique",
  "Formation marketing digital",
  "Formation management",
  "Autre",
];

const Appointment = () => {
  const [submitted, setSubmitted] = useState(false);
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { nom: "", entreprise: "", telephone: "", email: "", service: "", date: "", message: "" },
  });

  const onSubmit = async (data: FormData) => {
    const { error } = await supabase.from("appointments").insert({
      nom: data.nom,
      entreprise: data.entreprise || null,
      telephone: data.telephone,
      email: data.email,
      service: data.service,
      date_souhaitee: data.date,
      message: data.message || null,
    });
    if (error) {
      toast.error("Erreur lors de l'envoi : " + error.message);
      return;
    }
    setSubmitted(true);
    toast.success("Votre demande a été envoyée avec succès !");
  };

  if (submitted) {
    return (
      <Layout>
        <section className="py-32 bg-background">
          <div className="container mx-auto px-4 text-center max-w-lg">
            <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-secondary" />
            </div>
            <h1 className="font-display text-3xl font-bold mb-4">Demande envoyée !</h1>
            <p className="text-muted-foreground leading-relaxed">
              Merci pour votre demande de rendez-vous. Nous vous contacterons dans les plus brefs délais pour confirmer votre créneau.
            </p>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="gradient-navy py-20">
        <div className="container mx-auto px-4">
          <SectionTitle
            light
            subtitle="Rendez-vous"
            title="Prenez rendez-vous avec nous"
            description="Remplissez le formulaire ci-dessous et nous vous recontacterons rapidement."
          />
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-card rounded-xl p-8 border border-border">
            <div className="flex items-center gap-3 mb-8">
              <CalendarDays className="w-6 h-6 text-secondary" />
              <h2 className="font-display text-xl font-semibold">Formulaire de demande</h2>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <FormField control={form.control} name="nom" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom complet *</FormLabel>
                      <FormControl><Input placeholder="Votre nom" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="entreprise" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Entreprise</FormLabel>
                      <FormControl><Input placeholder="Nom de l'entreprise" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <FormField control={form.control} name="telephone" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone *</FormLabel>
                      <FormControl><Input placeholder="+221 7X XXX XX XX" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl><Input type="email" placeholder="votre@email.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <FormField control={form.control} name="service" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service souhaité *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Choisir un service" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {serviceOptions.map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="date" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date souhaitée *</FormLabel>
                      <FormControl><Input type="date" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="message" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message (optionnel)</FormLabel>
                    <FormControl><Textarea placeholder="Décrivez brièvement votre besoin..." rows={4} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <Button type="submit" size="lg" className="w-full font-semibold bg-secondary text-secondary-foreground hover:bg-teal-light">
                  Envoyer ma demande
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Appointment;
