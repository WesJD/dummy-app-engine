class EditBar {
    constructor(element) {
        this.element = element
        this.editsEnabled = false

        const newScreen = this.newScreen = element.querySelector("#newScreen")
        newScreen.addEventListener("click", () => {
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
            }).then(res => {
                Page.editors[Page.editors.length - 1].element.insertAdjacentHTML("afterend", res.editarea)
                const editor = new Editor(document.querySelector(`.editor[hash=\"${res.hash}\"]`))
                Page.editors.push(editor)

                Page.screenViewHolders[Page.screenViewHolders.length - 1].element.insertAdjacentHTML("afterend", res.screenview)
                Page.screenViewHolders.push(new ScreenViewHolder(document.querySelector(`.viewholder[corresponding=\"${res.hash}\"]`), editor))
            }).catch(err => console.log(err))
        })

        const newElement = this.newElement = element.querySelector("#newElement")
        function createElement(type) {
            const editor = Page.getCurrentEditor()
            fetch(
                `/project/modify/element?project=${PROJECT_HASH}&screen=${editor.hash}&type=${type}`,
                {
                    "method": "POST",
                    "credentials": "include"
                }
            ).then(res => {
                if (res.ok) {
                    return res.json()
                } else throw new Error("Couldn't create element!")
            }).then(res => {
                editor.viewport.element.insertAdjacentHTML("beforeend", res.rendered)
                editor.viewport.addElement(editor.viewport.element.querySelector(`.element-box[hash=\"${res.hash}\"]`))
            }).catch(err => console.log(err))
        }
        newElement.querySelectorAll(".navbar-dropdown .navbar-item").forEach(selection => {
            const type = selection.getAttribute("type")
            selection.addEventListener("click", () => createElement(type))
        })

        this.editButtons = {
            controlFlow: {
                element: element.querySelector("#controlFlow"),
                handler: () => {
                    console.log("controlflow")
                }
            },
            background: {
                element: element.querySelector("#background"),
                handler: () => Page.getCurrentEditor().viewport.selectedElement.box.backgroundModal.open()
            },
            delete: {
                element: element.querySelector("#delete"),
                handler: () => {
                    const selectedBox = Page.getCurrentEditor().viewport.selectedElement.box
                    fetch(
                        `/project/modify/element?project=${PROJECT_HASH}&screen=${getCurrentEditorHash()}&element=${selectedBox.hash}`,
                        {
                            "method": "DELETE",
                            "credentials": "include"
                        }
                    ).then(res => {
                        if (!res.ok) throw new Error("Couldn't create element!")
                    }).catch(err => console.log(err))
                    selectedBox.raw.parentNode.removeChild(selectedBox.raw)
                }
            }
        }
        for (const key in this.editButtons) {
            const button = this.editButtons[key]
            button.element.addEventListener("click", () => {
                if (this.editsEnabled) {
                    button.handler()
                }
            })
        }
    }

    ensureButtonsEnabled() {
        if (!this.editsEnabled) {
            this.toggleButtons()
        }
    }

    disableButtons() {
        this.toggleButtons()
    }

    toggleButtons() {
        this.editsEnabled = !this.editsEnabled
        for (const key in this.editButtons) {
            this.editButtons[key].element.classList.toggle("disabled")
        }
    }
}

class EditBarButton {
    constructor(element) {
        this.element = element
    }
}