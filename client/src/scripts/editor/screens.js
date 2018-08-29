let viewholders
let editors
let selectedIndex

document.addEventListener("DOMContentLoaded", () => {
    reloadCache()
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
        makeEditable(element)
    }

    viewholders[index].classList.add("selected")

    selectedIndex = index
}

function newScreen() {
    fetch(
        `/project/modify/screen?hash=${PROJECT_HASH}`,
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

function reloadCache() {
    viewholders = document.getElementsByClassName("viewholder")
    editors = document.getElementsByClassName("editor")
}

function getElementsOfEditor(editor) {
    const viewport = editor.getElementsByClassName("viewport")[0]
    return viewport.getElementsByClassName("element-box")
}