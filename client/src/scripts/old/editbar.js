function editControlFlow() {

}

function editBackground() {

}

function remove() {
    fetch(
        `/project/modify/element?project=${PROJECT_HASH}&screen=${getCurrentEditorHash()}&element=${selectedElement.getAttribute("hash")}`,
        {
            "method": "DELETE",
            "credentials": "include"
        }
    ).then(res => {
        if (!res.ok) throw new Error("Couldn't create element!")
    }).catch(err => console.log(err))
    selectedElement.parentNode.removeChild(selectedElement)
    editsEnabled(false)
}