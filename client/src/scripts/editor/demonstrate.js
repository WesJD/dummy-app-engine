let currentModal

function demonstrate() {
    currentModal = getCurrentEditor().querySelector(".modal")
    currentModal.classList.toggle("is-active")
}

function cancelDemonstration() {
    if (currentModal) {
        currentModal.classList.toggle("is-active")
        currentModal = null
    }
}