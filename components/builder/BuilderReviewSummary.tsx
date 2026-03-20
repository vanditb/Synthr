import React from 'react';
import { BusinessDetails } from '../../types';

type Props = {
  formData: BusinessDetails;
  validMenuItemsCount: number;
  reviewWarnings: string[];
  showMoreDetails: boolean;
  setShowMoreDetails: React.Dispatch<React.SetStateAction<boolean>>;
  updateBrand: <K extends keyof BusinessDetails['brand']>(key: K, value: BusinessDetails['brand'][K]) => void;
  updateAdvanced: (key: keyof NonNullable<BusinessDetails['advanced']>, value: any) => void;
  parseCommaList: (value: string) => string[];
  inputClassName: string;
};

export const BuilderReviewSummary: React.FC<Props> = ({
  formData,
  validMenuItemsCount,
  reviewWarnings,
  showMoreDetails,
  setShowMoreDetails,
  updateBrand,
  updateAdvanced,
  parseCommaList,
  inputClassName,
}) => {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <div className="space-y-3 text-sm text-white/72">
          <div className="flex justify-between gap-4 border-b border-white/8 pb-3">
            <span className="text-white/45">Restaurant</span>
            <span>{formData.name || 'Not added'}</span>
          </div>
          <div className="flex justify-between gap-4 border-b border-white/8 pb-3">
            <span className="text-white/45">Cuisine</span>
            <span>{formData.cuisineType || 'Not added'}</span>
          </div>
          <div className="flex justify-between gap-4 border-b border-white/8 pb-3">
            <span className="text-white/45">Menu items</span>
            <span>{validMenuItemsCount}</span>
          </div>
          <div className="flex justify-between gap-4 border-b border-white/8 pb-3">
            <span className="text-white/45">Main CTA</span>
            <span>{formData.primaryCta}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-white/45">Images</span>
            <span>{formData.images.length || 0}</span>
          </div>
        </div>
      </div>

      {reviewWarnings.length ? (
        <div className="space-y-3">
          {reviewWarnings.map((warning) => (
            <div key={warning} className="rounded-2xl border border-orange-400/20 bg-orange-400/10 px-4 py-3 text-sm text-orange-100/88">
              {warning}
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100/90">
          Looks good. You have enough detail for a strong first draft.
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <button
          type="button"
          onClick={() => setShowMoreDetails((prev) => !prev)}
          className="text-sm font-medium text-white/78 transition hover:text-white"
        >
          {showMoreDetails ? 'Hide extra details' : 'Add more details'}
        </button>

        {showMoreDetails ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <input
              value={formData.brand.story || ''}
              onChange={(event) => updateBrand('story', event.target.value)}
              className={`${inputClassName} sm:col-span-2`}
              placeholder="Optional story"
            />
            <input
              value={formData.advanced?.founderName || ''}
              onChange={(event) => updateAdvanced('founderName', event.target.value)}
              className={inputClassName}
              placeholder="Founder or chef name"
            />
            <input
              type="number"
              value={formData.advanced?.yearFounded ?? ''}
              onChange={(event) => updateAdvanced('yearFounded', event.target.value ? Number(event.target.value) : undefined)}
              className={inputClassName}
              placeholder="Year founded"
            />
            <input
              value={formData.advanced?.neighborhood || ''}
              onChange={(event) => updateAdvanced('neighborhood', event.target.value)}
              className={inputClassName}
              placeholder="Neighborhood"
            />
            <input
              value={formData.advanced?.parking || ''}
              onChange={(event) => updateAdvanced('parking', event.target.value)}
              className={inputClassName}
              placeholder="Parking"
            />
            <textarea
              value={formData.advanced?.weeklySpecials || ''}
              onChange={(event) => updateAdvanced('weeklySpecials', event.target.value)}
              className={`${inputClassName} min-h-[96px] resize-none sm:col-span-2`}
              placeholder="Weekly specials or events"
            />
            <input
              value={formData.advanced?.cateringEmail || ''}
              onChange={(event) => updateAdvanced('cateringEmail', event.target.value)}
              className={inputClassName}
              placeholder="Catering email"
            />
            <input
              type="number"
              value={formData.advanced?.privateEventCapacity ?? ''}
              onChange={(event) =>
                updateAdvanced('privateEventCapacity', event.target.value ? Number(event.target.value) : undefined)
              }
              className={inputClassName}
              placeholder="Private event capacity"
            />
            <textarea
              value={(formData.advanced?.awards || []).join(', ')}
              onChange={(event) => updateAdvanced('awards', parseCommaList(event.target.value))}
              className={`${inputClassName} min-h-[96px] resize-none sm:col-span-2`}
              placeholder="Awards or press"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};
