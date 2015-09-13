function saveTag() {
    var input = document.getElementById('tag')

    if ('' === input.value) return
    console.log(input.value)
    input.value = ''
}
