const db = require('../../data/dbConfig');

const validateUser = async (req, res, next) => {
    if(!req.body.username || !req.body.password) {
        res.json({message: "username and password required"})
    }
    next()
}

module.exports = {
    validateUser
}