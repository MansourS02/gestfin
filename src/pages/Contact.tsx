import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Layout from "@/components/Layout";
import SectionTitle from "@/components/SectionTitle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const schema = z.object({
  nom: z.string().trim().min(2, "Nom requis").max(100),
  email: z.string().trim().email("Email invalide").max(255),
  sujet: z.string().trim().min(2, "Sujet requis").max(200),
  message: z.string().trim().min(10, "Message trop court").max(1000),
});

type FormData = z.infer<typeof schema>;

const contactInfo = [
  { icon: MapPin, title: "Adresse", value: "Yoff Diamalaye 2 n° 02, Dakar, Sénégal" },
  { icon: Phone, title: "Téléphone", value: "+221 77 504 15 65", href: "tel:+221775041565" },
  { icon: Mail, title: "Email", value: "gestasow@gmail.com", href: "mailto:gestasow@gmail.com" },
  { icon: Clock, title: "Horaires", value: "Lun - Ven : 8h00 - 18h00" },
];

const Contact = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { nom: "", email: "", sujet: "", message: "" },
  });

  const onSubmit = async (data: FormData) => {
    const { error } = await supabase.from("contact_messages").insert({
      nom: data.nom, email: data.email, sujet: data.sujet, message: data.message,
    });
    if (error) {
      toast.error("Erreur : " + error.message);
      return;
    }
    toast.success("Message envoyé avec succès !");
    form.reset();
  };

  return (
    <Layout>
      <section className="gradient-navy py-20">
        <div className="container mx-auto px-4">
          <SectionTitle
            light
            subtitle="Contactez-nous"
            title="Restons en contact"
            description="Une question ? Un projet ? N'hésitez pas à nous écrire."
          />
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-5 gap-12 max-w-5xl mx-auto">
            {/* Info */}
            <div className="lg:col-span-2 space-y-6">
              {contactInfo.map((c, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                    <c.icon className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground text-sm">{c.title}</div>
                    {c.href ? (
                      <a href={c.href} className="text-muted-foreground hover:text-secondary transition-colors">{c.value}</a>
                    ) : (
                      <div className="text-muted-foreground">{c.value}</div>
                    )}
                  </div>
                </div>
              ))}

              {/* Map placeholder */}
              <div className="mt-8 rounded-xl overflow-hidden border border-border h-48">
                <iframe
                  title="Cabinet GEST Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3858.5!2d-17.47!3d14.77!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTTCsDQ2JzEyLjAiTiAxN8KwMjgnMTIuMCJX!5e0!3m2!1sfr!2ssn!4v1"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3 bg-card rounded-xl p-8 border border-border">
              <h2 className="font-display text-xl font-semibold mb-6">Envoyez-nous un message</h2>
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
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl><Input type="email" placeholder="votre@email.com" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="sujet" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sujet *</FormLabel>
                      <FormControl><Input placeholder="Objet de votre message" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="message" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message *</FormLabel>
                      <FormControl><Textarea placeholder="Décrivez votre demande..." rows={5} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" size="lg" className="w-full font-semibold bg-secondary text-secondary-foreground hover:bg-teal-light">
                    Envoyer le message
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
