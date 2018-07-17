export function getDebugger(name) {
    return require("debug")("engine:" + name)
}