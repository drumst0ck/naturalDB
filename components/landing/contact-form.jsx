"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { BorderBeam } from "../magicui/border-beam";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
  firstName: z
    .string()
    .min(3, { message: "Su nombre debe contener al menos 3 caracteres." }),
  lastName: z
    .string()
    .min(3, { message: "Su apellido debe contener al menos 3 caracteres." }),
  email: z.string().email({
    message:
      "Por favor, introduzca una dirección de correo electrónico válida.",
  }),
  message: z.string().min(10, {
    message: "Su mensaje debe contener al menos 10 caracteres.",
  }),
  files: z.array(z.instanceof(File)).optional(),
});

export default function ContactForm() {
  const ref = useRef(null);
  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      message: "",
    },
  });

  async function onSubmit(data) {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        form.reset();
        toast.success("¡Su mensaje ha sido enviado!");
      } else {
        toast.error("Se ha producido un error. Por favor, inténtelo de nuevo.");
      }
    } catch (error) {
      toast.error("Se ha producido un error. Por favor, inténtelo de nuevo.");
    }
  }

  return (
    <section id="contact">
      <div className="py-14 px-4">
        <div className="mx-auto max-w-5xl text-center">
          <h4 className="text-xl font-bold tracking-tight text-black dark:text-white">
            Contacto
          </h4>
          <h2 className="text-4xl font-bold tracking-tight text-black dark:text-white sm:text-6xl">
            Contáctenos
          </h2>
          <p className="mt-6 text-xl leading-8 text-black/80 dark:text-white">
            ¿Tiene alguna pregunta o solicitud específica? No dude en
            contactarnos rellenando el siguiente formulario.
          </p>
        </div>
        <div className="relative flex w-full flex-col items-center justify-center mx-auto max-w-xl my-12 bg-secondary/20 p-8 rounded-md">
          <BorderBeam className="z-[-100] " />
          <Form {...form}>
            <form
              ref={ref}
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-6"
            >
              <div className="flex space-x-4">
                <div className="w-1/2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="w-1/2">
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Apellido</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mensaje</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Su mensaje ..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-end">
                <Button type="submit">Enviar</Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}
