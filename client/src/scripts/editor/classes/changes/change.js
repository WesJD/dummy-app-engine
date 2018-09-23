class Change {
    constructor(screenHash) {
        this.data = {
            screenHash
        }
    }

    push() {
        Page.changeQueue.queueUp(this.data)
    }

    background(value) {
        this.data.action = "background"
        this.data.background = value
        return this
    }

    position(x, y) {
        this.data.action = "position"
        this.data.x = x
        this.data.y = y
        return this
    }

    resize(height, width) {
        this.data.action = "resize"
        this.data.height = height
        this.data.width = width
        return this
    }

    forElement(hash) {
        this.data.elementHash = hash
        return this
    }

    static onScreen(hash) {
        return new Change(hash)
    }
}