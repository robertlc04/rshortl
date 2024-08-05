const path = require('path');

const homepage = (req, res) => {
    res.sendFile(path.join(__dirname, '../static/error.html'))
}


module.exports = homepage