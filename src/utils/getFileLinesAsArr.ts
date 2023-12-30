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
