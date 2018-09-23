class ChangeQueue {
    constructor() {
        this.queue = []
        this.dirty = false
        setInterval(this.pushChanges.bind(this), parseFloat(document.querySelector("meta[name=update_interval]").getAttribute("content")))
    }

    queueUp(change) {
        for (let i = 0; i < this.queue.length; i++) {
            const savedChange = this.queue[i]
            if (savedChange.screenHash == change.screenHash &&
                savedChange.elementHash == change.elementHash &&
                savedChange.action == change.action) {
                this.queue[i] = change
                return
            }
        }
        this.queue.push(change)
        this.dirty = true
    }

    pushChanges() {
        if (this.queue.length > 0) {
            const oldQueue = this.queue.slice()
            this.queue.length = 0
            fetch(
                `/project/modify/element?project=${Page.projectHash}`,
                {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json; charset=utf-8"
                    },
                    body: JSON.stringify({ changes: oldQueue })
                },
            ).then(res => {
                if (res.ok) {
                    if (this.queue.length == 0) { //prevent race
                        this.dirty = false
                    }
                } else throw new Error("Couldn't submit updates!")
            }).catch(err => {
                alert("Server was unable to process updates! Please report your console.")
                console.log(err)
            })
        }
    }
}