const path = require('path');

const homepage = (req, res) => {
    res.sendFile(path.join(__dirname, '../static/index.html'))
}


module.exports = homepage