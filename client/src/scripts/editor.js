const projectHash = window.location.href.split("=")[1]
console.log(projectHash)

let viewholders
let editors
let selectedIndex

window.onload = () => {
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
}

function select(index, unsetOld = true) {
    if (index == selectedIndex) return

    if (unsetOld) {
        viewholders[selectedIndex].classList.remove("selected")
        editors[selectedIndex].classList.add("hidden")
    }

    viewholders[index].classList.add("selected")
    editors[index].classList.remove("hidden")

    selectedIndex = index
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
    })
}