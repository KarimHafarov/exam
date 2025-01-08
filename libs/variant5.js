/**
 * @typedef {{sign: '+' | '-' | '', coefficients: number[], exponent: number}} SplitValue
 */

/**
 * Check if a number is integer
 * @param {number | boolean} value
 * @return {boolean} isInteger
 */
function isInteger (value) {
  if (typeof value === 'boolean') {
    return true
  }

  return isFinite(value)
    ? (value === Math.round(value))
    : false
}

/**
 * Calculate the sign of a number
 * @param {number} x
 * @returns {number}
 */
function sign (x) {
  if (x > 0) {
    return 1
  } else if (x < 0) {
    return -1
  } else {
    return 0
  }
}

/**
 * Calculate the base-2 logarithm of a number
 * @param {number} x
 * @returns {number}
 */
function log2 (x) {
  if(x <= 0) {
    return NaN
  }
  return Math.log(x) / Math.LN2
}



/**
 * Split a number into sign, coefficients, and exponent
 * @param {number | string} value
 * @return {SplitValue}
 *              Returns an object containing sign, coefficients, and exponent
 */
function splitNumber (value) {
  // parse the input value
  const match = String(value).toLowerCase().match(/^(-?)(\d+\.?\d*)(e([+-]?\d+))?$/)
  if (!match) {
    throw new SyntaxError('Invalid number ' + value)
  }

  const sign = match[1]
  const digits = match[2]
  let exponent = parseFloat(match[4] || '0')

  const dot = digits.indexOf('.')
  exponent += (dot !== -1) ? (dot - 1) : (digits.length - 1)

  const coefficients = digits
    .replace('.', '') // remove the dot (must be removed before removing leading zeros)
    .replace(/^0*/, function (zeros) {
      // remove leading zeros, add their count to the exponent
      exponent -= zeros.length
      return ''
    })
    .replace(/0*$/, '') // remove trailing zeros
    .split('')
    .map(function (d) {
      return parseInt(d)
    })

  if (coefficients.length === 0) {
    coefficients.push(0)
    exponent++
  }

  return { sign, coefficients, exponent }
}

/**
 * Format a number with fixed notation.
 * @param {number | string} value
 * @param {number} [precision=undefined]  Optional number of decimals after the
 *                                        decimal point. null by default.
 */
function toFixed (value, precision) {
  if (isNaN(value) || !isFinite(value)) {
    return String(value)
  }

  const splitValue = splitNumber(value)
  const rounded = (typeof precision === 'number')
    ? roundDigits(splitValue, splitValue.exponent + 1 + precision)
    : splitValue
  let c = rounded.coefficients
  let p = rounded.exponent + 1 // exponent may have changed

  // append zeros if needed
  const pp = p + (precision || 0)
  if (c.length < pp) {
    c = c.concat(zeros(pp - c.length))
  }

  // prepend zeros if needed
  if (p < 0) {
    c = zeros(-p + 1).concat(c)
    p = 1
  }

  // insert a dot if needed
  if (p < c.length) {
    c.splice(p, 0, (p === 0) ? '0.' : '.')
  }

  return rounded.sign + c.join('')
}

/**
 * Minimum number added to one that makes the result different than one
 */
const DBL_EPSILON = Number.EPSILON || 2.2204460492503130808472633361816E-16

/**
 * Compares two floating point numbers.
 * @param {number} x          First value to compare
 * @param {number} y          Second value to compare
 * @param {number} [epsilon]  The maximum relative difference between x and y
 *                            If epsilon is undefined or null, the function will
 *                            test whether x and y are exactly equal.
 * @return {boolean} whether the two numbers are nearly equal
 */
function nearlyEqual (x, y, epsilon) {
  // if epsilon is null or undefined, test whether x and y are exactly equal
  if (epsilon === null || epsilon === undefined) {
    return x === y
  }

  if (x === y) {
    return true
  }

  // NaN
  if (isNaN(x) || isNaN(y)) {
    return false
  }

  // at this point x and y should be finite
  if (isFinite(x) && isFinite(y)) {
    // check numbers are very close, needed when comparing numbers near zero
    const diff = Math.abs(x - y)
    if (diff < DBL_EPSILON) {
      return true
    } else {
      // use relative error
      return diff <= Math.max(Math.abs(x), Math.abs(y)) * epsilon
    }
  }

  // Infinite and Number or negative Infinite and positive Infinite cases
  return false
}

function roundDigits(splitValue, precision) {
  const { sign, coefficients, exponent } = splitValue;

  if (precision <= 0) {
    throw new Error('Precision must be greater than 0');
  }

  // Якщо кількість цифр вже менша або рівна precision, повертаємо без змін
  if (coefficients.length <= precision) {
    return { sign, coefficients, exponent };
  }

  // Округлюємо цифри
  const roundedCoefficients = coefficients.slice(0, precision);
  if (coefficients[precision] >= 5) {
    // Виконуємо перенесення (carry) при округленні
    for (let i = precision - 1; i >= 0; i--) {
      roundedCoefficients[i]++;
      if (roundedCoefficients[i] < 10) break; // Немає перенесення
      roundedCoefficients[i] = 0; // Скидаємо і переносимо
    }

    // Якщо всі цифри перенеслися (наприклад, 999 → 1000)
    if (roundedCoefficients[0] === 0) {
      roundedCoefficients.unshift(1);
      return { sign, coefficients: roundedCoefficients, exponent: exponent + 1 };
    }
  }

  return { sign, coefficients: roundedCoefficients, exponent };
}

function zeros(count) {
  if (count < 0) {
    throw new Error('Count must be a non-negative number');
  }
  return Array(count).fill(0);
}

module.exports = {
  isInteger,
  isFinite,
  sign,
  log2,
  splitNumber,
  toFixed,
  nearlyEqual,
  DBL_EPSILON,
  roundDigits,
  zeros,
}