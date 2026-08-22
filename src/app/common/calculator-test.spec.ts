import {describe, expect, it, vi} from 'vitest';
import {calculator} from './calculator';

describe("Calculator teste suite",()=>{
  it("Spy on calculator",()=>{
    const spyOnCal = vi.spyOn(calculator,'add')
    const res = calculator.add(1,1);
    expect(res).toBe(2)
    expect(spyOnCal).toHaveBeenCalledTimes(1)
  })

  it("Using mock on cal",()=>{
    const spyOnCal = vi.spyOn(calculator,'add').mockReturnValue(5);
    const res = calculator.add(1,1)
    expect(spyOnCal).toHaveBeenCalledOnce()
    expect(res).toBe(5)
  })
})
