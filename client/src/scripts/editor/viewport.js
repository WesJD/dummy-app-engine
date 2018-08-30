document.addEventListener("DOMContentLoaded", event => {
    const dropdowns = document.getElementsByClassName("newDropdown")
    for (const dropdown of dropdowns) {
        dropdown.addEventListener("click", (event) => {
            event.stopPropagation()
            dropdown.classList.toggle("is-active")
        })
    }
    document.addEventListener("click", () => {
        for (const dropdown of dropdowns) {
            dropdown.classList.remove("is-active")
        }
    })
})

function newElement(screenHash, type) {
    fetch(
        `/project/modify/element?project=${PROJECT_HASH}&screen=${screenHash}&type=${type}`,
        {
            "method": "POST",
            "credentials": "include"
        }
    ).then(res => {
        if (res.ok) {
            return res.json()
        } else throw new Error("Couldn't create element!")
    }).then(renderedHtml => {
        for (const editor of editors) {
            const hash = editor.getAttribute("hash")
            if (hash == screenHash) {
                const mapper = editor.getElementsByClassName("mapper")[0]
                const panel = mapper.getElementsByClassName("panel")[0]
                const panelBlocks = panel.getElementsByClassName("panel-block")
                panelBlocks[panelBlocks.length - 1].insertAdjacentHTML("beforebegin", renderedHtml.rendered)
            }
        }
    }).catch(err => console.log(err))
}

function ensureEditable(element) {
    if (element.getAttribute("listening")) {
        return
    }

    const viewport = element.parentElement
    const realElement = element.getElementsByClassName("element")[0]
    const midBox = element.getElementsByClassName("mid")[0]

    const viewportBounds = viewport.getBoundingClientRect()

    const borderSize = fromPx(getComputedStyle(element)["border-top-width"])
    Dragability.forElement(element)
        .withPrecondition(event => {
            const x = event.clientX
            const y = event.clientY

            const element = document.elementFromPoint(x, y)
            if (element && getComputedStyle(element).cursor != "move") {
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

            const newX = Math.min(Math.max(0, (event.clientX - viewportBounds.left) - data.spaceX), MAX_X)
            const newY = Math.min(Math.max(0, (event.clientY - viewportBounds.top) - data.spaceY), MAX_Y)

            element.style.marginLeft = newX + "px"
            element.style.marginTop = newY + "px"
        })
        .onFinish(() => {
            //TODO submit new location to server

            midBox.style.cursor = "default"
        })
        .apply()

    function setupAdjustPoint(selector, handler, mid) {
        if (typeof selector == "array") {
            selector.forEach(selec => setupAdjustPoint(selector, handler, mid))
            return
        }

        const adjustPoint = element.querySelector((mid ? ".mid " : "") + ".adj-point" + selector)
        Dragability.forElement(adjustPoint)
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

    element.setAttribute("listening", "yes")
}

function fromPx(css) {
    return parseFloat(css.substring(0, css.length - 2))
}