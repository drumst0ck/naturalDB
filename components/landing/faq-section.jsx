"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

const faqs = [
  {
    section: "General",
    qa: [
      {
        question: "¿Qué es OASIS?",
        answer: (
          <span>
            OASIS es una agencia de desarrollo web que ofrece soluciones
            personalizadas para sus proyectos web, desarrolladas con pasión y
            experiencia, con un enfoque especial en la experiencia del usuario.
          </span>
        ),
      },
      {
        question: "¿Cómo puedo solicitar un presupuesto?",
        answer: (
          <span>
            Para solicitar un presupuesto, simplemente complete nuestro
            formulario de contacto. Le responderemos lo antes posible.
          </span>
        ),
      },
    ],
  },
  {
    section: "Soporte",
    qa: [
      {
        question: "¿Cómo puedo obtener ayuda con OASIS?",
        answer: (
          <span>
            Si necesita ayuda o tiene preguntas, no dude en contactarnos.
            Nuestro equipo está aquí para ayudarle.
          </span>
        ),
      },
    ],
  },
  {
    section: "Pagos",
    qa: [
      {
        question: "¿Los presupuestos son gratuitos?",
        answer: (
          <span>
            Sí, los presupuestos son gratuitos y sin compromiso. Contáctenos
            para obtener un presupuesto personalizado para su proyecto.
          </span>
        ),
      },
      {
        question: "¿Qué formas de pago aceptan?",
        answer: <span>Aceptamos pagos con tarjeta de crédito y PayPal.</span>,
      },
      {
        question: "¿Es posible hacer pagos en cuotas?",
        answer: (
          <span>
            Sí, ofrecemos pagos en cuotas para proyectos importantes.
            Contáctenos para obtener más información.
          </span>
        ),
      },
      {
        question: "¿Los pagos son seguros?",
        answer: (
          <span>
            Sí, todos los pagos realizados en nuestro sitio son seguros gracias
            a nuestro socio Stripe.
          </span>
        ),
      },
      {
        question: "¿Puedo obtener una factura por mi pedido?",
        answer: (
          <span>
            Sí, recibirá obligatoriamente una factura por cada pedido realizado
            en nuestro sitio.
          </span>
        ),
      },
    ],
  },
];

export function FAQ() {
  return (
    <section id="faq">
      <div className="py-14">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mx-auto max-w-5xl text-center">
            <h4 className="text-xl font-bold tracking-tight text-black dark:text-white">
              FAQs
            </h4>
            <h2 className="text-4xl font-bold tracking-tight text-black dark:text-white sm:text-6xl">
              Preguntas frecuentes
            </h2>
            <p className="mt-6 text-xl leading-8 text-black/80 dark:text-white">
              Consulte nuestras FAQ para encontrar respuestas a sus preguntas
              más comunes sobre OASIS. Si no encuentra lo que busca, no dude en
              contactarnos.
            </p>
          </div>
          <div className="container mx-auto my-12 max-w-[600px] space-y-12">
            {faqs.map((faq, idx) => (
              <section key={idx} id={"faq-" + faq.section}>
                <h2 className="mb-4 text-left text-base font-semibold tracking-tight text-foreground/60">
                  {faq.section}
                </h2>
                <Accordion
                  type="single"
                  collapsible
                  className="flex w-full flex-col items-center justify-center"
                >
                  {faq.qa.map((faq, idx) => (
                    <AccordionItem
                      key={idx}
                      value={faq.question}
                      className="w-full max-w-[600px]"
                    >
                      <AccordionTrigger>{faq.question}</AccordionTrigger>
                      <AccordionContent>{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            ))}
          </div>
          <h4 className="mb-12 text-center text-sm font-medium tracking-tight text-foreground/80">
            ¿Tiene más preguntas?{" "}
            <Link
              href="#contact"
              className="underline text-primary hover:text-primary-dark transition-colors"
            >
              ¡Contáctenos!
            </Link>
          </h4>
        </div>
      </div>
    </section>
  );
}
