import crypto from "crypto"

export function newUniqueHash() {
    return crypto.createHash("sha1").update(Date.now().toString() + Math.random()).digest("hex")
}