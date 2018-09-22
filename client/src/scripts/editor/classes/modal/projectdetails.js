class ProjectDetailsModal extends Modal {
    constructor(element) {
        super(element)
        this.closeable = true
        this.doneButton = element.querySelector(".button.is-success")
        this.fields = {
            name: {
                element: element.querySelector("input[filling=name]"),
                help: element.querySelector("input[filling=name] ~ span.help")
            },
            description: {
                element: element.querySelector("textarea[filling=description]")
            }
        }

        this.doneButton.addEventListener("click", () => {
            if (this.closeable) {
                const name = this.fields.name.element.value
                const description = this.fields.description.element.value
                if (name != this.fields.name.originalValue ||
                    description != this.fields.description.originalValue) {
                    fetch(
                        `/project/modify/details?project=${PROJECT_HASH}`,
                        {
                            method: "POST",
                            credentials: "include",
                            headers: {
                                "Content-Type": "application/json; charset=utf-8"
                            },
                            body: JSON.stringify({ name, description })
                        },
                    ).then(res => {
                        if (!res.ok) throw new Error("Couldn't submit new details!")
                    }).catch(err => {
                        console.err(err)
                    })
                }
                this.close()
            }
        })
    }

    open() {
        super.open()
        this.task = setInterval(this.checkFields.bind(this), 250)
        Object.keys(this.fields).forEach(key => {
            const field = this.fields[key]
            field.originalValue = field.element.value
        })
    }

    close() {
        super.close()
        clearInterval(this.task)
    }

    checkFields() {
        const size = this.fields.name.element.value.length
        if (!this.closeable) {
            if (size > 0) {
                this.toggleDoneRestriction()
            }
        } else if (size == 0) {
            this.toggleDoneRestriction()
        }
    }

    toggleDoneRestriction() {
        this.fields.name.help.classList.toggle("hidden")
        ElementUtils.toggleAttribute(this.doneButton, "disabled")
        this.closeable = !this.closeable
    }
}