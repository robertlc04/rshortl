const https = require('https');
const path = require('path');
const boomErrors = require('@hapi/boom');

const getStatus = (url) => {
    
    return new Promise((resolve, reject) => {
        const { hostname, pathname} = new URL(url)
        // HTTPs
        const options = {
            hostname,
            port: 443,
            path: pathname,
            headers: new Headers({
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.3',
            }),
            timeout: 2000  // Timeout after 1 seconds
        };

        const req = https.get(options, res => {
            resolve({ statusCode: res.statusCode, statusMessage: res.statusMessage })
        }).on('error', error => {
            reject(error)
        })

        req.on('timeout', () => {
            req.abort()
            reject(new Error('Timeout')) 
        })

        req.end()
    })

}

/**
 * Checks if the given URL exists and is valid.
 *
 * @param {string} url - The URL to check.
 * @return {boolean} Returns true if the URL exists and is valid, false otherwise.
 */
const urlExist = (url) => {
    const http_regex = /^http:|^https:/
    const domain_regex = /\s*\.\s*/;
    // const shortLink_regex =  /\s*rshortl\.railway\.com\/\s*/;
    let link = url
    if (!http_regex.test(link)) {
        link = `http://${url}`
    }
    if (!domain_regex.test(link)) {
        return false
    }

    return URL.canParse(url)
}

const urlErrors = (req,res,next) => {
    const { link } = req.body

    if (req.method == 'GET') {
        const shortlink = req.path.replace('/', '')

        if (shortlink.length != 8) {
            const { output } = new boomErrors.badData("Insert a correct url")
            res.status(output.statusCode).send(output.payload)
            return
        } else {
            next()
            return
        }
    }

    if (!urlExist(link)) {
        const { output } = new boomErrors.badRequest("Insert a correct url")
        res.status(output.statusCode).send(output.payload)
        return
    }

    
    getStatus(link)
    .then(payload => {
        if (payload.statusCode >= 200 && payload.statusCode < 400) {
            next()
            return
        } else {
            next(payload)
            return
        }
    })
    .catch(error => {
        next(error)
        return
    })

}

const errorLogs = async (err, req, res, next) => {
    if (typeof err == 'object') {
        console.error(...Object.values(err));
        next(err)
        return
    }
    console.error(`${err}`)
    next(err)
}

const boomErrorHandler = (err, req, res, next) => {
    if (err.code == 'ENOTFOUND') {
        const { output } = new boomErrors.notFound("Url Not Found")
        res.status(output.statusCode).send(output.payload)
        return 
    }
    const boomErr = boomErrors.boomify(new Error(err.statusMessage), { statusCode: err.statusCode });
    if (boomErr != undefined) {
        const { output } = boomErr
        res.status(output.statusCode).send(output.payload)
    } else {
        next(err)
    }
}

const errorHandler = async (err,req, res, next) => {

    res.status(500).send({ type: "Internal Server Error", error: "Something went wrong"})

    next()

}


module.exports = { errorHandler, boomErrorHandler ,errorLogs ,urlErrors}