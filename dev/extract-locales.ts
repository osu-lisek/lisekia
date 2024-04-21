import { readFileSync, readdirSync, statSync } from "fs";

const tree = (path: string) => {
    let outfiles: string[] = [];
    for (const file of readdirSync(path)) {
        if (statSync(`${path}/${file}`).isDirectory()) {
            outfiles = [...outfiles, ...tree(`${path}/${file}`)];
        }

        if (file.endsWith(".ts") || file.endsWith(".tsx")) {
            outfiles.push(`${path}/${file}`);
        }
    }

    return outfiles;
}

let regex = /\<Translatable\>(.*?)\<\/Translatable>/gm;
let out: { key: { file: string, line: number, column: number }, locale_key: string, default_value?: string }[] = [];
for (const file of tree("src")) {
    let content = readFileSync(file, "utf-8");

    let matches = content.matchAll(regex);
    //@ts-ignore
    for (const match of matches) {
        let line = content.substring(0, match.index).split("\n").length
        out.push({ key: { file, line: line, column: match.index + match[0].length }, locale_key: match[1], default_value: match[1] });
    }
}
