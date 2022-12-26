export function intHash(input: number): number {
  let result = input;
  result = result + 0x7ed55d16 + (result << 12);
  result = result ^ 0xc761c23c ^ (result >> 19);
  result = result + 0x165667b1 + (result << 5);
  result = (result + 0xd3a2646c) ^ (result << 9);
  result = result + 0xfd7046c5 + (result << 3);
  result = result ^ 0xb55a4f09 ^ (result >> 16);
  return result;
}
