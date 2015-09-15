var bookmark = { url:'', tags:[], creationDate:Date.now(),
    expirationDate:Date.now() + constants.DAY_AS_MILLISECONDS * 7 }
var tags = []

function saveTag() {
    var input = document.getElementById('tag')

    if ('' === input.value) return

    var pattern = new RegExp(input.value)

    if (pattern.test(bookmark.tags.toString())) return // already in array
    bookmark.tags.push(input.value)
    if (pattern.test(tags.toString())) return // already in array
    tags.push(input.value)
    refereshTagChoices(tags)
    input.value = ''
}

function refereshTagChoices(tags) {
    var dl = document.getElementById('tags')

    if ('undefined' === typeof dl || null === dl) return
    dl.children = [] // start over
    for (var t in tags) {
        var option = document.createElement('option')
        var value = document.createTextNode(tags[t])

        if ('undefined' === typeof option || 'undefined' === typeof value) break // uh-oh
        option.appendChild(value)
        dl.appendChild(option)
    }
} // refereshTagChoices

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
} // setExpiration

function setUrl() {
    var text = document.getElementById('new-bookmark')
    var button = document.getElementById('bookmarkIt')

    if (bookmark.url !== text.value) bookmark.tags = [] // reset
    bookmark.url = text.value
    button.disabled = 1 > bookmark.url.length
}

function saveBookmark() {
    insertBookmark(db, bookmark)
    for (var t in bookmark.tags) {
        insertTag(db, bookmark.tags[t])
    }
    updateBookmarksView(bookmark)
}

function updateBookmarksView(bookmark) {
/* dynamically add row to table, with these columns (and in this order):
    url - needs to be hyperlinked
    date bookmarked
    expiration date
    tags - todo: possibly styled as individual spans
*/
    var table = document.getElementById('bookmarks')
    var tr = document.createElement('tr')
    var tdUrl = document.createElement('td')
    var tdCreation = document.createElement('td')
    var tdExpiration = document.createElement('td')
    var tdTags = document.createElement('td')
    var url = document.createTextNode(bookmark.url)
    var creationDate = document.createTextNode(new Date(bookmark.creationDate).toDateString())
    var expirationDate = document.createTextNode(
        null === bookmark.expirationDate ?
        '' : new Date(bookmark.expirationDate).toDateString()
    )
    var tags = document.createTextNode(bookmark.tags.toString())

    tr.appendChild(tdUrl).appendChild(url)
    tr.appendChild(tdCreation).appendChild(creationDate)
    tr.appendChild(tdExpiration).appendChild(expirationDate)
    tr.appendChild(tdTags).appendChild(tags)
    table.appendChild(tr)
} // updateBookmarksView

function initializeBookmarksView() {
    // todo: collect sort options and/or filter options
    queryTags(db)
}
