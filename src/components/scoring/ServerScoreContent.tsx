import { APIScore, OsuMode, ScoreResponse, fetchScores, fetchScoresSafe } from "@/utils/scoring";
import { Score } from "./Score";
import { FormButton } from "../ui/FormButton";
import dynamic from "next/dynamic";
import { ScoreContentState } from "./ScoreContent";

import { useServerSession } from "@/hooks/useSession";
import { Suspense } from "react";
import ComponentLoader from "../ui/ComponentLoader";

const DynamicScoreContent = dynamic(() => import("./ScoreContent"), {
  ssr: false,
  loading: () => <ComponentLoader />
})

interface ScoreContentProps {
  type: "best" | "recent";
  user: string | number;
  prerendered_scores?: APIScore[];
  mode: OsuMode
}

export async function ServerScoreContent({ type, user, mode }: ScoreContentProps) {

  const { headers } = await useServerSession();
  let prerendered_scores_response = await fetchScoresSafe(user, type, 5, 0, mode, headers);

  if (!prerendered_scores_response.ok) {
    return <DynamicScoreContent user={user} type={type} loadMoreCallback={loadMoreScores} prerendered_scores={[]} />
  }

  let prerendered_scores = prerendered_scores_response.data;

  async function loadMoreScores(state: ScoreContentState): Promise<ScoreContentState> {
    "use server";

    const { headers } = await useServerSession();
    let response = await fetchScoresSafe(user, type, state.limit, state.offset + 5, mode, headers);
    if (!response.ok) return {
      ...state,
      failed: true
    }

    return {
      limit: 10,
      offset: state.offset + 5,
      scores: [...state.scores, ...response.data],
      failed: false,
      has_more: response.data.length == state.limit
    }
  }

  return (<Suspense fallback={<ComponentLoader />}>
    <DynamicScoreContent user={user} type={type} loadMoreCallback={loadMoreScores} prerendered_scores={prerendered_scores} />
  </Suspense>)
}