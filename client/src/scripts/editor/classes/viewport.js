class Viewport {
    constructor(element, editor) {
        this.element = element
        this.editor = editor
        this.boxes = []

        const domElement = element.querySelectorAll(".element-box")
        domElement.forEach(domElement => this.boxes.push(new Box(domElement, this)))
    }

    get x() {
        return this.bounds.left
    }

    get y() {
        return this.bounds.top
    }

    addElement(element) {
        const box = new Box(element, this)
        this.boxes.push(box)
        if (this.setup) {
            box.element.setup()
        }
    }

    ensureSetup() {
        if (!this.setup) {
            if (!this.bounds) {
                this.bounds = this.element.getBoundingClientRect()
            }

            this.boxes.forEach(box => box.element.setup())
            this.setup = true
        }
    }
}