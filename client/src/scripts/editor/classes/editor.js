class Editor {
    constructor(element) {
        this.element = element
        this.hash = element.getAttribute("hash")
        this.viewport = new Viewport(element.querySelector(".viewport"), this)
        this.baseModal = element.querySelector("modal[use=base]")
    }

    select() {
        const currentEditor = Page.editor
        if (currentEditor) {
            currentEditor.unselect()
            Page.getEditBar().disableButtons()
        }

        this.element.classList.toggle("hidden")
        this.viewport.ensureSetup()
        Page.editor = this
    }

    unselect() {
        this.element.classList.toggle("hidden")
    }
}