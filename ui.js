function saveTag() {
    var input = document.getElementById('tag')

    if ('' === input.value) return
    bookmark.tags.push(input.value)
    console.log(bookmark)
    input.value = ''
}
