import { formatMonth, formatPeriod, timeAgo, yearsSince } from './dates';

describe('dates', () => {
  it('counts full years since a month', () => {
    expect(yearsSince('2017-04', new Date(2026, 10, 6))).toBe(9);
    expect(yearsSince('2021-03', new Date(2026, 1, 1))).toBe(4);
    expect(yearsSince('2021-03', new Date(2026, 2, 1))).toBe(5);
  });

  it('never returns a negative number', () => {
    expect(yearsSince('2030-01', new Date(2026, 0, 1))).toBe(0);
  });

  it('formats months and periods', () => {
    expect(formatMonth('2019-04')).toBe('Apr 2019');
    expect(formatPeriod('2019-04', '2020-12')).toBe('Apr 2019 – Dec 2020');
    expect(formatPeriod('2021-03', null)).toBe('Mar 2021 – Present');
  });

  it('says how long ago something happened', () => {
    const now = new Date('2026-11-10T12:00:00Z');
    expect(timeAgo('2026-11-10T08:00:00Z', now)).toBe('today');
    expect(timeAgo('2026-11-09T08:00:00Z', now)).toBe('yesterday');
    expect(timeAgo('2026-11-05T12:00:00Z', now)).toBe('5 days ago');
    expect(timeAgo('2026-10-20T12:00:00Z', now)).toBe('3 weeks ago');
    expect(timeAgo('2026-06-10T12:00:00Z', now)).toBe('5 months ago');
    expect(timeAgo('2024-11-01T12:00:00Z', now)).toBe('2 years ago');
  });
});
