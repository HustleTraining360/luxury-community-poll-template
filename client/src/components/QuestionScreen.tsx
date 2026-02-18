/**
 * QuestionScreen — Single question with image-backed option cards
 * Design: Question number in gold, serif headline, 2-col grid, nav buttons
 */
import { motion } from "framer-motion";
import OptionCard from "./OptionCard";
import type { PollQuestion } from "@/lib/pollData";

interface QuestionScreenProps {
  question: PollQuestion;
  questionIndex: number;
  totalQuestions: number;
  selectedAnswer: string | null;
  onSelect: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
  direction: number;
}

export default function QuestionScreen({
  question,
  questionIndex,
  totalQuestions,
  selectedAnswer,
  onSelect,
  onNext,
  onBack,
  direction,
}: QuestionScreenProps) {
  return (
    <motion.div
      key={questionIndex}
      className="flex flex-col px-5 sm:px-7 pt-6 sm:pt-8 pb-8 min-h-dvh overflow-y-auto overflow-x-hidden"
      initial={{ opacity: 0, x: direction > 0 ? 60 : -60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: direction > 0 ? -60 : 60 }}
      transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Question number */}
      <p className="text-[0.7rem] font-medium tracking-[0.15em] uppercase text-gold mt-5 mb-3">
        Question {questionIndex + 1} of {totalQuestions}
      </p>

      {/* Headline */}
      <h2 className="font-serif text-[1.6rem] sm:text-[1.8rem] font-semibold text-charcoal leading-[1.25] tracking-[-0.01em] mb-6">
        {question.headline}
      </h2>

      {/* Options Grid */}
      <div className="grid grid-cols-2 gap-3 flex-1">
        {question.options.map((option) => (
          <OptionCard
            key={option.label}
            option={option}
            isSelected={selectedAnswer === option.label}
            onSelect={() => onSelect(option.label)}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-5 pb-3 shrink-0">
        {questionIndex > 0 ? (
          <button
            onClick={onBack}
            className="bg-transparent text-muted-foreground px-6 py-3 rounded-full text-[0.85rem] font-medium tracking-wide transition-colors hover:text-charcoal"
          >
            Back
          </button>
        ) : (
          <div />
        )}
        <button
          onClick={onNext}
          disabled={!selectedAnswer}
          className="bg-charcoal text-cream px-8 py-3.5 rounded-full text-[0.8rem] font-medium tracking-[0.06em] uppercase transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed enabled:hover:bg-charcoal-deep enabled:hover:-translate-y-0.5 enabled:hover:shadow-md enabled:active:translate-y-0"
        >
          Continue
        </button>
      </div>
    </motion.div>
  );
}
