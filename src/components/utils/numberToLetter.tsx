function numberToLetters(num: number, beginAtOne: boolean = false) { 
    if (beginAtOne) {
        num -= 1;
    }

    let result = '';
    while (num >= 0) {
        result = String.fromCharCode((num % 26) + 65) + result;
        num = Math.floor(num / 26) - 1;
    }
    return result;
};

export default numberToLetters;