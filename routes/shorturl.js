const ShortLink = require('../services/shorturl_service');

const shortlinkPost = (req,res) => {

    const { link } = req.body

    const shortLink = new ShortLink(link)

    const shortlink = shortLink.createShortlink();
    

    res.send(shortLink)
}

module.exports = { shortlinkPost }