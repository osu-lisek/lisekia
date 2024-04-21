"use client";

import { ScoreResponse } from "@/utils/scoring";
import { useState } from "react";
import { Score } from "./Score";
import { FormButton } from "../ui/FormButton";
import { useFormState } from "react-dom";

export interface ScoreContentState {
    offset: number,
    limit: number,
    scores: ScoreResponse["data"],
    failed: boolean,
    has_more: boolean
}

interface ScoreContentProps {
    type: "best" | "recent";
    user: string | number;
    prerendered_scores?: ScoreResponse["data"],
    loadMoreCallback: (state: ScoreContentState, payload: FormData) => Promise<ScoreContentState>
}

export default function ScoreContent({ prerendered_scores, loadMoreCallback }: ScoreContentProps) {
    const [state, formAction] = useFormState(loadMoreCallback, { limit: 5, offset: 0, scores: prerendered_scores, failed: false, has_more: prerendered_scores?.length == 5 } as ScoreContentState);

    return (<div className="flex flex-col justify-center items-center gap-4 overflow-x-auto sm:overflow-visible">
      <div className="flex flex-col w-full sm:w-[90%] gap-2 overflow-hidden sm:overflow-visible">
        {state.scores.map((score, index) => <Score score={score} key={index} />)}
      </div>

      {state.failed || (!state.has_more && !state.scores.length) && <div className="py-16 select-none">
        {state.failed ? "Failed to load scores" : "No scores found"}  
      </div>}

      <form action={formAction}>
        {(state.has_more || state.failed) && <FormButton className="px-4 py-2">
          {state.failed ? "Refresh" : "Load more scores"}
        </FormButton>}
      </form>
    </div>)
}