import { DurationFormatPipe } from './duration-format.pipe';
import { describe, it, expect, beforeEach } from 'vitest';

describe('DurationFormatPipe', () => {
  let pipe: DurationFormatPipe;

  beforeEach(() => {
    pipe = new DurationFormatPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should format "05:30" as "05h 30m"', () => {
    const result = pipe.transform('05:30');
    expect(result).toBe('05h 30m');
  });

   it('should return an empty string if input is null or undefined', () => {
    // @ts-ignore 
    expect(pipe.transform(null)).toBe('');
    // @ts-ignore
    expect(pipe.transform(undefined)).toBe('');
  });

  it('should return the original value if it does not contain a colon', () => {
    const input = '90';
    expect(pipe.transform(input)).toBe(input);
  });

  it('should handle values with multiple colons by only formatting the first two parts', () => {
    expect(pipe.transform('01:20:45')).toBe('01h 20m');
  });
});