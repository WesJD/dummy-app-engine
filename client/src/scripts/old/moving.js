function makeMoveable(element, realElement) {
    const viewport = element.parentElement
    const midBox = element.getElementsByClassName("mid")[0]

    const viewportBounds = viewport.getBoundingClientRect()
    const borderSize = fromPx(getComputedStyle(element)["border-top-width"])

    Dragability.forElement(element)
        .withPrecondition(event => {
            if (!element.classList.contains("with-border")) return false

            const x = event.clientX
            const y = event.clientY

            const mousedElement = document.elementFromPoint(x, y)
            if (mousedElement && getComputedStyle(mousedElement).cursor != "move") {
                return false
            }

            const elementBounds = element.getBoundingClientRect()
            const borderTop = elementBounds.top + borderSize
            const borderLeft = elementBounds.left + borderSize
            const borderBottom = elementBounds.bottom - borderSize
            const borderRight = elementBounds.right - borderSize
            return x >= elementBounds.left && x <= borderLeft ||
                x >= borderRight && x <= elementBounds.right ||
                y >= elementBounds.top && y <= borderTop ||
                y >= borderBottom && y <= elementBounds.bottom
        })
        .withCursor("move")
        .withInitialData(event => {
            const elementBounds = element.getBoundingClientRect()
            return {
                spaceX: event.clientX - elementBounds.left,
                spaceY: event.clientY - elementBounds.top
            }
        })
        .onMove((event, data) => {
            midBox.style.cursor = "move"

            const newX = Math.min(Math.max(0, (event.clientX - viewportBounds.left) - data.spaceX), MAX_X - fromPx(realElement.style.width))
            const newY = Math.min(Math.max(0, (event.clientY - viewportBounds.top) - data.spaceY), MAX_Y - fromPx(realElement.style.height))

            element.style.marginLeft = newX + "px"
            element.style.marginTop = newY + "px"
        })
        .onFinish(() => {
            //TODO submit new location to server

            midBox.style.cursor = "default"
        })
        .apply()
}