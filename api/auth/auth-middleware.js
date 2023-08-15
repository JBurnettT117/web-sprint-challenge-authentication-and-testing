const db = require('../../data/dbConfig');

const validateUser = async (req, res, next) => {
    if(!req.body.username || !req.body.password) {
        res.json({message: "username and password required"})
    } else {
        next()
    }
}

module.exports = {
    validateUser
}