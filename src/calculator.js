// Supports addition (add), subtraction (subtract), multiplication (multiply), and division (divide).
function calculate(operation, left, right) {
  if (!Number.isFinite(left) || !Number.isFinite(right)) {
    throw new Error('Both operands must be finite numbers.');
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
  const usage = 'Usage: node src/calculator.js <add|subtract|multiply|divide> <number> <number>';
  const args = process.argv.slice(2);

  try {
    if (args.length !== 3) {
      throw new Error('Provide an operation and exactly two numbers.');
    }

    const [operation, first, second] = args;
    if (!first.trim() || !second.trim()) {
      throw new Error('Both operands must be finite numbers.');
    }

    console.log(calculate(operation, Number(first), Number(second)));
  } catch (error) {
    console.error(`Error: ${error.message}\n${usage}`);
    process.exitCode = 1;
  }
}
