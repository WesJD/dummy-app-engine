class BackgroundModal extends Modal {
    constructor(element) {
        super(element)
        this.doneButton = element.querySelector("a.button")

        this.doneButton.addEventListener("click", () => this.close())
    }
}