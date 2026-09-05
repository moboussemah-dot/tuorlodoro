import { motion } from "framer-motion";

interface Testimonial {
  text: string;
  image: string;
  name: string;
  role: string;
}

const testimonials: Testimonial[] = [
  {
    text: "Il tuorlo è di un arancione che non vedevo da quando ero bambina in campagna. Le frittate sono tornate a sapere di qualcosa.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop",
    name: "Giulia Ferrante",
    role: "Roma, cliente da 2 anni",
  },
  {
    text: "Consegna il giovedì, uova deposte il lunedì. Ho smesso di comprarle al supermercato.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop",
    name: "Marco Bellini",
    role: "Chef, Trastevere",
  },
  {
    text: "Sapere che vengono da una sola fattoria, con galline che vedo nelle foto ogni settimana, cambia tutto.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop",
    name: "Sara Conti",
    role: "Mamma di tre",
  },
  {
    text: "Per la pasticceria uso solo queste. Montano meglio e il colore della crema è naturale, senza aggiunte.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop",
    name: "Luca Moretti",
    role: "Pasticcere",
  },
  {
    text: "L'abbonamento è comodissimo: arrivano ogni settimana e posso saltare quando sono in vacanza.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop",
    name: "Elena Ricci",
    role: "Abbonata",
  },
  {
    text: "Guscio spesso, albume compatto, tuorlo alto. Si vede che le galline stanno bene.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&fit=crop",
    name: "Andrea Galli",
    role: "Nutrizionista",
  },
  {
    text: "Ho visitato la fattoria con i bambini. Le galline all'aperto, l'uliveto: adesso capiscono da dove viene la colazione.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop",
    name: "Francesca Neri",
    role: "Insegnante",
  },
  {
    text: "Imballaggio compostabile, niente plastica. E le uova arrivano sempre intere.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop",
    name: "Davide Serra",
    role: "Cliente",
  },
  {
    text: "Il cesto misto è il regalo perfetto: uova, miele e un po' di storia della fattoria dentro.",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120&h=120&fit=crop",
    name: "Chiara Vitale",
    role: "Cliente",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const TestimonialsColumn = (props: {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{ translateY: "-50%" }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[...new Array(2).fill(0)].map((_, index) => (
          <div key={index} className="flex flex-col gap-6">
            {props.testimonials.map(({ text, image, name, role }, i) => (
              <div
                key={i}
                className="glass-panel w-full max-w-xs rounded-3xl p-8 shadow-yolk"
              >
                <p className="text-sm leading-relaxed text-foreground/85">{text}</p>
                <div className="mt-5 flex items-center gap-3">
                  <img
                    width={40}
                    height={40}
                    src={image}
                    alt={name}
                    loading="lazy"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold leading-5 tracking-tight">{name}</span>
                    <span className="text-xs leading-5 text-muted-foreground">{role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export const TestimonialsSection = () => {
  return (
    <section id="recensioni" className="relative py-24">
      <div className="container z-10 mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mx-auto flex max-w-[540px] flex-col items-center justify-center"
        >
          <span className="rounded-full border border-yolk/40 bg-yolk/10 px-4 py-1 text-xs font-medium uppercase tracking-widest text-yolk">
            Recensioni
          </span>
          <h2 className="mt-5 text-center text-4xl font-medium tracking-tight sm:text-5xl">
            Chi le ha assaggiate
          </h2>
          <p className="mt-4 text-center text-muted-foreground">
            Centinaia di famiglie e cucine ricevono le nostre uova ogni settimana.
          </p>
        </motion.div>

        <div className="mt-12 flex max-h-[740px] justify-center gap-6 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
