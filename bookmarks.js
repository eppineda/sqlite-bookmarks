var constants = { 'mybookmarks':'mybookmarks' }
var db

function exportSQLite(db) {
    var bin2String = function(array) {
        return String.fromCharCode.apply(String, array)
    }

    return simpleStorage.set(constants.mybookmarks, bin2String(db.export()))
        /* true, false, or error object, according to API docs */
}

function importLocalStorage() {
    var string2Bin = function(str) {
        return str.split("").map(function(val) {
            return val.charCodeAt(0)
        })
    }
    var datastring = simpleStorage.get(constants.mybookmarks)

    return ('undefined' === typeof datastring ? datastring : string2Bin(datastring))
        /* either undefined or array of binary */
} // importLocalStorage

function createDB() {
    if (!simpleStorage.canUse())
        throw { name:'BookmarkException', msg:'local storage not an option' }

    var db = new SQL.Database()

    db.run('CREATE TABLE bookmarks (url, tags, expirationDate, creationDate);')
    db.run('CREATE TABLE tags (tag);')

// empty database exists in memory

    var result = exportSQLite(db)

    if (false === result)
        throw { name:'BookmarkException', msg:'failed to write to local storage' }
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
        throw { name:'BookmarkException', msg:'failed to write to local storage' }
    if ('Object' === typeof result)
        throw result // something very bad happened
// successfully written to local storage
} // saveDB

function restoreDB() {
    if (!simpleStorage.canUse())
        throw { name:'BookmarkException', msg:'local storage not an option' }

    var data = importLocalStorage()

    return ('undefined' === typeof data ? createDB() : new SQL.Database(data))
        /* return reference to SQLite database in memory */
}

(function initialize() {
    try {
        db = restoreDB()
    }
    catch(e) {
        console.error(e)
    }
})()
