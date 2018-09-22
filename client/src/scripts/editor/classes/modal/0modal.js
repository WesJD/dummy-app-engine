class Modal {
    constructor(element) {
        this.element = element
        this.showing = false
    }

    open() {
        if (!this.showing) {
            this.toggle()
        }
    }

    close() {
        if (this.showing) {
            this.toggle()
        }
    }

    toggle() {
        this.element.classList.toggle("is-active")
        this.showing = !this.showing
    }
}