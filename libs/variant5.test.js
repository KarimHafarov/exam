const {
    isInteger,
    sign,
    log2,
    splitNumber,
    toFixed,
    nearlyEqual,
    DBL_EPSILON,
    roundDigits,
    zeros,
  } = require('./variant5.js');
  
  describe('isInteger', () => {
    test('повертає true для цілих чисел', () => {
      expect(isInteger(5)).toBe(true);
      expect(isInteger(0)).toBe(true);
      expect(isInteger(-100)).toBe(true);
    });
  
    test('повертає false для нецілих чисел', () => {
      expect(isInteger(5.5)).toBe(false);
      expect(isInteger('5')).toBe(false);
    });
  
    test('повертає true для логічних значень', () => {
      expect(isInteger(true)).toBe(true);
      expect(isInteger(false)).toBe(true);
    });
  });
  
  describe('sign', () => {
    test('повертає 1 для додатних чисел', () => {
      expect(sign(10)).toBe(1);
    });
  
    test('повертає -1 для від’ємних чисел', () => {
      expect(sign(-10)).toBe(-1);
    });
  
    test('повертає 0 для нуля', () => {
      expect(sign(0)).toBe(0);
    });
  });
  
  describe('log2', () => {
    test('повертає логарифм за основою 2', () => {
      expect(log2(8)).toBeCloseTo(3, 10);
      expect(log2(1)).toBeCloseTo(0, 10);
    });
  
    test('повертає NaN для недодатних чисел', () => {
      expect(log2(0)).toBeNaN();
      expect(log2(-1)).toBeNaN();
    });
  });
  
  describe('splitNumber', () => {
    test('правильно розбиває додатні числа', () => {
      const result = splitNumber(123.45);
      expect(result).toEqual({
        sign: '',
        coefficients: [1, 2, 3, 4, 5],
        exponent: 2,
      });
    });
  
    test('правильно розбиває від’ємні числа', () => {
      const result = splitNumber(-6789);
      expect(result).toEqual({
        sign: '-',
        coefficients: [6, 7, 8, 9],
        exponent: 3,
      });
    });
  
    test('правильно обробляє нуль', () => {
      const result = splitNumber(0);
      expect(result).toEqual({
        sign: '',
        coefficients: [0],
        exponent: 0,
      });
    });
  
    test('правильно обробляє від’ємний нуль', () => {
      const result = splitNumber(-0);
      expect(result).toEqual({
        sign: '',
        coefficients: [0],
        exponent: 0,
      });
    });
  
    test('викидає помилку для некоректних чисел', () => {
      expect(() => splitNumber('abc')).toThrow(SyntaxError);
      expect(() => splitNumber('1..23')).toThrow(SyntaxError);
      expect(() => splitNumber('123e')).toThrow(SyntaxError);
    });
  });
  
  describe('toFixed', () => {
    test('форматує число з вказаною точністю', () => {
      expect(toFixed(123.456, 2)).toBe('123.46');
      expect(toFixed(0.00123, 4)).toBe('0.0012');
    });
  
    test('додає нулі, якщо потрібно', () => {
      expect(toFixed(1, 3)).toBe('1.000');
    });
  
    test('не змінює ціле число без заданої точності', () => {
      expect(toFixed(123)).toBe('123');
    });
  
    test('обробляє некоректні значення', () => {
      expect(toFixed(NaN)).toBe('NaN');
      expect(toFixed(Infinity)).toBe('Infinity');
    });
  });
  
  describe('nearlyEqual', () => {
    test('повертає true для рівних чисел', () => {
      expect(nearlyEqual(1, 1)).toBe(true);
    });
  
    test('повертає true для чисел, близьких за epsilon', () => {
      expect(nearlyEqual(0.1 + 0.2, 0.3, DBL_EPSILON)).toBe(true);
    });
  
    test('повертає false для значно різних чисел', () => {
      expect(nearlyEqual(1, 2)).toBe(false);
    });
  
    test('повертає false для NaN', () => {
      expect(nearlyEqual(NaN, 1)).toBe(false);
      expect(nearlyEqual(NaN, NaN)).toBe(false);
    });
  
    test('правильно порівнює нескінченність', () => {
      expect(nearlyEqual(Infinity, Infinity)).toBe(false);
      expect(nearlyEqual(-Infinity, -Infinity)).toBe(false);
    });
  });
  
  describe('roundDigits', () => {
    test('округлює до вказаної точності', () => {
      const splitValue = { sign: '', coefficients: [1, 2, 3, 4, 5], exponent: 2 };
      expect(roundDigits(splitValue, 3)).toEqual({
        sign: '',
        coefficients: [1, 2, 3],
        exponent: 2,
      });
    });
  
    test('виконує перенесення при округленні', () => {
      const splitValue = { sign: '', coefficients: [9, 9, 9], exponent: 2 };
      expect(roundDigits(splitValue, 2)).toEqual({
        sign: '',
        coefficients: [1, 0],
        exponent: 3,
      });
    });
  
    test('викидає помилку для некоректної точності', () => {
      const splitValue = { sign: '', coefficients: [1, 2, 3], exponent: 2 };
      expect(() => roundDigits(splitValue, 0)).toThrow('Precision must be greater than 0');
    });
  });
  
  describe('zeros', () => {
    test('створює масив нулів', () => {
      expect(zeros(5)).toEqual([0, 0, 0, 0, 0]);
      expect(zeros(0)).toEqual([]);
    });
  
    test('викидає помилку для від’ємного числа', () => {
      expect(() => zeros(-1)).toThrow('zeros is not a function');
    });
  });
  