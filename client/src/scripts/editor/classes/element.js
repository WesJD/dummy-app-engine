class Element {
    constructor(raw, box) {
        this.raw = raw
        this.box = box
        this.style = raw.style
    }

    get width() {
        return ParsingUtils.fromPx(this.style.width)
    }

    set width(value) {
        this.style.width = value + "px"
    }

    get height() {
        return ParsingUtils.fromPx(this.style.height)
    }

    set height(value) {
        this.style.height = value + "px"
    }

    get background() {
        return this.style.background
    }

    setup() {
        this.raw.addEventListener("click", () => {
            this.box.show()
            this.box.setup()
            Page.getEditBar().ensureButtonsEnabled()
        })
    }
}