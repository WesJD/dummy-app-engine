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

function makeEditable(element) {
    const viewport = element.parentElement
    const viewportBounds = viewport.getBoundingClientRect()
    const realElement = element.getElementsByClassName("element")[0]
    const borderSize = fromPx(getComputedStyle(element)["border-top-width"])
    const borderDrag = Dragability.forElement(element)
        .withPrecondition(event => {
            const elementBounds = element.getBoundingClientRect()
            const borderTop = elementBounds.top + borderSize
            const borderLeft = elementBounds.left + borderSize
            const borderBottom = elementBounds.bottom - borderSize
            const borderRight = elementBounds.right - borderSize
            const x = event.clientX
            const y = event.clientY
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
            realElement.style.cursor = "move"

            const newX = Math.min(Math.max(0, (event.clientX - viewportBounds.left) - data.spaceX), (viewport.offsetWidth - 5) - (element.offsetWidth + 5))
            const newY = Math.min(Math.max(0, (event.clientY - viewportBounds.top) - data.spaceY), (viewport.offsetHeight - 5) - (element.offsetHeight + 5))

            element.style.marginLeft = newX + "px"
            element.style.marginTop = newY + "px"
        })
        .onFinish(() => {
            //TODO submit new location to server

            realElement.style.cursor = "auto"
        })
        .apply()

    function setupAdjustPoint(selector, handler, mid) {
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
        element.style.marginTop = fromPx(element.style.marginTop) - diffY + "px"
        realElement.style.height = fromPx(realElement.style.height) + diffY + "px"
    })
    setupAdjustPoint(".center.bottom", (_, diffY) => {
        realElement.style.height = fromPx(realElement.style.height) + diffY + "px"
    })

}

function makeEditable2(element) {




    let holding = false

    function setupAdjustPoint(mid, selector, handler) {
        const adjustPoint = element.querySelector((mid ? ".mid " : "") + ".adj-point" + selector)
        adjustPoint.onmousedown = downEvent => {
            downEvent = downEvent || window.event
            downEvent.preventDefault()

            let startX = downEvent.clientX
            let startY = downEvent.clientY

            holding = true

            document.onmouseup = () => {
                //TOOD submit to server

                holding = false
                document.onmouseup = null
                document.onmousemove = null
            }

            document.onmousemove = event => {
                event = event || window.event
                event.preventDefault()

                const x = event.clientX
                const y = event.clientY

                const diffX = x - startX
                const diffY = y - startY
                startX = x
                startY = y

                handler(downEvent, diffX, diffY)
            }
        }
    }

    setupAdjustPoint(true, ".left", (event, diffX) => {
        console.log("ff")
        realElement.style.paddingLeft = fromPx(realElement.style.paddingLeft) + diffX + "px"
        realElement.style.width = fromPx(realElement.style.width) + diffX + "px"
    })

    setupAdjustPoint(true, ".right", (event, diffX) => {
        realElement.style.paddingLeft = fromPx(realElement.style.paddingLeft) + diffX + "px"
        realElement.style.width = fromPx(realElement.style.width) + diffX + "px"
    })

    // element.onmousedown = event => {
    //     event = event || window.event
    //     event.preventDefault()

    //     const x = event.clientX
    //     const y = event.clientY



    //     if () {
    //         //is clicking on border


    //         holding = true

    //         const spaceX = x - elementBounds.left
    //         const spaceY = y - elementBounds.top

    //         document.onmouseup = () => {
    //             //TODO submit new location to server

    //             holding = false
    //             document.onmouseup = null
    //             document.onmousemove = null
    //             document.body.style.cursor = "auto"

    //         }

    //         document.onmousemove = event => {
    //             event = event || window.event
    //             event.preventDefault()

    //             

    //             element.style.marginLeft = newX + "px"
    //             element.style.marginTop = newY + "px"
    //         }
    //     }
    // }
}

function fromPx(css) {
    return parseFloat(css.substring(0, css.length - 2))
}