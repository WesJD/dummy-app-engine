document.addEventListener("DOMContentLoaded", () => {
    setInterval(() => {
        if (CHANGE_QUEUE.length > 0) {
            fetch(
                `/project/modify/element?project=${PROJECT_HASH}&screen=${screenHash}`,
                {
                    "method": "PUT",
                    "credentials": "include",
                    "headers": {
                        "Content-Type": "application/json; charset=utf-8"
                    },
                    "body": JSON.stringify({ changes: CHANGE_QUEUE })
                },
            ).then(res => {
                if (res.ok) {
                    return res.json()
                } else {
                    //Handle server not responding
                }
            }).catch(err => {
                //Toast that there was an error
                console.err(err)
            })

            CHANGE_QUEUE.length = 0
        }
    }, parseInt(document.querySelector("meta[name=update_interval]").getAttribute("content")))
})