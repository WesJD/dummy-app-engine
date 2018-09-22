class ScreenViewHolder {
    constructor(element, editor) {
        this.element = element
        this.editor = editor
        this.selected = false

        element.addEventListener("click", () => this.select())
    }

    select() {
        if (!this.selected) {
            const currentScreenView = Page.getCurrentScreenView()
            if (currentScreenView) {
                currentScreenView.unselect()
            }

            this.toggle()
            this.editor.select()
            Page.setCurrentScreenView(this)
            this.selected = true
        }
    }

    unselect() {
        this.toggle()
    }

    toggle() {
        this.selected = !this.selected
        this.element.classList.toggle("selected")
    }
}