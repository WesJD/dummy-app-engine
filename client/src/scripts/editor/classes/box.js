class Box {
    constructor(raw, viewport) {
        this.raw = raw
        this.viewport = viewport
        this.style = raw.style
        this.element = new Element(raw.querySelector(".element"), this)
        this.adjustPoints = []
        this.midBox = raw.querySelector(".mid")
        this.visible = false
        this.hash = raw.getAttribute("hash")
        this.backgroundModal = new BackgroundModal(raw.querySelector(".modal[use=background]"))

        raw.querySelectorAll(".adj-point, .mid").forEach(element => this.adjustPoints.push(element))
    }

    get x() {
        return ParsingUtils.fromPx(this.style.marginLeft)
    }

    set x(value) {
        this.style.marginLeft = value + "px"
    }

    get y() {
        return ParsingUtils.fromPx(this.style.marginTop)
    }

    set y(value) {
        this.style.marginTop = value + "px"
    }

    setup() {
        this.borderSize = ParsingUtils.fromPx(getComputedStyle(this.raw)["border-top-width"])

        Dragability.forElement(this.raw)
            .withPrecondition(event => {
                if (!this.visible) return false

                const x = event.clientX
                const y = event.clientY

                const mousedElement = document.elementFromPoint(x, y)
                if (mousedElement && getComputedStyle(mousedElement).cursor != "move") {
                    return false
                }

                const elementBounds = this.raw.getBoundingClientRect()
                const borderTop = elementBounds.top + this.borderSize
                const borderLeft = elementBounds.left + this.borderSize
                const borderBottom = elementBounds.bottom - this.borderSize
                const borderRight = elementBounds.right - this.borderSize
                return x >= elementBounds.left && x <= borderLeft ||
                    x >= borderRight && x <= elementBounds.right ||
                    y >= elementBounds.top && y <= borderTop ||
                    y >= borderBottom && y <= elementBounds.bottom
            })
            .withCursor("move")
            .withInitialData(event => {
                const elementBounds = this.raw.getBoundingClientRect()
                return {
                    spaceX: event.clientX - elementBounds.left,
                    spaceY: event.clientY - elementBounds.top
                }
            })
            .onMove((event, data) => {
                this.midBox.style.cursor = "move"

                const newX = (event.clientX - data.spaceX) - this.viewport.x
                const newY = (event.clientY - data.spaceY) - this.viewport.y

                this.x = newX
                this.y = newY
            })
            .onFinish(() => {
                Change.onScreen(this.viewport.editor.hash)
                    .forElement(this.hash)
                    .position(this.x, this.y)
                    .push()

                this.midBox.style.cursor = "default"
            })
            .apply()

        this.setupAdjustPoint(".center.top", (_, diffY) => {
            const newHeight = this.element.height + diffY
            if (newHeight >= 0) {
                this.y = this.y - diffY
                this.element.height = newHeight
            }
        })
        this.setupAdjustPoint(".center.bottom", (_, diffY) => this.element.height = this.element.height - diffY)
        this.setupAdjustPoint(".left", diffX => {
            const newWidth = this.element.width + diffX
            if (newWidth >= 0) {
                this.x -= diffX
                this.element.width = newWidth
            }
        }, true)
        this.setupAdjustPoint(".right", diffX => this.element.width = this.element.width - diffX, true)
        this.setupAdjustPoint(".left.top", (diffX, diffY) => {
            const newHeight = this.element.height + diffY
            const newWidth = this.element.width + diffX
            if (newHeight >= 0 && newWidth >= 0) {
                this.element.height = newHeight
                this.element.width = newWidth
                this.x -= diffX
                this.y -= diffY
            }
        })
        this.setupAdjustPoint(".right.top", (diffX, diffY) => {
            const newHeight = this.element.height + diffY
            const newWidth = this.element.width - diffX
            if (newHeight >= 0 && newWidth >= 0) {
                this.element.height = newHeight
                this.element.width = newWidth
                this.y -= diffY
            }
        })
        this.setupAdjustPoint(".left.bottom", (diffX, diffY) => {
            const newHeight = this.element.height - diffY
            const newWidth = this.element.width + diffX
            if (newHeight >= 0 && newWidth >= 0) {
                this.element.height = newHeight
                this.element.width = newWidth
                this.x -= diffX
            }
        })
        this.setupAdjustPoint(".right.bottom", (diffX, diffY) => {
            const newHeight = this.element.height - diffY
            const newWidth = this.element.width - diffX
            if (newHeight >= 0 && newWidth >= 0) {
                this.element.height = newHeight
                this.element.width = newWidth
            }
        })
    }

    setupAdjustPoint(selector, handler, mid) {
        const adjustPoint = this.raw.querySelector((mid ? ".mid " : "") + ".adj-point" + selector)
        Dragability.forElement(adjustPoint)
            .withPrecondition(() => this.visible)
            .withInitialData(event => {
                return {
                    startX: event.clientX,
                    startY: event.clientY
                }
            })
            .onMove((event, data) => {
                const diffX = data.startX - event.clientX
                const diffY = data.startY - event.clientY
                data.startX = event.clientX
                data.startY = event.clientY
                handler(diffX, diffY)
            })
            .onFinish(() => {
                Change.onScreen(this.viewport.editor.hash)
                    .forElement(this.hash)
                    .resize(this.element.height, this.element.width)
                    .push()
                Change.onScreen(this.viewport.editor.hash)
                    .forElement(this.hash)
                    .position(this.x, this.y)
                    .push()
            })
            .apply()
    }

    show() {
        const currentlySelected = this.viewport.selectedElement
        if (currentlySelected) {
            currentlySelected.box.hide()
        }

        this.toggle()
        this.viewport.selectedElement = this.element
    }

    hide() {
        this.toggle()
    }

    toggle() {
        this.visible = !this.visible
        this.adjustPoints.forEach(point => point.classList.toggle("hidden"))
        this.raw.classList.toggle("with-border")
    }
}