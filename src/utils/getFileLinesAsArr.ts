import { open as openFile } from "node:fs/promises";

export async function getFileLinesAsArr(absoluteFilePath: string): Promise<string[]> {
    return new Promise(async (resolve, _) => {
        const file = await openFile(absoluteFilePath);

        const linesArr: string[] = [];
        for await (const line of file.readLines()) {
            linesArr.push(line);
        }
        resolve(linesArr);
    });
}

export async function getAllFileLinesAsString(
    absoluteFilePath: string,
    preserveNewLineCharacter?: boolean
): Promise<string> {
    preserveNewLineCharacter = preserveNewLineCharacter || true; // defaults to true
    return new Promise(async (resolve, _) => {
        const file = await openFile(absoluteFilePath);

        let lines: string = "";
        for await (const line of file.readLines()) {
            lines += line;
            if (preserveNewLineCharacter) lines += "\n"; // preserve new line character
        }
        resolve(lines);
    });
}
