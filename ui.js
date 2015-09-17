var bookmark = { url:'', tags:[], creationDate:Date.now(),
    expirationDate:Date.now() + constants.DAY_AS_MILLISECONDS * 7 }
var tags = []
var options = { where:'', orderBy:'url' } // defaults

function saveTag() {
    var input = document.getElementById('tag')

    if ('' === input.value) return

    var pattern = new RegExp(input.value)

    if (pattern.test(bookmark.tags.toString())) return // already in array
    bookmark.tags.push(input.value)
    if (pattern.test(tags.toString())) return // already in array
    tags.push(input.value)
    refreshTagChoices(tags)
    input.value = ''
}

function refreshTagChoices(tags, id) {
    var dl = document.getElementById(id)

    if ('undefined' === typeof dl || null === dl) return
    while (dl.firstChild)
        dl.removeChild(dl.firstChild)
    for (var t in tags) {
        var option = document.createElement('option')
        var value = document.createTextNode(tags[t])

        if ('undefined' === typeof option || 'undefined' === typeof value) break // uh-oh
        option.appendChild(value)
        dl.appendChild(option)
    }
} // refreshTagChoices

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
            extension = constants.DAY_AS_MILLISECONDS * 366
            break
        case 'never':
            bookmark.expirationDate = null
            break
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
    saveDB(db)
}

function updateBookmarksView(bookmark) {
    var table = document.getElementById('bookmarks')
    var tr = document.createElement('tr')
    var tdDeletion = document.createElement('td')
    var tdUrl = document.createElement('td')
    var tdCreation = document.createElement('td')
    var tdExpiration = document.createElement('td')
    var tdTags = document.createElement('td')
    var a = document.createElement('a')
    var x = document.createTextNode('x')
    var url = document.createTextNode(bookmark.url)
    var creationDate = document.createTextNode(new Date(bookmark.creationDate).toDateString())
    var expirationDate = document.createTextNode(
        null === bookmark.expirationDate ?
        '' : new Date(bookmark.expirationDate).toDateString()
    )
    var tags = document.createTextNode(bookmark.tags.toString())
    var hyperlink = function(url) {
        var a = document.createElement('a')
        var textNode = document.createTextNode(url)

        a.href = url
        a.target = '_blank'
        a.appendChild(textNode)
        return a
    }
    var setClickHandler = function(url) {
        var handler = 'requestDeletion(\'_url_\')'

        handler = handler.replace('_url_', url)
        return handler
    }

    tdDeletion.setAttribute('style', 'text-align: center; border: thin dotted lightgrey;')
    a.setAttribute('href', '#')
    a.setAttribute('onclick', setClickHandler(bookmark.url))
    a.setAttribute('style', 'text-decoration:none;')
    tr.appendChild(tdDeletion).appendChild(a).appendChild(x)
    tr.appendChild(tdUrl).appendChild(hyperlink(bookmark.url))
    tr.appendChild(tdCreation).appendChild(creationDate)
    tr.appendChild(tdExpiration).appendChild(expirationDate)
    tr.appendChild(tdTags).appendChild(tags)
    table.appendChild(tr)
} // updateBookmarksView

function initializeBookmarksView() {
    var tags = queryTags(db)
    var bookmarks = queryBookmarks(db, options)
    var tbody = document.getElementById('bookmarks')

    while (tbody.firstChild)
        tbody.removeChild(tbody.firstChild)

// tbody element is now empty

    for (var t in tags) {
        refreshTagChoices(tags, 'tags')
        refreshTagChoices(tags, 'choices')
    }

// datalists refreshed

    for (var b in bookmarks) {
        var bookmark = { url:bookmarks[b][0], creationDate:bookmarks[b][1],
            expirationDate:bookmarks[b][2], tags:bookmarks[b][3] }

        updateBookmarksView(bookmark)
    }

// list of bookmarks refreshed

} // initializeBookmarksView

function setSortOption(option) {
    options.orderBy = option // 'url', 'creationDate' or 'expirationDate'
    initializeBookmarksView()

// bookmarks re-rendered to sort list as specified

}

function getFilterOption() { return document.getElementById('filter').value }

function setFilterOption(option) {
    options.where = option
    initializeBookmarksView()

// bookmarks re-rendered to sort list as specified

}

function cleanup() {
    db.close()
}

function requestDeletion(url) {
    deleteBookmark(db, url)
    saveDB(db)
    initializeBookmarksView()
}
