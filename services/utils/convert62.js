const dicctionary = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const base62_convert = (num) => {
    let result = '';
    while (num > 0) {
        result = dicctionary[num % 62] + result;
        num = Math.floor(num / 62);
    }
    return result;
}

module.exports = base62_convert