import React from 'react';
import { Mail, Phone, Building2, AlertCircle } from 'lucide-react';

const MM_FIELD_INVALID =
  'border-2 border-red-500 bg-red-50 ring-2 ring-red-500/25 focus:border-red-600 focus:ring-2 focus:ring-red-500/35';
const MM_FIELD_VALID =
  'border border-border hover:border-border focus:border-[#FF9500] focus:ring-2 focus:ring-[#FF9500]/30';

export default function PrepLoungePanel({
  planLoading,
  evaluationPlan,
  error,
  profile,
  setProfile,
  validationErrors = {},
  setValidationErrors,
  onStartTest,
  onRetry,
  onBackEdit,
}) {
  const qCount = Array.isArray(evaluationPlan) ? evaluationPlan.length : 0;
  const ready = !planLoading && qCount > 0 && !error;
  const isPro = profile?.userCategory === 'professional';

  const handleStartClick = () => {
    if (typeof onStartTest === 'function') onStartTest();
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] px-4 py-10 font-sans sm:px-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <p className="text-xs font-black uppercase tracking-wider text-[#B45309]">Prep lounge</p>
          <h1 className="mt-2 text-2xl font-black text-foreground sm:text-3xl">
            {planLoading ? 'Your test is being prepared' : ready ? 'Questions are ready' : 'Could not generate questions'}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {planLoading
              ? 'Please wait while we generate your personalized questions.'
              : `${qCount} question${qCount === 1 ? '' : 's'} available.`}
          </p>
          {error && <p className="mt-3 text-sm font-semibold text-red-600">{error}</p>}
        </div>

        {/* Contact required before test — must be in DOM so validation + scroll work */}
        {profile && setProfile && (
          <div className="rounded-2xl border border-[#FFD9A8]/80 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-black text-foreground">Your details</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Required before you start the test. We use this to reach you and calibrate context.
            </p>
            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold text-foreground" htmlFor="prep-lounge-email">
                  <Mail className="h-3.5 w-3.5 text-[#FF9500]" aria-hidden />
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  id="prep-lounge-email"
                  type="email"
                  autoComplete="email"
                  value={profile.email ?? ''}
                  onChange={(e) => {
                    setProfile((p) => ({ ...p, email: e.target.value }));
                    setValidationErrors?.((prev) => (prev.email ? { ...prev, email: '' } : prev));
                  }}
                  data-mm-invalid={validationErrors.email ? 'true' : undefined}
                  className={`w-full rounded-xl bg-white px-4 py-3 text-sm text-foreground outline-none transition-all placeholder:text-hint ${
                    validationErrors.email ? MM_FIELD_INVALID : MM_FIELD_VALID
                  }`}
                  placeholder="you@example.com"
                />
                {validationErrors.email && (
                  <div className="flex items-center gap-1.5 text-xs font-medium text-red-600">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    {validationErrors.email}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold text-foreground" htmlFor="prep-lounge-phone">
                  <Phone className="h-3.5 w-3.5 text-[#FF9500]" aria-hidden />
                  WhatsApp / phone <span className="text-red-400">*</span>
                </label>
                <input
                  id="prep-lounge-phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  value={profile.contactNumber ?? ''}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setProfile((p) => ({ ...p, contactNumber: digits }));
                    setValidationErrors?.((prev) => (prev.phone ? { ...prev, phone: '' } : prev));
                  }}
                  data-mm-invalid={validationErrors.phone ? 'true' : undefined}
                  className={`w-full rounded-xl bg-white px-4 py-3 text-sm text-foreground outline-none transition-all placeholder:text-hint ${
                    validationErrors.phone ? MM_FIELD_INVALID : MM_FIELD_VALID
                  }`}
                  placeholder="10-digit number"
                />
                {validationErrors.phone && (
                  <div className="flex items-center gap-1.5 text-xs font-medium text-red-600">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    {validationErrors.phone}
                  </div>
                )}
              </div>
              {!isPro && (
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-foreground" htmlFor="prep-lounge-college">
                    <Building2 className="h-3.5 w-3.5 text-[#FF9500]" aria-hidden />
                    College / university <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="prep-lounge-college"
                    type="text"
                    value={profile.collegeName ?? ''}
                    onChange={(e) => {
                      setProfile((p) => ({ ...p, collegeName: e.target.value }));
                      setValidationErrors?.((prev) => (prev.collegeName ? { ...prev, collegeName: '' } : prev));
                    }}
                    data-mm-invalid={validationErrors.collegeName ? 'true' : undefined}
                    className={`w-full rounded-xl bg-white px-4 py-3 text-sm text-foreground outline-none transition-all placeholder:text-hint ${
                      validationErrors.collegeName ? MM_FIELD_INVALID : MM_FIELD_VALID
                    }`}
                    placeholder="e.g. IIT Madras"
                  />
                  {validationErrors.collegeName && (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-red-600">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      {validationErrors.collegeName}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
          {ready ? (
            <button
              type="button"
              onClick={handleStartClick}
              className="w-full rounded-xl bg-gradient-to-r from-[#FF9500] to-[#EA580C] py-3 text-sm font-bold text-white shadow-md transition hover:brightness-105 active:scale-[0.99]"
            >
              Appear for test
            </button>
          ) : error ? (
            <button
              type="button"
              onClick={onRetry}
              className="w-full rounded-xl border border-[#FF9500] bg-[#FFF8EE] py-3 text-sm font-bold text-[#B45309]"
            >
              Try generating again
            </button>
          ) : (
            <p className="text-center text-sm text-muted-foreground">Generating questions...</p>
          )}
          <button
            type="button"
            onClick={onBackEdit}
            className="mt-3 w-full text-center text-sm font-semibold text-muted-foreground underline underline-offset-2 hover:text-foreground"
          >
            Edit my assessment answers
          </button>
        </div>

      </div>
    </div>
  );
}
