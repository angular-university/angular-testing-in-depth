
import {describe, it, expect, vi} from 'vitest';
import {calculator} from "./calculator";

describe("Vitest Fundamentals", () => {

  it("should add two numbers", () => {
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

  it.only("shows how mocking works", () => {
    const spy = vi.spyOn(calculator, "add").mockReturnValue(5);
    const result = calculator.add(2, 3);
    expect(result).toBe(5);
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(2, 3);
    const result2 = calculator.add(5, 5);
    expect(result2).toBe(10);
  })

});
