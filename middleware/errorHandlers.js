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
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.3',
                'Method' : 'HEAD',
            },
            timeout: 1000  // Timeout after 1 seconds
        };

        console.time()
        const req = https.request(options, res => {
            resolve({ statusCode: res.statusCode, statusMessage: res.statusMessage })
        }).on('error', error => {
            reject(error)
        })

        req.on('timeout', (err) => {
            console.log('TIMEOUT', err);
            reject(new Error('Timeout')) 
        })
        console.timeEnd()

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

const retryGetStatus = (url, retries = 3) => {
    return getStatus(url).catch(error => {
        console.log("Retrying..." + retries);
        if (retries > 0) {
            return retryGetStatus(url, retries - 1)
        }
        throw error
    })
}

const urlErrors = (req,res,next) => {
    const { link } = req.body

    if (req.method == 'GET') {
        const shortlink = req.path.replace('/', '')

        if (shortlink.length != 8) {
            const { output } = new boomErrors.badData("Insert a correct url")
            res.status(output.statusCode).render( 'error', { error : output.payload})
            return
        } else {
            next()
            return
        }
    }

    if (!urlExist(link)) {
        const { output } = new boomErrors.badRequest("Insert a correct url")
        res.status(output.statusCode).render( 'error', { error : output.payload})
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
        if (error.code == 'ECONNRESET') {
            retryGetStatus(link).catch(error => {
                next(err)
                return
            })
        }
        next(error)
        return
    })

}

const errorLogs = async (err, req, res, next) => {
    if (typeof err == 'object') {
        console.error(err);
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
        console.log(output.payload);
        res.status(output.statusCode).render( 'error', { error : output.payload})
        return 
    }
    if (error.code == 'ECONNRESET') {
        const { output } = new boomErrors.badGateway("Bad Gateway")
        console.log(output.payload);
        res.status(output.statusCode).render( 'error', { error : output.payload})
        return 
    }

    const boomErr = boomErrors.boomify(new Error(err.statusMessage), { statusCode: err.statusCode });
    if (boomErr != undefined) {
        const { output } = boomErr
        res.status(output.statusCode).render( 'error', { error : output.payload})
    } else {
        next(err)
    }
}

const errorHandler = async (err,req, res, next) => {

    res.status(500).render( 'error', { error : { error: "Internal Server Error", message: "Something went wrong"}})

    next()

}


module.exports = { errorHandler, boomErrorHandler ,errorLogs ,urlErrors}