class BackgroundModal {
    constructor(element) {
        this.element = element
        this.doneButton = element.querySelector("a.button")
        this.showing = false

        this.doneButton.addEventListener("click", () => this.close())
    }

    open() {
        this.toggle()
    }

    close() {
        this.toggle()
    }

    toggle() {
        this.element.classList.toggle("is-active")
        this.showing = !this.showing
    }
}