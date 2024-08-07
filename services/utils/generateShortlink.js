const uuid = require('uuid');
const convert62 = require('./convert62');


const generateShortLink = (link) => {
    const randomNumber = uuid.v4().replace(/-/g, ''); // Eliminamos los guiones
    let result = '';

    // Convertimos cada grupo de 4 caracteres a un número y luego a base62
    for (let i = 0; i < randomNumber.length; i += 4) {
        const segment = randomNumber.slice(i, i + 4);
        const num = parseInt(segment, 16); // Convertimos el segmento hexadecimal a decimal
        result += convert62(num);
    }

    return result.slice(0, 8);
}

module.exports = generateShortLink