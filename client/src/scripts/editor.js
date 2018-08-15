"use strict"

const projectHash = window.location.href.split("=")[1]

let viewholders
let editors
let selectedIndex

document.addEventListener("DOMContentLoaded", event => {
    reloadCache()

    const dropdowns = document.getElementsByClassName("newDropdown")
    for (const dropdown of dropdowns) {
        addDropdownListener(dropdown)
    }

    document.addEventListener("click", () => {
        for (const dropdown of dropdowns) {
            dropdown.classList.remove("is-active")
        }
    })

    select(0, false)
})

function select(index, unsetOld = true) {
    if (index == selectedIndex) return

    if (unsetOld) {
        viewholders[selectedIndex].classList.remove("selected")

        const editor = editors[selectedIndex]
        for (const element of getElementsOfEditor(editor)) {
            element.onmousedown = null
        }
        editor.classList.add("hidden")
    }

    const editor = editors[index]
    editor.classList.remove("hidden")
    const elements = getElementsOfEditor(editor)
    for (const element of elements) {
        makeDraggable(element)
    }

    viewholders[index].classList.add("selected")

    selectedIndex = index
}

function getElementsOfEditor(editor) {
    const viewport = editor.getElementsByClassName("viewport")[0]
    return viewport.getElementsByClassName("element")
}

function addDropdownListener(dropdown) {
    dropdown.addEventListener("click", (event) => {
        event.stopPropagation()
        dropdown.classList.toggle("is-active")
    })
}

function reloadCache() {
    viewholders = document.getElementsByClassName("viewholder")
    editors = document.getElementsByClassName("editor")
}

function newScreen() {
    fetch(
        `/project/modify/screen?hash=${projectHash}`,
        {
            "method": "POST",
            "credentials": "include"
        }
    ).then(res => {
        if (res.ok) {
            return res.json()
        } else throw new Error("Couldn't create new screen!")
    }).then(renderedHtml => {
        viewholders[viewholders.length - 1].insertAdjacentHTML("beforebegin", renderedHtml.screenview)
        editors[editors.length - 1].insertAdjacentHTML("afterend", renderedHtml.editarea)

        reloadCache()
        select(editors.length - 1)
    }).catch(err => console.log(err))
}

function newElement(screenHash, type) {
    fetch(
        `/project/modify/element?project=${projectHash}&screen=${screenHash}&type=${type}`,
        {
            "method": "POST",
            "credentials": "include"
        }
    ).then(res => {
        if (res.ok) {
            return res.json()
        } else throw new Error("Couldn't create element!")
    }).then(renderedHtml => {
        for (const editor of editors) {
            const hash = editor.getAttribute("hash")
            if (hash == screenHash) {
                const mapper = editor.getElementsByClassName("mapper")[0]
                const panel = mapper.getElementsByClassName("panel")[0]
                const panelBlocks = panel.getElementsByClassName("panel-block")
                panelBlocks[panelBlocks.length - 1].insertAdjacentHTML("beforebegin", renderedHtml.rendered)
            }
        }
    }).catch(err => console.log(err))
}

function makeDraggable(element) {
    const viewportBounds = element.parentElement.getBoundingClientRect()
    element.onmousedown = event => {
        event = event || window.event
        event.preventDefault()

        const bounds = element.getBoundingClientRect()
        const spaceX = event.clientX - bounds.left
        const spaceY = event.clientY - bounds.top

        document.onmouseup = () => {
            //TODO submit new location to server

            document.onmouseup = null
            document.onmousemove = null
        }
        document.onmousemove = event => {
            event = event || window.event
            event.preventDefault()

            element.style.marginLeft = ((event.clientX - viewportBounds.left) - spaceX) + "px"
            element.style.marginTop = ((event.clientY - viewportBounds.top) - spaceY) + "px"
        }
    }
}