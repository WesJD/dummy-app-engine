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
                console.log("move")
                this.midBox.style.cursor = "move"

                const newX = Math.min(Math.max(0, (event.clientX - this.viewport.bounds.left) - data.spaceX), MAX_X - this.element.width)
                const newY = Math.min(Math.max(0, (event.clientY - this.viewport.bounds.top) - data.spaceY), MAX_Y - this.element.height)

                this.x = newX
                this.y = newY
            })
            .onFinish(() => {
                //TODO submit new location to server

                this.midBox.style.cursor = "default"
            })
            .apply()

        this.setupAdjustPoint(".center.top", (_, diffY) => {
            const newHeight = this.element.height + diffY
            const newY = this.y - diffY
            if (newHeight >= 0 && newY >= 0 && newY <= MAX_Y) {
                this.y = newY
                this.element.height = newHeight
            }
        })
        this.setupAdjustPoint(".center.bottom", (_, diffY) => {
            const newHeight = this.element.height - diffY
            const value = this.y + newHeight
            if (value >= 0 && value <= MAX_Y) {
                this.element.height = newHeight
            }
        })
        this.setupAdjustPoint(".left", diffX => {
            const newWidth = this.element.width + diffX
            const newX = this.x - diffX
            if (newWidth >= 0 && newX >= 0 && newX <= MAX_X) {
                this.x = newX
                this.element.width = newWidth
            }
        }, true)
        this.setupAdjustPoint(".right", diffX => {
            const newWidth = this.element.width - diffX
            const value = this.x + newWidth
            if (value >= 0 && value <= MAX_X) {
                this.element.width = newWidth
            }
        }, true)
        this.setupAdjustPoint(".left.top", (diffX, diffY) => {
            const diff = (diffX + diffY) / 2
            const newHeight = this.element.height + diff
            const newWidth = this.element.width + diff
            const newX = this.x - diff
            const newY = this.y - diff
            if ((newHeight >= 0 || newWidth >= 0) &&
                newX >= 0 && newX <= MAX_X &&
                newY >= 0 && newY <= MAX_Y) {
                this.element.height = newHeight
                this.element.width = newWidth
                this.x = newX
                this.y = newY
            }
        })
        this.setupAdjustPoint(".right.top", (diffX, diffY) => {
            const diff = (diffX - diffY) / 2
            const newHeight = this.element.height - diff
            const newWidth = this.element.width - diff
            const newY = this.y + diff
            const endX = this.x + newWidth
            if ((newHeight >= 0 || newWidth >= 0) &&
                endX >= 0 && endX <= MAX_X &&
                newY >= 0 && newY <= MAX_Y) {
                this.element.height = newHeight
                this.element.width = newWidth
                this.y = newY
            }
        })
        this.setupAdjustPoint(".left.bottom", (diffX, diffY) => {
            const diff = (diffX - diffY) / 2
            const newHeight = this.element.height + diff
            const newWidth = this.element.width + diff
            const newX = this.x - diff
            const endY = this.y + newWidth
            if ((newHeight >= 0 || newWidth >= 0) &&
                newX >= 0 && newX <= MAX_X &&
                endY >= 0 && endY <= MAX_Y) {
                this.element.height = newHeight
                this.element.width = newWidth
                this.x = newX
            }
        })
        this.setupAdjustPoint(".right.bottom", (diffX, diffY) => {
            const diff = (diffX + diffY) / 2
            const newHeight = this.element.height - diff
            const newWidth = this.element.width - diff
            const endX = this.x + newWidth
            const endY = this.y + newHeight
            if ((newHeight >= 0 || newWidth >= 0) &&
                endX >= 0 && endX <= MAX_X &&
                endY >= 0 && endY <= MAX_Y) {
                this.element.height = newHeight
                this.element.width = newWidth
            }
        })

        this.element.setup()
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
                //TODO submit new location to server
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