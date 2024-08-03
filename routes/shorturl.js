const ShortLink = require('../services/shorturl_service');

const shortlinkPost = (req,res) => {

    const { link } = req.body

    const shortLink = new ShortLink(link)

    console.log(shortLink.createShortlink());

    res.send("Hello World")
}

module.exports = { shortlinkPost }