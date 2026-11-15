import { describe, expect, it } from 'vitest'
import { FOOD_GUIDE, lookupFood, sameFood, searchFoods } from './foodGuide'
import { quipFor } from '../components/Psycho'

const top = (q: string) => searchFoods(q, FOOD_GUIDE)[0]

describe('food guide search', () => {
  it('answers common questions', () => {
    expect(top('apple')?.name).toBe('Apples')
    expect(top('Apples')?.status).toBe('limit')
    expect(top('grapes')?.name).toBe('Grapes (seedless)')
    expect(top('chocolate')?.status).toBe('forbidden')
    expect(top('avocado')?.status).toBe('forbidden')
    expect(top('cucumber')?.status).toBe('allowed')
  })
  it('understands plurals and other names', () => {
    expect(top('strawberry')?.name).toBe('Strawberries')
    expect(top('spuds')?.name).toBe('Potatoes')
    expect(top('ice cream')?.status).toBe('forbidden')
    expect(top('chicken feed')?.name).toBe('Cattle or poultry feed')
    expect(top('courgette')?.name).toBe('Zucchini')
  })
  it('handles words that look alike', () => {
    expect(top('water')?.name).toBe('Fresh clean water')
    expect(top('watermelon')?.name).toBe('Watermelon')
    expect(top('pine')?.status).toBe('forbidden')
    expect(top('pineapple')?.name).toBe('Pineapple')
    expect(top('green beans')?.status).toBe('allowed')
    expect(top('beans')?.status).toBe('forbidden')
    expect(top('apple')?.name).toBe('Apples')
  })
  it('covers medicine, chemicals, hay and garden plants', () => {
    expect(top('ibuprofen')?.status).toBe('forbidden')
    expect(top('rat poison')?.status).toBe('forbidden')
    expect(top('timothy')?.status).toBe('allowed')
    expect(top('daffodil')?.status).toBe('forbidden')
    expect(top('christmas tree')?.status).toBe('forbidden')
  })
  it('only answers when it is sure', () => {
    expect(lookupFood('rocks', FOOD_GUIDE).kind).not.toBe('answer')
    expect(lookupFood('appl', FOOD_GUIDE).top?.name).toBe('Apples')
    expect(lookupFood('appl', FOOD_GUIDE).kind).toBe('answer')
    expect(lookupFood('strawb', FOOD_GUIDE).kind).toBe('maybe')
    expect(lookupFood('rainbows', FOOD_GUIDE).kind).toBe('none')
  })
  it('jokes only on whole words', () => {
    expect(quipFor('human fingers')).toContain('Fingers')
    expect(quipFor('rainbows')).toContain('unicorn')
    expect(quipFor('rocks')).toContain('trash')
    expect(quipFor('lego')).toContain('trash')
    expect(quipFor('legos')).toContain('trash')
    expect(quipFor('grapes')).toBeNull()
    expect(quipFor('sunflower seeds')).toBeNull()
  })
  it('returns nothing for unknown foods', () => {
    expect(searchFoods('xylophone', FOOD_GUIDE)).toHaveLength(0)
  })
  it('matches names regardless of case and plurals', () => {
    expect(sameFood('Carrots', 'carrot')).toBe(true)
    expect(sameFood('Pears', 'Peaches & plums')).toBe(false)
  })
  it('has no duplicate names', () => {
    const names = FOOD_GUIDE.map((f) => f.name.toLowerCase())
    expect(new Set(names).size).toBe(names.length)
  })
  it('gives a reason for every food you should not feed', () => {
    expect(FOOD_GUIDE.filter((f) => f.status === 'forbidden' && !f.notes)).toHaveLength(0)
  })
})
