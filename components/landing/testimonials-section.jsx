import Marquee from "@/components/magicui/marquee";
import { cn } from "@/lib/utils";
import { StarFilledIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { SphereMask } from "../magicui/sphere-mask";
import { CircleLight } from "../magicui/circle-light";

export const Highlight = ({ children, className }) => {
  return (
    <span
      className={cn(
        "bg-cyan-600/20 p-1 py-0.5 font-bold text-cyan-600 dark:bg-cyan-600/20 dark:text-cyan-600",
        className
      )}
    >
      {children}
    </span>
  );
};

export const TestimonialCard = ({
  description,
  name,
  img,
  role,
  className,
  ...props
}) => (
  <div
    className={cn(
      "mb-4 flex w-full cursor-pointer break-inside-avoid flex-col items-center justify-between gap-6 rounded-xl p-4",
      " border border-neutral-200 bg-white",
      "dark:bg-black dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
      className
    )}
    {...props}
  >
    <div className="select-none text-sm font-normal text-neutral-700 dark:text-neutral-400">
      {description}
      <div className="flex flex-row py-1">
        <StarFilledIcon className="size-4 text-yellow-500" />
        <StarFilledIcon className="size-4 text-yellow-500" />
        <StarFilledIcon className="size-4 text-yellow-500" />
        <StarFilledIcon className="size-4 text-yellow-500" />
        <StarFilledIcon className="size-4 text-yellow-500" />
      </div>
    </div>

    <div className="flex w-full select-none items-center justify-start gap-5">
      <Image
        src={img}
        className="h-10 w-10 rounded-full  ring-1 ring-border ring-offset-4"
        width={40}
        height={40}
        alt="Testimonial"
      />

      <div>
        <p className="font-medium text-neutral-500">{name}</p>
        <p className="text-xs font-normal text-neutral-400">{role}</p>
      </div>
    </div>
  </div>
);

const testimonials = [
  {
    name: "Alex Rivera",
    role: "CTO en InnovateTech",
    img: "https://randomuser.me/api/portraits/men/91.jpg",
    description: (
      <p>
        Los análisis basados en IA de #QuantumInsights han revolucionado nuestro
        ciclo de desarrollo de productos.
        <Highlight>
          Los insights son ahora más precisos y rápidos que nunca.
        </Highlight>{" "}
        Un cambio de juego para las empresas tecnológicas.
      </p>
    ),
  },
  {
    name: "Samantha Lee",
    role: "Directora de Marketing en NextGen Solutions",
    img: "https://randomuser.me/api/portraits/women/12.jpg",
    description: (
      <p>
        La implementación del modelo de predicción de clientes de #AIStream ha
        mejorado drásticamente nuestra estrategia de segmentación.
        <Highlight>
          ¡Vemos un aumento del 50% en las tasas de conversión!
        </Highlight>{" "}
        Recomiendo encarecidamente sus soluciones.
      </p>
    ),
  },
];

export function SocialProofTestimonials() {
  return (
    <section id="testimonials">
      <div className="py-14">
        <div className="container mx-auto px-4 md:px-8">
          <h3 className="text-center uppercase text-xl font-semibold text-foreground">
            Testimonios
          </h3>
          <h2 className="text-center text-4xl font-bold text-neutral-900 dark:text-neutral-100 mt-2">
            Lo que dicen nuestros clientes satisfechos 🌟
          </h2>
          <div className="relative mt-6 max-h-[650px] overflow-hidden">
            <div className="gap-4 md:columns-2 xl:columns-3 2xl:columns-4">
              {Array(Math.ceil(testimonials.length / 3))
                .fill(0)
                .map((_, i) => (
                  <Marquee
                    vertical
                    key={i}
                    className={cn({
                      "[--duration:60s]": i === 1,
                      "[--duration:30s]": i === 2,
                      "[--duration:70s]": i === 3,
                    })}
                  >
                    {testimonials.slice(i * 3, (i + 1) * 3).map((card, idx) => (
                      <TestimonialCard {...card} key={idx} />
                    ))}
                  </Marquee>
                ))}
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 w-full bg-gradient-to-t from-white from-20% dark:from-black"></div>
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 w-full bg-gradient-to-b from-white from-20% dark:from-black"></div>
          </div>
        </div>
      </div>
      <CircleLight />
    </section>
  );
}
