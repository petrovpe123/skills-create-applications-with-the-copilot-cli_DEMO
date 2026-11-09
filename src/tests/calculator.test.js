const { spawnSync } = require('node:child_process');
const path = require('node:path');
const { calculate } = require('../calculator');

describe('addition', () => {
  test.each([
    [2, 3, 5],
    [0, 0, 0],
    [7, 0, 7],
    [-2, -3, -5],
    [-2, 3, 1],
    [0.1, 0.2, 0.3],
  ])('add(%s, %s) returns %s', (left, right, expected) => {
    expect(calculate('add', left, right)).toBeCloseTo(expected);
  });
});

describe('subtraction', () => {
  test.each([
    [10, 4, 6],
    [4, 10, -6],
    [5, 5, 0],
    [0, 4, -4],
    [-10, -4, -6],
    [1.5, 0.25, 1.25],
  ])('subtract(%s, %s) returns %s', (left, right, expected) => {
    expect(calculate('subtract', left, right)).toBeCloseTo(expected);
  });
});

describe('multiplication', () => {
  test.each([
    [45, 2, 90],
    [45, 0, 0],
    [45, 1, 45],
    [-3, 2, -6],
    [-3, -2, 6],
    [1.5, 2.5, 3.75],
  ])('multiply(%s, %s) returns %s', (left, right, expected) => {
    expect(calculate('multiply', left, right)).toBeCloseTo(expected);
  });
});

describe('division', () => {
  test.each([
    [20, 5, 4],
    [7, 2, 3.5],
    [0, 5, 0],
    [-20, 5, -4],
    [-20, -5, 4],
    [1.5, 0.5, 3],
  ])('divide(%s, %s) returns %s', (left, right, expected) => {
    expect(calculate('divide', left, right)).toBeCloseTo(expected);
  });

  test.each([
    [1, 0],
    [1, -0],
    [0, 0],
    [-1, 0],
  ])('rejects division of %s by %s', (left, right) => {
    expect(() => calculate('divide', left, right)).toThrow('Cannot divide by zero.');
  });
});

describe('invalid calculations', () => {
  test.each([NaN, Infinity, -Infinity, '2', '', null, undefined])(
    'rejects invalid operand %s in either position',
    (operand) => {
      expect(() => calculate('add', operand, 2)).toThrow('Both operands must be finite numbers.');
      expect(() => calculate('add', 2, operand)).toThrow('Both operands must be finite numbers.');
    },
  );

  test.each(['power', '', undefined])('rejects unsupported operation %s', (operation) => {
    expect(() => calculate(operation, 2, 3)).toThrow('Unsupported operation:');
  });

  test.each([
    ['add', Number.MAX_VALUE, Number.MAX_VALUE],
    ['subtract', -Number.MAX_VALUE, Number.MAX_VALUE],
    ['multiply', Number.MAX_VALUE, 2],
    ['divide', Number.MAX_VALUE, Number.MIN_VALUE],
  ])('rejects overflow for %s', (operation, left, right) => {
    expect(() => calculate(operation, left, right)).toThrow(
      'The result is outside the finite number range.',
    );
  });
});

describe('CLI', () => {
  const calculator = path.join(__dirname, '..', 'calculator.js');
  const run = (args) => spawnSync(process.execPath, [calculator, ...args], { encoding: 'utf8' });

  test.each([
    ['add', '2', '3', '5'],
    ['subtract', '10', '4', '6'],
    ['multiply', '45', '2', '90'],
    ['divide', '20', '5', '4'],
    ['multiply', '-3', '2.5', '-7.5'],
    ['divide', '7', '2', '3.5'],
  ])('prints the result for %s %s %s', (operation, left, right, expected) => {
    const result = run([operation, left, right]);
    expect(result.status).toBe(0);
    expect(result.stdout.trim()).toBe(expected);
    expect(result.stderr).toBe('');
  });

  test.each([
    [[], 'exactly two numbers'],
    [['add', '1'], 'exactly two numbers'],
    [['add', '1', '2', '3'], 'exactly two numbers'],
    [['power', '2', '3'], 'Unsupported operation'],
    [['add', 'abc', '2'], 'finite numbers'],
    [['add', '2', 'abc'], 'finite numbers'],
    [['add', '', '2'], 'finite numbers'],
    [['add', '2', ' '], 'finite numbers'],
    [['add', 'Infinity', '2'], 'finite numbers'],
    [['add', 'NaN', '2'], 'finite numbers'],
    [['divide', '1', '0'], 'Cannot divide by zero'],
    [['divide', '1', '-0'], 'Cannot divide by zero'],
    [['multiply', '1e308', '10'], 'finite number range'],
  ])('reports an error for arguments %j', (args, expected) => {
    const result = run(args);
    expect(result.status).toBe(1);
    expect(result.stdout).toBe('');
    expect(result.stderr).toContain(expected);
    expect(result.stderr).toContain('Usage:');
  });
});
