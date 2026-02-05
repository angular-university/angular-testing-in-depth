
import {describe, it, expect, vi} from 'vitest';
import {calculator} from "./calculator";

describe("Vitest Fundamentals", () => {

  it.skip("should add two numbers", () => {
    const result = calculator.add(2, 3);
    expect(result).toBe(5);
  })

  it("shows how spies work", () => {
    const spy = vi.spyOn(calculator, "add");
    const result = calculator.add(2, 3);
    expect(result).toBe(5);
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(2, 3);
  })

});
