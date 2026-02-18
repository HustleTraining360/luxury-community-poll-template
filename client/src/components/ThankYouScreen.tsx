/**
 * ThankYouScreen — Final screen with email capture and CSV download
 * Design: Centered, gold checkmark icon, serif headline, pill submit button
 */
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useState } from "react";
import { questionLabels } from "@/lib/pollData";

interface ThankYouScreenProps {
  answers: Record<number, string>;
}

export default function ThankYouScreen({ answers }: ThankYouScreenProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    const response: Record<string, string> = {
      timestamp: new Date().toISOString(),
      email: email || "",
    };
    questionLabels.forEach((_, i) => {
      response[i.toString()] = answers[i] || "";
    });

    // Store in localStorage
    const stored = JSON.parse(localStorage.getItem("luxuryPollResponses") || "[]");
    stored.push(response);
    localStorage.setItem("luxuryPollResponses", JSON.stringify(stored));

    setSubmitted(true);
  };

  const downloadCSV = () => {
    const stored = JSON.parse(localStorage.getItem("luxuryPollResponses") || "[]");
    if (stored.length === 0) return;

    const headers = ["Timestamp", "Email", ...questionLabels];
    const rows = stored.map((r: Record<string, string>) => {
      return [
        r.timestamp,
        r.email,
        ...questionLabels.map((_, i) => r[i.toString()] || ""),
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",");
    });

    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "community-poll-responses.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

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

      {/* Email section */}
      <div className="w-full max-w-[340px]">
        <label className="block text-[0.75rem] font-medium tracking-[0.1em] uppercase text-muted-foreground/70 mb-3">
          Enter your email for VIP access (optional)
        </label>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          disabled={submitted}
          className="w-full px-5 py-4 border border-border rounded-xl font-sans text-base text-charcoal bg-white outline-none transition-all duration-300 placeholder:text-muted-foreground/40 placeholder:font-light focus:border-gold focus:ring-[3px] focus:ring-gold-muted disabled:opacity-60 mb-5"
        />

        <motion.button
          onClick={handleSubmit}
          disabled={submitted}
          className={`
            w-full py-4 px-8 rounded-full text-[0.85rem] font-medium tracking-[0.08em] uppercase transition-all duration-300
            ${submitted
              ? "bg-gold text-white cursor-default"
              : "bg-charcoal text-cream hover:bg-charcoal-deep hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
            }
          `}
          whileTap={submitted ? {} : { scale: 0.97 }}
        >
          {submitted ? "Submitted" : "Submit & Stay Connected"}
        </motion.button>

        {/* Confirmation */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: submitted ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className="mt-5 text-[0.9rem] text-gold font-normal"
        >
          Your response has been recorded.
        </motion.p>

        {/* CSV Download */}
        {submitted && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            onClick={downloadCSV}
            className="mt-4 text-[0.75rem] text-muted-foreground/60 underline hover:text-gold transition-colors bg-transparent border-none font-sans"
          >
            Download Responses (CSV)
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
