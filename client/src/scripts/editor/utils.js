class ParsingUtils {
    static fromPx(css) {
        return parseFloat(css.substring(0, css.length - 2))
    }
}

class ElementUtils {
    static toggleAttribute(element, attribute, value = "") {
        if (element.hasAttribute(attribute)) {
            element.attributes.removeNamedItem(attribute)
            return 0
        } else {
            element.setAttribute(attribute, value)
            return 1
        }
    }
}