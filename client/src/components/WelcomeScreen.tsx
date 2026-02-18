/**
 * WelcomeScreen — Opening screen with headline, subheadline, and Begin CTA
 * Design: Centered, generous whitespace, gold accent divider, pill button
 */
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface WelcomeScreenProps {
  onStart: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center text-center px-7 min-h-dvh"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.5 }}
    >
      {/* Gold accent line */}
      <div className="w-12 h-[2px] bg-gold rounded-full mb-10" />

      <h1 className="font-serif text-[2rem] sm:text-[2.4rem] font-semibold leading-[1.2] text-charcoal tracking-[-0.02em] mb-5">
        Help Us Design Something Extraordinary
      </h1>

      <p className="text-base text-muted-foreground font-light leading-relaxed max-w-[340px] mb-12">
        Your input shapes the future of our community experiences.
      </p>

      <motion.button
        onClick={onStart}
        className="inline-flex items-center gap-2.5 bg-charcoal text-cream px-10 py-4 rounded-full text-[0.9rem] font-medium tracking-[0.08em] uppercase transition-all duration-300 hover:bg-charcoal-deep hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
        whileTap={{ scale: 0.97 }}
      >
        Begin
        <ArrowRight className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
}
