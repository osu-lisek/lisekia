import GradeA from "@/assets/images/grades/grade-a.svg"
import GradeB from "@/assets/images/grades/grade-b.svg"
import GradeC from "@/assets/images/grades/grade-c.svg"
import GradeD from "@/assets/images/grades/grade-d.svg"
import GradeF from "@/assets/images/grades/grade-f.svg"
import GradeNigger from "@/assets/images/grades/grade-nigger.svg"
import GradeSilverS from "@/assets/images/grades/grade-silver-s.svg"
import GradeSilverX from "@/assets/images/grades/grade-silver-ss.svg"
import GradeS from "@/assets/images/grades/grade-s.svg"
import GradeX from "@/assets/images/grades/grade-ss.svg"
import Image from "next/image"

export type APIScoreRank = "X" | "XH" | "SH" | "S" | "A" | "B" | "C" | "D" | "F" | "NIGGER";
interface ScoreRankProps {
    rank: APIScoreRank;
    size?: number;
}

export function ScoreRank({ rank, size = 48 }: ScoreRankProps) {
    let ranks = {
        A: GradeA,
        B: GradeB,
        C: GradeC,
        D: GradeD,
        F: GradeF,
        S: GradeS,
        SH: GradeSilverS,
        X: GradeX,
        XH: GradeSilverX,
        NIGGER: GradeNigger
    } as { [key in ScoreRankProps["rank"]]: React.ReactNode }

    return <Image src={ranks[rank]??GradeNigger} alt="rank" height={size} width={size} quality={100}/>;
}