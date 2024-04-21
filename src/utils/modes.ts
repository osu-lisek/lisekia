

export const convertModeToInt = (mode: string) => ["standard", "taiko", "fruits", "mania", "relax"].indexOf(mode) == -1 ? 0 : ["standard", "taiko", "fruits", "mania", "relax"].indexOf(mode)

export function convertToDbSuffix(mode: string): string {
    const modeSuffixMapping: Record<string, string> = {
        standard: 'Std',
        taiko: 'Taiko',
        fruits: 'Ctb',
        mania: 'Mania',
        relax: 'Rx',
    };

    return modeSuffixMapping[mode] || 'Std';
}

export enum OsuModeId {
    Standard = 0,
    Taiko = 1,
    Catch = 2,
    Mania = 3,
    Relax = 4
}