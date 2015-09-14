var bookmark = { url:'', tags:[], creationDate:Date.now(),
    expirationDate:Date.now() + constants.DAY_AS_MILLISECONDS * 7 }
var tags = []

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

function setUrl() {
    var text = document.getElementById('new-bookmark')
    var button = document.getElementById('bookmarkIt')

    bookmark.url = text.value
    button.disabled = 1 > bookmark.url.length
    console.log(bookmark)
}
