const path = require('path');

const homepage = (req, res, next) => {
    if (req.path === '/') {
        res.sendFile(path.join(__dirname, '../static/index.html'))
    }
}


module.exports = homepage