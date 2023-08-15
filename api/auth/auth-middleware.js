const db = require('../../data/dbConfig');

const validateUser = async (req, res, next) => {
    if(!req.body.username || !req.body.password) {
        res.status(400).json({message: "username and password required"})
    } else {
        next()
    }
}

const checkUsername = async (req, res, next) => {
    const user = await db('users').where('username', req.body.username).first()
    if(!user){
        next()
    } else {
        res.status(400).json({message: "username taken"})
    }
}

module.exports = {
    validateUser,
    checkUsername
}