const Page = {
    editors: [],
    getCurrentEditor: () => Page.editor,
    setCurrentEditor: editor => Page.editor = editor,

    screenViewHolders: [],
    getCurrentScreenView: () => Page.selectedScreenView,
    setCurrentScreenView: screenView => Page.selectedScreenView = screenView,

    getEditBar: () => Page.editBar,

    load: () => {
        const area = document.querySelector("#area")

        const editors = area.querySelectorAll(".editor")
        const viewholders = area.querySelectorAll(".viewholder")
        for (let i = 0; i < editors.length; i++) {
            const editor = new Editor(editors[i])
            const screenViewHolder = new ScreenViewHolder(viewholders[i], editor)
            Page.screenViewHolders.push(screenViewHolder)
            Page.editors.push(editor)
        }

        Page.editBar = new EditBar(document.querySelector(".navbar[role=editing]"))
        Page.screenViewHolders[0].select()
    }
}