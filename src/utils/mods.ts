import React from "react";

export enum OsuMods {
    None = 0,
    NoFail = 1 << 0,
    Easy = 1 << 1,
    TouchDevice = 1 << 2,
    Hidden = 1 << 3,
    HardRock = 1 << 4,
    SuddenDeath = 1 << 5,
    DoubleTime = 1 << 6,
    Relax = 1 << 7,
    HalfTime = 1 << 8,
    Nightcore = 1 << 9, // DoubleTime with pitch increase
    Flashlight = 1 << 10,
    Autoplay = 1 << 11,
    SpunOut = 1 << 12,
    Relax2 = 1 << 13, // Autopilot
    Perfect = 1 << 14, // Only settable by osu!support
    Key4 = 1 << 15, // Key mods
    Key5 = 1 << 16,
    Key6 = 1 << 17,
    Key7 = 1 << 18,
    Key8 = 1 << 19,
    KeyModMask = Key4 | Key5 | Key6 | Key7 | Key8,
    FadeIn = 1 << 20,
    Random = 1 << 21,
    LastMod = 1 << 22,
    Target = 1 << 23, // Only settable by osu!support
    Key9 = 1 << 24,
    KeyCoop = 1 << 25,
    Key1 = 1 << 26,
    Key3 = 1 << 27,
    Key2 = 1 << 28,
    ScoreV2 = 1 << 29,
    Mirror = 1 << 30
}

const modShortnames: { [key: string]: OsuMods } = {
    NF: OsuMods.NoFail,
    EZ: OsuMods.Easy,
    TD: OsuMods.TouchDevice,
    HD: OsuMods.Hidden,
    HR: OsuMods.HardRock,
    SD: OsuMods.SuddenDeath,
    DT: OsuMods.DoubleTime,
    RX: OsuMods.Relax,
    HT: OsuMods.HalfTime,
    NC: OsuMods.Nightcore,
    FL: OsuMods.Flashlight,
    AT: OsuMods.Autoplay,
    SO: OsuMods.SpunOut,
    AP: OsuMods.Relax2,
    PF: OsuMods.Perfect,
    FD: OsuMods.FadeIn,
    RD: OsuMods.Random,
    "K1": OsuMods.Key1,
    "K2": OsuMods.Key2,
    "K3": OsuMods.Key3,
    "K4": OsuMods.Key4,
    "K5": OsuMods.Key5,
    "K6": OsuMods.Key6,
    "K7": OsuMods.Key7,
    "K8": OsuMods.Key8,
    "K9": OsuMods.Key9,
    "K10": OsuMods.KeyCoop,
    "MR": OsuMods.Mirror
};

export const modFullNames: { [key: string]: string } = {
    NF: "no-fail",
    EZ: "easy",
    TD: "touchdevice",
    HD: "hidden",
    HR: "hard-rock",
    SD: "sudden-death",
    DT: "double-time",
    RX: "relax",
    HT: "half",
    NC: "nightcore",
    FL: "flashlight",
    AT: "auto",
    SO: "spun-out",
    AP: "autopilot",
    PF: "perfect",
    FD: "fade-in",
    RD: "random",
    "K1": "1K",
    "K2": "2K",
    "K3": "3K",
    "K4": "4K",
    "K5": "5K",
    "K6": "6K",
    "K7": "7K",
    "K8": "8K",
    "K9": "9K",
    "K10": "coop",
    "MR": "mirror"
};

export function convertModsToStringList(mods: number): string[] {
    if (mods === 0) return [];
    const parsedMods: string[] = [];

    for (let i = 0; i <= 30; i++) {
        const modValue = 1 << i;
        if (mods & modValue) {
            let shortName = Object.entries(modShortnames).find(([_, value]) => value === modValue)?.[0];
            if (!shortName) continue;
            parsedMods.push(shortName);
        }
    }

    return clearDuplicatedMods(parsedMods);
}

export function clearDuplicatedMods(mods: string[]) {
    if (mods.includes("NC")) mods.splice(mods.indexOf("DT"), 1);
    if (mods.includes("PF")) mods.splice(mods.indexOf("SD"), 1);

    return mods;
}

export function convertStringToMods(modsString: string): number {
    let mods = 0;
    let splittedBy2Symbols = modsString.match(/.{1,2}/g);

    if (!splittedBy2Symbols) return 0;

    for (const mod of splittedBy2Symbols) {
        const modValue = modShortnames[mod];
        if (modValue !== undefined) {
            mods |= modValue;
        }
    }

    return mods;
}

