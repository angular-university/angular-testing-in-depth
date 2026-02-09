
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

  it("shows how mocking works", () => {
    const spy = vi.spyOn(calculator, "add").mockReturnValue(5);
    const result = calculator.add(2, 3);
    expect(result).toBe(5);
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(2, 3);
    const result2 = calculator.add(5, 5);
    expect(result2).toBe(10);
  })

  it("shows how a pure mock works", () => {
    const addMock = vi.fn().mockReturnValue(10);
    const result = addMock(5, 5);
    expect(result).toBe(10);
    expect(addMock).toHaveBeenCalledOnce();
    expect(addMock).toHaveBeenCalledWith(5, 5);
  })

  it("shows how mock clearing works", () => {
    const spy = vi.spyOn(calculator, "add");
    const result = calculator.add(2, 3);
    expect(result).toBe(5);
    expect(spy).toHaveBeenCalledOnce();
    spy.mockClear();
    const result2 = calculator.add(5, 5);
    expect(result2).toBe(10);
    expect(spy).toHaveBeenCalledOnce();
  })

  it.only("shows how mockReset() works for spies", () => {
    const spy = vi.spyOn(calculator, "add");
    spy.mockReturnValue(10);
    const result = calculator.add(2, 3);
    expect(result).toBe(10);
    expect(spy).toHaveBeenCalledOnce();
    spy.mockReset();
    const result2 = calculator.add(2, 3);
    expect(result2).toBe(5);
    expect(spy).toHaveBeenCalledOnce();

  })

  it.only("shows how mockReset() works for pure mocks", () => {
    const addMock = vi.fn().mockReturnValue(10);
    const result = addMock(5, 5);
    expect(result).toBe(10);
    expect(addMock).toHaveBeenCalledOnce();
    expect(addMock).toHaveBeenCalledWith(5, 5);
    addMock.mockReset();
    const result2 = addMock(5, 5);
    expect(result2).toBe(undefined);
    expect(addMock).toHaveBeenCalledOnce();
  })

});
