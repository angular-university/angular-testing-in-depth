
function add(a: number, b: number) {
  console.log('REAL add() called');
  return a + b;
}

export const calculator = {
  add
}
