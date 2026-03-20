import React from 'react';
import { ArrowLeft, ArrowRight, Loader2, Sparkles } from 'lucide-react';

type Props = {
  currentStep: number;
  currentStepId: string;
  isSubmitting: boolean;
  onBack: () => void;
  onSkip: () => void;
  onNext: () => void;
};

export const BuilderStepActions: React.FC<Props> = ({
  currentStep,
  currentStepId,
  isSubmitting,
  onBack,
  onSkip,
  onNext,
}) => (
  <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <button
      type="button"
      onClick={onBack}
      className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-medium text-white/72 transition hover:bg-white/[0.05] hover:text-white"
    >
      <ArrowLeft size={16} />
      {currentStep === 0 ? 'Back home' : 'Back'}
    </button>

    <div className="flex flex-col gap-3 sm:flex-row">
      {currentStepId !== 'review' ? (
        <button
          type="button"
          onClick={onSkip}
          className="rounded-full border border-white/10 px-5 py-3 text-sm font-medium text-white/72 transition hover:bg-white/[0.05] hover:text-white"
        >
          Skip for now
        </button>
      ) : null}

      {currentStepId === 'review' ? (
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 px-6 py-3 text-sm font-semibold text-black transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Generating website
            </>
          ) : (
            <>
              <Sparkles size={16} />
              Generate Website
            </>
          )}
        </button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 px-6 py-3 text-sm font-semibold text-black transition hover:brightness-105"
        >
          Next
          <ArrowRight size={16} />
        </button>
      )}
    </div>
  </div>
);
