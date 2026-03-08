/**
 * ThankYouScreen — Final screen with auto-submission
 * Submits all poll responses (q0–q20 + conditional fields) via tRPC to the database
 */
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useEffect } from "react";
import { trpc } from "@/lib/trpc";

export interface ThankYouScreenProps {
  answers: Record<number, string>;
  conditionalFields?: Record<string, string>;
}

export default function ThankYouScreen({
  answers,
  conditionalFields = {},
}: ThankYouScreenProps) {
  const submitMutation = trpc.poll.submit.useMutation();

  // Auto-submit on mount
  useEffect(() => {
    submitMutation.mutate({
      email: "",
      // Original 7 questions
      q0: answers[0] || "",
      q1: answers[1] || "",
      q2: answers[2] || "",
      q3: answers[3] || "",
      q4: answers[4] || "",
      q5: answers[5] || "",
      q6: answers[6] || "",
      // Household & Life Stage
      q7: answers[7] || "",
      q8: answers[8] || "",
      q9: answers[9] || "",
      q9Ages: conditionalFields["q9Ages"] || "",
      // Age & Work Stage
      q10: answers[10] || "",
      q11: answers[11] || "",
      // Availability
      q12: answers[12] || "",
      q13: answers[13] || "",
      // Wellness
      q14: answers[14] || "",
      q15: answers[15] || "",
      // Lifestyle
      q16: answers[16] || "",
      q17: answers[17] || "",
      // Pets & Hobbies
      q18: answers[18] || "",
      q18Other: conditionalFields["q18Other"] || "",
      q19: answers[19] || "",
      // Communication
      q20: answers[20] || "",
    });
  }, []);

  return (
    <motion.div
      className="flex flex-col items-center justify-center text-center px-7 min-h-dvh"
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Gold checkmark circle */}
      <div className="w-[60px] h-[60px] rounded-full bg-gold-muted flex items-center justify-center mb-8">
        <Check className="w-6 h-6 text-gold" strokeWidth={2} />
      </div>

      <h2 className="font-serif text-[2.2rem] font-semibold text-charcoal mb-4">
        Thank You.
      </h2>

      <p className="text-base text-muted-foreground font-light leading-relaxed mb-10">
        We&rsquo;re building something exceptional.
      </p>

      {/* Confirmation message */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-[0.9rem] text-gold font-normal"
      >
        Your response has been recorded.
      </motion.p>
    </motion.div>
  );
}
