/**
 * Home — Main poll page orchestrating welcome → questions → thank you
 * Design: Editorial Minimalism — full-viewport screens, smooth transitions
 * Cream background with subtle radial gold accents
 */
import { useState, useCallback, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import ProgressBar from "@/components/ProgressBar";
import WelcomeScreen from "@/components/WelcomeScreen";
import QuestionScreen from "@/components/QuestionScreen";
import ThankYouScreen from "@/components/ThankYouScreen";
import { questions } from "@/lib/pollData";

type Screen = "welcome" | "question" | "thankyou";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [direction, setDirection] = useState(1);
  const autoAdvanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalQuestions = questions.length;

  // Progress calculation
  const progress =
    screen === "welcome"
      ? 0
      : screen === "thankyou"
      ? 100
      : ((currentQuestion + 1) / (totalQuestions + 1)) * 100;

  const handleStart = useCallback(() => {
    setDirection(1);
    setScreen("question");
    setCurrentQuestion(0);
  }, []);

  const handleSelect = useCallback(
    (value: string) => {
      setAnswers((prev) => ({ ...prev, [currentQuestion]: value }));

      // Auto-advance after selection
      if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
      autoAdvanceTimer.current = setTimeout(() => {
        setDirection(1);
        if (currentQuestion < totalQuestions - 1) {
          setCurrentQuestion((prev) => prev + 1);
        } else {
          setScreen("thankyou");
        }
      }, 400);
    },
    [currentQuestion, totalQuestions]
  );

  const handleNext = useCallback(() => {
    if (!answers[currentQuestion]) return;
    if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    setDirection(1);
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setScreen("thankyou");
    }
  }, [currentQuestion, totalQuestions, answers]);

  const handleBack = useCallback(() => {
    if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    setDirection(-1);
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  }, [currentQuestion]);

  return (
    <div className="min-h-dvh bg-cream relative overflow-hidden">
      {/* Subtle background radial accents */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(circle at 20% 80%, rgba(201,169,110,0.04) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(201,169,110,0.03) 0%, transparent 50%)",
        }}
      />

      {/* Progress Bar */}
      <ProgressBar progress={progress} />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-[520px] mx-auto min-h-dvh">
        <AnimatePresence mode="wait" initial={false}>
          {screen === "welcome" && (
            <WelcomeScreen key="welcome" onStart={handleStart} />
          )}

          {screen === "question" && (
            <QuestionScreen
              key={`q-${currentQuestion}`}
              question={questions[currentQuestion]}
              questionIndex={currentQuestion}
              totalQuestions={totalQuestions}
              selectedAnswer={answers[currentQuestion] || null}
              onSelect={handleSelect}
              onNext={handleNext}
              onBack={handleBack}
              direction={direction}
            />
          )}

          {screen === "thankyou" && (
            <ThankYouScreen key="thankyou" answers={answers} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
