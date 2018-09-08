const projectDetails = {}

let editBar
let selectedElement

document.addEventListener("DOMContentLoaded", () => {
    editBar = document.querySelector(".navbar[role=editing]")

    projectDetails.modal = document.querySelector("#projectDetails")
    projectDetails.name = projectDetails.modal.querySelector("#name")
    projectDetails.help = projectDetails.name.nextSibling
    projectDetails.done = projectDetails.modal.querySelector("a.button")
})

function editDetails(done) {
    if (done) {
        if (projectDetails.name.value.length > 0) {
            //TODO submit change to server
        } else {
            return
        }
    }
    projectDetails.modal.classList.toggle("is-active")
}

function newElement(type) {
    const screenHash = getCurrentEditorHash()
    fetch(
        `/project/modify/element?project=${PROJECT_HASH}&screen=${screenHash}&type=${type}`,
        {
            "method": "POST",
            "credentials": "include"
        }
    ).then(res => {
        if (res.ok) {
            return res.json()
        } else throw new Error("Couldn't create element!")
    }).then(res => {
        const viewport = getCurrentEditor().querySelector(".viewport")
        viewport.insertAdjacentHTML("beforeend", res.rendered)
    }).catch(err => console.log(err))
}

function ensureEditable(element) {
    if (!element.getAttribute("listening")) {
        const realElement = element.querySelector(".element")
        const adjustPoints = element.querySelectorAll(".adj-point, .mid")

        realElement.addEventListener("click", () => {
            if (!selectedElement || selectedElement.getAttribute("hash") != element.getAttribute("hash")) {
                if (selectedElement) unselectElement(selectedElement)

                adjustPoints.forEach(point => point.classList.toggle("hidden"))
                element.classList.toggle("with-border")

                if (!element.getAttribute("border-listening")) {
                    makeResizeable(element, realElement)
                    makeMoveable(element, realElement)
                    element.setAttribute("border-listening", "yes")
                }

                ensureEditsEnabled()
                selectedElement = element
            }
        })

        element.setAttribute("listening", "yes")
    }
}

function unselectElement(element) {
    element.querySelectorAll(".adj-point, .mid").forEach(point => point.classList.toggle("hidden"))
    element.classList.toggle("with-border")
}

function ensureEditsEnabled() {
    if (!editBar.hasAttribute("editing")) {
        editBar.querySelectorAll(".disabled").forEach(element => element.classList.toggle("disabled"))
        editBar.setAttribute("editing", "enabled")
    }
}

function fromPx(css) {
    return parseFloat(css.substring(0, css.length - 2))
}

setInterval(() => {
    if (projectDetails.modal.classList.contains("is-active")) {
        const isWarning = projectDetails.name.classList.contains("is-danger")
        if (projectDetails.name.value.length > 0) {
            if (isWarning) {
                projectDetails.help.classList.add("hidden")
                projectDetails.name.classList.remove("is-danger")
                projectDetails.done.removeAttribute("disabled")
            }
        } else if (!isWarning) {
            projectDetails.name.classList.add("is-danger")
            projectDetails.help.classList.remove("hidden")
            projectDetails.done.setAttribute("disabled", "")
        }
    }
}, 500)