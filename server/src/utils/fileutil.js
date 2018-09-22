import { readdirSync, statSync } from "fs"

export function readdirSyncRecursive(directory) {
    const files = readdirSync(directory)
    let ret = []

    for (const file of files) {
        const path = directory + "/" + file
        if (statSync(path).isDirectory()) {
            ret = ret.concat(readdirSyncRecursive(path))
        } else {
            ret.push(path)
        }
    }

    return ret
}