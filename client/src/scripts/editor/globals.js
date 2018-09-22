const PROJECT_HASH = window.location.href.split("=")[1]

const CHANGE_QUEUE = []
const CHANGE_SUBMIT_INTERVAL = 1000 * 0.5

const PREVENT_OVERLAP_PX = 17.7
let MAX_X
let MAX_Y
document.addEventListener("DOMContentLoaded", () => {
    MAX_X = parseFloat(document.querySelector("meta[name=viewport_dimension_x]").getAttribute("content")) - PREVENT_OVERLAP_PX
    MAX_Y = parseFloat(document.querySelector("meta[name=viewport_dimension_y]").getAttribute("content")) - PREVENT_OVERLAP_PX
})