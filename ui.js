function saveTag() {
    var input = document.getElementById('tag')

    if ('' === input.value) return
    bookmark.tags.push(input.value)
    console.log(bookmark)
    input.value = ''
}

function setExpiration(length) {
    var when = Date.now()
    var extension

    switch (length) {
        case 'week':
            extension = constants.DAY_AS_MILLISECONDS * 7
            break
        case 'month':
            extension = constants.DAY_AS_MILLISECONDS * 30
            break
        case 'year':
            extension = constants.DAY_AS_MILLISECONDS * 365
            break
        default:
            bookmark.expirationDate = null
    } // switch
    if ('undefined' !== typeof extension) {
        when += extension
        bookmark.expirationDate = when
    }
    console.log(bookmark)
} // setExpiration
