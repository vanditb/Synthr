import React from 'react';

type Step = {
  id: string;
  title: string;
  optional: boolean;
};

type Props = {
  currentStep: number;
  steps: readonly Step[];
  getStepState: (index: number) => 'current' | 'skipped' | 'visited' | 'upcoming';
  onSelectStep: (index: number) => void;
};

const shortLabel = (title: string) =>
  title
    .replace('Tell us about your restaurant', 'About')
    .replace('What services do you offer?', 'Services')
    .replace('Choose the look and tone', 'Style')
    .replace('Add a few menu highlights', 'Menu')
    .replace('How should customers book or order?', 'Booking')
    .replace('How should customers contact you?', 'Contact')
    .replace('Add photos and assets', 'Photos')
    .replace('Review and generate', 'Review');

export const BuilderStepProgress: React.FC<Props> = ({ currentStep, steps, getStepState, onSelectStep }) => {
  const progress = ((currentStep + 1) / steps.length) * 100;
  const current = steps[currentStep];

  return (
    <div className="mb-8 space-y-3">
      <div className="flex items-center justify-between text-sm text-white/52">
        <span>
          Step {currentStep + 1} of {steps.length}
        </span>
        <span>{current.optional && current.id !== 'review' ? 'Optional' : 'Required'}</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex flex-wrap gap-2 pt-2">
        {steps.map((step, index) => {
          const state = getStepState(index);
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onSelectStep(index)}
              className={`rounded-full border px-3 py-1.5 text-xs transition ${
                state === 'current'
                  ? 'border-orange-300/70 bg-orange-400/12 text-white'
                  : state === 'skipped'
                    ? 'border-white/12 bg-white/[0.02] text-white/55'
                    : state === 'visited'
                      ? 'border-white/14 bg-white/[0.04] text-white/72'
                      : 'border-white/8 bg-transparent text-white/35 hover:text-white/60'
              }`}
            >
              {index + 1}. {shortLabel(step.title)}
            </button>
          );
        })}
      </div>
    </div>
  );
};
