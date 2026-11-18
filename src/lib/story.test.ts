import { describe, expect, it } from 'vitest'
import { ageAt, exactAge, milesBetween, sortKey, STOPS, storyDate } from './story'

describe('life story', () => {
  it('sorts partial dates at the start of the period', () => {
    expect(sortKey('2018')).toBe('2018-01-01')
    expect(sortKey('2018-01')).toBe('2018-01-01')
    expect(sortKey('2018-01-29')).toBe('2018-01-29')
    expect(['2019-12-09', '2018', '2014-05-09'].sort((a, b) => sortKey(a).localeCompare(sortKey(b)))).toEqual(['2014-05-09', '2018', '2019-12-09'])
  })
  it('writes dates as exact as they are', () => {
    expect(storyDate('2014-05-09')).toBe('May 9, 2014')
    expect(storyDate('2018-01')).toBe('January 2018')
    expect(storyDate('2015', true)).toBe('About 2015')
  })
  it('gives his age at each moment', () => {
    expect(ageAt('2014-05-09', '2014-05-09')).toBe('his birthday!')
    expect(ageAt('2014-05-09', '2014-05-20')).toBe('11 days old')
    expect(ageAt('2014-05-09', '2016-03-04')).toBe('21 months old')
    expect(ageAt('2014-05-09', '2018-01-29')).toBe('3 years old')
    expect(ageAt('2014-05-09', '2026-11-19')).toBe('12 years old')
  })
  it('gives his exact age', () => {
    expect(exactAge('2014-05-09', '2026-11-17')).toBe('12 years, 6 months and 8 days')
    expect(exactAge('2014-05-09', '2015-05-09')).toBe('1 year, 0 months and 0 days')
  })
  it('measures the journey', () => {
    const legs = STOPS.slice(1).map((s, i) => milesBetween(STOPS[i], s))
    expect(legs[0]).toBeGreaterThan(700)
    expect(legs[2]).toBeLessThan(200)
  })
})
