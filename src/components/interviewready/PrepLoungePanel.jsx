import React from 'react';

export default function PrepLoungePanel({
  planLoading,
  evaluationPlan,
  error,
  onStartTest,
  onRetry,
  onBackEdit,
}) {
  const qCount = Array.isArray(evaluationPlan) ? evaluationPlan.length : 0;
  const ready = !planLoading && qCount > 0 && !error;

  return (
    <div className="min-h-screen bg-[#FFFDF8] px-4 py-10 font-sans sm:px-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <p className="text-xs font-black uppercase tracking-wider text-[#B45309]">Prep lounge</p>
          <h1 className="mt-2 text-2xl font-black text-foreground sm:text-3xl">
            {planLoading ? 'Your test is being prepared' : ready ? 'Questions are ready' : 'Could not generate questions'}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {planLoading ? 'Please wait while we generate your personalized questions.' : `${qCount} questions available.`}
          </p>
          {error && <p className="mt-3 text-sm font-semibold text-red-600">{error}</p>}
        </div>

        <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
          {ready ? (
            <button
              type="button"
              onClick={onStartTest}
              className="w-full rounded-xl bg-gradient-to-r from-[#FF9500] to-[#EA580C] py-3 text-sm font-bold text-white"
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
            className="mt-3 w-full text-center text-sm font-semibold text-muted-foreground underline underline-offset-2"
          >
            Edit my assessment answers
          </button>
        </div>
      </div>
    </div>
  );
}
