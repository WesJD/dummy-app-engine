class Editor {
    constructor(element) {
        this.element = element
        this.hash = element.getAttribute("hash")
        this.viewport = new Viewport(element.querySelector(".viewport"))
        this.baseModal = element.querySelector("modal[use=base]")
    }

    select() {
        const currentEditor = Page.getCurrentEditor()
        if (currentEditor) {
            currentEditor.unselect()
            Page.getEditBar().disableButtons()
        }

        this.element.classList.toggle("hidden")
        this.viewport.ensureSetup()
        Page.setCurrentEditor(this)
    }

    unselect() {
        this.element.classList.toggle("hidden")
    }
}