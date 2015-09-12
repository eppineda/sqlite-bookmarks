var constants = { 'mybookmarks':'mybookmarks' }

function exportSQLite(db) {
    var bin2String = function(array) {
        return String.fromCharCode.apply(String, array)
    }

    return simpleStorage.set(constants.mybookmarks, bin2String(db.export()))
        /* true, false, or error object, according to API docs */
}

function createDB() {
    if (!simpleStorage.canUse())
        throw { name:'BookmarkException', msg:'local storage not an option' }

    var db = new SQL.Database()

    db.run('CREATE TABLE bookmarks (url, tags, expirationDate, creationDate);')
    db.run('CREATE TABLE tags (tag);')

// empty database exists in memory

    var result = exportSQLite(db)

    if (false === result)
        throw { name:'BookmarkException', msg:'failed to write to local storage'}
    if ('Object' === typeof result)
        throw result // something very bad happened

// database now written to local storage

    return db
} // createDB

function saveDB(db) {
    if (!simpleStorage.canUse())
        throw { name:'BookmarkException', msg:'local storage not an option' }

    var result = exportSQLite(db)

    if (false === result)
        throw { name:'BookmarkException', msg:'failed to write to local storage'}
    if ('Object' === typeof result)
        throw result // something very bad happened
// successfully written to local storage
} // saveDB

function importLocalStorage() {
    var string2Bin = function(str) {
        return str.split("").map(function(val) {
            return val.charCodeAt(0)
        })
    }
    var datastring = simpleStorage.get(constants.mybookmarks)

    if ('undefined' !== datastring) {
        var data = string2Bin(datastring)
        // todo: complete
    }
    else {
        // todo: something went wrong; no data retrieved
    }
}

function saveDB(db) {
    // todo
}
