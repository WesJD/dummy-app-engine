class Dragability {
    constructor(element) {
        this.element = element
    }

    withCursor(cursorType) {
        this.cursorType = cursorType
        return this
    }

    withInitialData(initialData) {
        this.initialData = initialData
        return this
    }

    withPrecondition(preconditionHandler) {
        this.preconditionHandler = preconditionHandler
        return this
    }

    onMove(moveHandler) {
        this.moveHandler = moveHandler
        return this
    }

    onFinish(finishHandler) {
        this.finishHandler = finishHandler
        return this
    }

    apply() {
        this.element.onmousedown = event => {
            event = event || window.event
            event.preventDefault()

            let next = true
            if (this.preconditionHandler) {
                next = this.preconditionHandler(event)
            }

            if (next) {
                const oldCursor = document.body.style.cursor
                document.body.style.cursor = this.cursorType

                const data = Object.assign({}, typeof this.initialData == "function" ? this.initialData(event) : this.initialData)
                document.onmouseup = event => {
                    event = event || window.event
                    event.preventDefault()

                    this.finishHandler(event, data)

                    document.onmouseup = null
                    document.onmousemove = null
                    document.body.style.cursor = oldCursor
                }
                document.onmousemove = event => {
                    event = event || window.event
                    event.preventDefault()

                    this.moveHandler(event, data)
                }
            }
        }
        return this
    }

    remove() {
        this.element.onmousedown = null
    }

    static forElement(element) {
        return new Dragability(element)
    }
}