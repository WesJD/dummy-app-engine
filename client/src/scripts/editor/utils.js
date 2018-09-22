class ParsingUtils {
    static fromPx(css) {
        return parseFloat(css.substring(0, css.length - 2))
    }
}