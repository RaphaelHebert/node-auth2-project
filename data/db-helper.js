const db = require('./db-config')


function dbFindAll(){
    return db('users')
        .join('roles', 'users.role_id', 'roles.role_id')
        .select('user_id', 'username', 'role_name')
}

function dbFindBy(filter){
    return db('users')
        .join('roles', 'users.role_id', 'roles.role_id')
        .where(filter)
}

function dbFindById(id){
    return db('users')
    .join('roles', 'users.role_id', 'roles.role_id')
    .where({user_id: id})
}

module.exports = {
    dbFindAll,
    dbFindBy,
    dbFindById
}