
import {describe, it, expect, vi} from 'vitest';
import {calculator} from "./calculator";

describe("Vitest Fundamentals", () => {

  it.skip("should add two numbers", () =>{
    const result = calculator.add(2, 3);
    expect(result).toBe(5);
  });

});
