const uuid = require('uuid');

const dicctionary = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const base62_convert = (num) => {
    let result = '';
    while (num > 0) {
        result = dicctionary[num % 62] + result;
        num = Math.floor(num / 62);
    }
    return result;
}

const genateShortLink = (link) => {
    const randomNumber = uuid.v4().replace(/-/g, ''); // Eliminamos los guiones
    let result = '';

    // Convertimos cada grupo de 4 caracteres a un número y luego a base62
    for (let i = 0; i < randomNumber.length; i += 4) {
        const segment = randomNumber.slice(i, i + 4);
        const num = parseInt(segment, 16); // Convertimos el segmento hexadecimal a decimal
        result += base62_convert(num);
    }

    return result.slice(0, 8);
}

// Write a class called ShortLink how have three methods called createShortlink, isShortlinkExist and getLink in the constructor return a object how have 4 parameters called id, link, shortlink and date.

class ShortLink {
    
    constructor(link) {
        this.id = uuid.v4(),
        this.link  = link,   
        this.shortlink = "",
        this.date  = Date.now()
    }
    getLink(link) {
        return true
    }

    createShortlink() {
        const shortlink = genateShortLink(this.link)
        this.shortlink = shortlink
        return true
    }

    isShortLinkExist() {
        return true
    }

    

}

module.exports = ShortLink