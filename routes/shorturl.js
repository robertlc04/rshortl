const boomErrors = require('@hapi/boom');
const ShortLink = require('../services/shorturl_service');
const DB = require('../database/database');

const shortlinkPost = (req,res) => {

    const { link } = req.body

    // Start Instance
    const shortLink = new ShortLink(link)
    shortLink.createShortlink();
    
    const db = new DB();

    if (db.status()) {
        db.insertLink(shortLink.format())
    } else {
        res.status(500).send({ type: "Internal Server Error", error: "Something went wrong"})
    }
    console.log("Shortlink: " + shortLink.shortlink);

    res.render('shorturl', {data: shortLink.shortlink } )
}

const shortlinkGet = async(req,res) => {

    const shortlink = req.path.replace('/', '')
    const db = new DB();

    if (db.status()) {
        const link = await db.getLink(shortlink)
                        .then((data) => data)
                        .catch(err => console.log(err))
        db.disconnect()
        if (link == null) {
            const { output } = new boomErrors.notFound("The shortlink doesn't exist")
            res.status(output.statusCode).send(output.payload)
            return
        }
        res.status(302).redirect(link.link)
        return
    } else {
        res.status(200).send("The shortlink doesn't exist")
    }

    const { output } = new boomErrors.internal("Something went wrong")
    res.status(output.statusCode).send(output.payload)
}

module.exports = { shortlinkPost, shortlinkGet }