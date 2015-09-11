var constants = { 'mybookmarks':'mybookmarks' }

function exportSQLite(db) {
    var bin2String = function(array) {
        return String.fromCharCode.apply(String, array)
    }

    return simpleStorage.set(constants.mybookmarks,
        bin2String(db.exportSQLite())
    ) /* true, false, or error object */

}

function importLocalStorage() {
    var string2Bin = function(str) {
        return str.split("").map( function(val) {
            return val.charCodeAt(0)
        } )
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

function createDB() {
    var db = new SQL.Database()

// create database tables
    db.run('CREATE TABLE bookmarks (url, tags, expirationDate, creationDate);')
    db.run('CREATE TABLE tags (tag);')
// write the database to a file
    if (simpleStorage.canUse()) {
        var result = exportSQLite(db)

        if (false === result) {
            throw { name:'BookmarkException', msg:'failed to export local storage'}
        }
        if ('Object' === result) {
            throw result
        }
        db.close()
    }
    else {
        throw { name:'BookmarkException', msg:'local storage not an option' }
        db.close()
    }
}
