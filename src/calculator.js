// Supports addition (add), subtraction (subtract), multiplication (multiply), division (divide), modulo, exponentiation (power), square root (sqrt), and natural logarithm (log).
function calculate(operation, left, right) {
  const isUnaryOperation = operation === 'sqrt' || operation === 'log';
  if (!Number.isFinite(left) || (!isUnaryOperation && !Number.isFinite(right))) {
    throw new Error(
      isUnaryOperation
        ? 'The operand must be a finite number.'
        : 'Both operands must be finite numbers.',
    );
  }

  if (isUnaryOperation && arguments.length !== 2) {
    throw new Error(`${operation} accepts exactly one operand.`);
  }

  let result;
  switch (operation) {
    case 'add':
      result = left + right;
      break;
    case 'subtract':
      result = left - right;
      break;
    case 'multiply':
      result = left * right;
      break;
    case 'divide':
      if (right === 0) {
        throw new Error('Cannot divide by zero.');
      }
      result = left / right;
      break;
    case 'modulo':
      if (right === 0) {
        throw new Error('Cannot calculate modulo by zero.');
      }
      result = left % right;
      break;
    case 'power':
      result = left ** right;
      if (Number.isNaN(result)) {
        throw new Error('Exponentiation does not produce a real number.');
      }
      break;
    case 'sqrt':
      if (left < 0) {
        throw new Error('Cannot calculate the square root of a negative number.');
      }
      result = Math.sqrt(left);
      break;
    case 'log':
      if (left <= 0) {
        throw new Error('Cannot calculate the logarithm of a non-positive number.');
      }
      result = Math.log(left);
      break;
    default:
      throw new Error(`Unsupported operation: ${operation}.`);
  }

  if (!Number.isFinite(result)) {
    throw new Error('The result is outside the finite number range.');
  }

  return result;
}

module.exports = { calculate };

if (require.main === module) {
  const usage =
    'Usage: node src/calculator.js <add|subtract|multiply|divide|modulo|power> <number> <number> | <sqrt|log> <number>';
  const args = process.argv.slice(2);

  try {
    const operation = args[0];
    const isUnaryOperation = operation === 'sqrt' || operation === 'log';
    const expectedArgumentCount = isUnaryOperation ? 2 : 3;
    if (args.length !== expectedArgumentCount) {
      throw new Error(
        isUnaryOperation
          ? `Provide the ${operation} operation and exactly one number.`
          : 'Provide an operation and exactly two numbers.',
      );
    }

    const [, first, second] = args;
    if (!first.trim() || (second !== undefined && !second.trim())) {
      throw new Error(
        isUnaryOperation
          ? 'The operand must be a finite number.'
          : 'Both operands must be finite numbers.',
      );
    }

    const result = isUnaryOperation
      ? calculate(operation, Number(first))
      : calculate(operation, Number(first), Number(second));
    console.log(result);
  } catch (error) {
    console.error(`Error: ${error.message}\n${usage}`);
    process.exitCode = 1;
  }
}
