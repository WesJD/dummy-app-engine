"use strict"

function toggleNewProject() {
    document.getElementsByClassName("modal")[0].classList.toggle("is-active")
}

function submitProject() {
    const nameElement = document.getElementById("nameinput").value
    const descriptionElement = document.getElementById("descinput").value

    let url = "/project/new"
    url += "?name=" + convertToUrlReady(nameElement)
    url += "&description=" + convertToUrlReady(descriptionElement)

    fetch(
        url,
        {
            "method": "POST",
            "credentials": "include"
        }
    ).then(res => {
        if (res.ok) {
            return res.text()
        } else throw new Error("Not ok :(")
    }).then(text => {
        console.log(text)
        window.location.href = "/project/editor?hash=" + text
    }).catch(err => console.log("Couldn't send request", err))
}

function convertToUrlReady(value) {
    return value.replace(/\ /g, "%20")
}

setInterval(() => {
    const element = document.getElementById("nameinput")
    const help = element.ownerDocument.getElementsByClassName("help")[0]
    const submit = document.getElementById("newsubmit")
    const hasDanger = element.classList.contains("is-danger")
    if (element.value.length > 0) {
        if (hasDanger) {
            element.classList.remove("is-danger")
            help.style.display = "none"
            submit.attributes.removeNamedItem("disabled")
        }
    } else if (!hasDanger) {
        element.classList.add("is-danger")
        help.style.display = ""
        submit.setAttribute("disabled", "")
    }
}, 20)