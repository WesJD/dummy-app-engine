function makeResizeable(element, realElement) {
    function setupAdjustPoint(selector, handler, mid) {
        const adjustPoint = element.querySelector((mid ? ".mid " : "") + ".adj-point" + selector)
        Dragability.forElement(adjustPoint)
            .withPrecondition(() => element.classList.contains("with-border"))
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

    setupAdjustPoint(".center.top", (_, diffY) => {
        const newHeight = fromPx(realElement.style.height) + diffY
        const newY = fromPx(element.style.marginTop) - diffY
        if (newHeight >= 0 && newY >= 0 && newY <= MAX_Y) {
            element.style.marginTop = newY + "px"
            realElement.style.height = newHeight + "px"
        }
    })
    setupAdjustPoint(".center.bottom", (_, diffY) => {
        const newHeight = fromPx(realElement.style.height) - diffY
        const value = fromPx(element.style.marginTop) + newHeight
        if (value >= 0 && value <= MAX_Y) {
            realElement.style.height = newHeight + "px"
        }
    })
    setupAdjustPoint(".left", diffX => {
        const newWidth = fromPx(realElement.style.width) + diffX
        const newX = fromPx(element.style.marginLeft) - diffX
        if (newWidth >= 0 && newX >= 0 && newX <= MAX_X) {
            element.style.marginLeft = newX + "px"
            realElement.style.width = newWidth + "px"
        }
    }, true)
    setupAdjustPoint(".right", diffX => {
        const newWidth = fromPx(realElement.style.width) - diffX
        const value = fromPx(element.style.marginLeft) + newWidth
        if (value >= 0 && value <= MAX_X) {
            realElement.style.width = newWidth + "px"
        }
    }, true)
    setupAdjustPoint(".left.top", (diffX, diffY) => {
        const diff = (diffX + diffY) / 2
        const newHeight = fromPx(realElement.style.height) + diff
        const newWidth = fromPx(realElement.style.width) + diff
        const newX = fromPx(element.style.marginLeft) - diff
        const newY = fromPx(element.style.marginTop) - diff
        if ((newHeight >= 0 || newWidth >= 0) &&
            newX >= 0 && newX <= MAX_X &&
            newY >= 0 && newY <= MAX_Y) {
            realElement.style.height = newHeight + "px"
            realElement.style.width = newWidth + "px"
            element.style.marginLeft = newX + "px"
            element.style.marginTop = newY + "px"
        }
    })
    setupAdjustPoint(".right.top", (diffX, diffY) => {
        const diff = (diffX - diffY) / 2
        const newHeight = fromPx(realElement.style.height) - diff
        const newWidth = fromPx(realElement.style.width) - diff
        const newY = fromPx(element.style.marginTop) + diff
        const endX = fromPx(element.style.marginLeft) + newWidth
        if ((newHeight >= 0 || newWidth >= 0) &&
            endX >= 0 && endX <= MAX_X &&
            newY >= 0 && newY <= MAX_Y) {
            realElement.style.height = newHeight + "px"
            realElement.style.width = newWidth + "px"
            element.style.marginTop = newY + "px"
        }
    })
    setupAdjustPoint(".left.bottom", (diffX, diffY) => {
        const diff = (diffX - diffY) / 2
        const newHeight = fromPx(realElement.style.height) + diff
        const newWidth = fromPx(realElement.style.width) + diff
        const newX = fromPx(element.style.marginLeft) - diff
        const endY = fromPx(element.style.marginTop) + newWidth
        if ((newHeight >= 0 || newWidth >= 0) &&
            newX >= 0 && newX <= MAX_X &&
            endY >= 0 && endY <= MAX_Y) {
            realElement.style.height = newHeight + "px"
            realElement.style.width = newWidth + "px"
            element.style.marginLeft = newX + "px"
        }
    })
    setupAdjustPoint(".right.bottom", (diffX, diffY) => {
        const diff = (diffX + diffY) / 2
        const newHeight = fromPx(realElement.style.height) - diff
        const newWidth = fromPx(realElement.style.width) - diff
        const endX = fromPx(element.style.marginLeft) + newWidth
        const endY = fromPx(element.style.marginTop) + newHeight
        if ((newHeight >= 0 || newWidth >= 0) &&
            endX >= 0 && endX <= MAX_X &&
            endY >= 0 && endY <= MAX_Y) {
            realElement.style.height = newHeight + "px"
            realElement.style.width = newWidth + "px"
        }
    })
}