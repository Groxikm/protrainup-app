export function formatInput(input, lowerLimit, upperLimit) {

    let numStr = input.replace(/[^0-9%]/g, '');


    if (numStr.includes('%')) {
        numStr = numStr.replace('%', '');
    }

    let num = parseInt(numStr, 10);


    if (num < lowerLimit) {
        num = lowerLimit;
    } else if (num > upperLimit) {
        num = upperLimit;
    }

    return num;
}