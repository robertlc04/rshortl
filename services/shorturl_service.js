const uuid = require('uuid');
const generateShortLink = require('./utils/generateShortlink');

// Write a class called ShortLink how have three methods called createShortlink, isShortlinkExist and getLink in the constructor return a object how have 4 parameters called id, link, shortlink and date.

class ShortLink {
    
    constructor(link) {
        this.id = uuid.v4(),
        this.link  = link,   
        this.shortlink = "",
        this.date  = new Date(Date.now()).toISOString()
    }

    createShortlink() {
        const shortlink = generateShortLink(this.link)
        this.shortlink = shortlink
        return true
    }

    format() {
        return {
            flag: this.shortlink.charAt(0),
            link: this.link,
            shortlink: this.shortlink,
            date: this.date
        }
    }

    isShortLinkExist() {
        return true
    }

}

module.exports = ShortLink