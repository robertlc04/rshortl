const https = require('https');
const path = require('path');

const getStatus = (url) => {
    
    return new Promise((resolve, reject) => {
        const { hostname, pathname} = new URL(url)
        // HTTPs
        const options = {
            hostname,
            port: 443,
            path: pathname,
            timeout: 2000  // Timeout after 1 seconds
        };

        const req = https.get(options, res => {
            resolve(res.statusCode)
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
    if (!urlExist(link)) {
        res.status(400).send({ type: "Bad Request", error: "Insert a correct url"})
        return
    }

    
    getStatus(link)
    .then(status => {
        if (status >= 200 && status < 400) {
            next()
        } else {
            res.status(status).send({ type: "Bad Request", error: "The url doesn't exist"})
        }
    })
    .catch(error => {
        next(error)
    })

}


const errorLogs = async (err, req, res, next) => {
    console.error(`${err}`)
    next(err)
}

const errorHandler = async (err,req, res, next) => {

    console.log(err.code);

    if (err.code === "ENOTFOUND") {
        res.status(404).send(`
            <script>
                localStorage.setItem('error', '${err}');
                window.location.href = '/error';
            </script>
        `)
        return
    }
    
    
    res.status(500).send({ type: "Internal Server Error", error: "Something went wrong"})

    next()

}


module.exports = { errorHandler, errorLogs ,urlErrors}