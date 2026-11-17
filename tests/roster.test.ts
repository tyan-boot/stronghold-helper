import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import test from 'node:test'
import traitsData from '../src/data/operator-traits.json' with { type: 'json' }
import { catalog, filterRoster, getAvailability } from '../src/roster.ts'

const operator = (name: string) => catalog.operators.find((item) => item.name === name)!

for (const [name, bans, expected] of [
  ['折桠', [], 'available'],
  ['折桠', ['乌萨斯'], 'banned'],
  ['折桠', ['不屈'], 'available'],
  ['折桠', ['乌萨斯', '不屈'], 'banned'],
  ['烛煌', ['炎'], 'available'],
  ['烛煌', ['炎', '维多利亚'], 'banned'],
  ['锏', ['谢拉格', '卡西米尔'], 'available'],
  ['锏', ['谢拉格', '卡西米尔', '莱塔尼亚'], 'banned'],
  ['摆渡人', ['坚守'], 'available'],
  ['摆渡人', ['坚守', '不屈'], 'banned'],
  ['灰喉', ['精准'], 'banned'],
  ['魔王', ['调和'], 'banned'],
  ['Mon3tr', ['协防干员'], 'banned'],
] as const) {
  test(`${name} / ${bans.join('、') || '无 Ban'} → ${expected}`, () => {
    assert.equal(getAvailability(operator(name), new Set(bans)).status, expected)
  })
}

test('等级、盟约、状态取交集，筛选不修改 Ban', () => {
  const bans = new Set(['乌萨斯'])
  const result = filterRoster(bans, { tier: 1, covenants: ['乌萨斯'], status: 'banned' })
  assert.deepEqual(result.map((item) => item.name), ['折桠', '烈夏'])
  assert.deepEqual([...bans], ['乌萨斯'])
  assert.equal(filterRoster(bans, { tier: 6, covenants: ['不屈'], status: 'banned' }).length, 0)
})

test('多选盟约取交集，并与等级、状态同时生效', () => {
  const covenants = ['乌萨斯', '不屈']
  const result = filterRoster(new Set(), { tier: 0, covenants, status: 'all' })
  assert.ok(result.some((item) => item.name === '折桠'))
  assert.ok(result.every((item) => covenants.every((name) => item.covenants.includes(name))))
  assert.ok(!result.some((item) => item.name === '烈夏'))
  assert.ok(!result.some((item) => item.name === '摆渡人'))
  assert.deepEqual(
    filterRoster(new Set(['乌萨斯']), { tier: 1, covenants, status: 'banned' }).map((item) => item.name),
    ['折桠'],
  )
  assert.deepEqual(covenants, ['乌萨斯', '不屈'])
})

test('无共同盟约的组合返回空结果', () => {
  assert.equal(filterRoster(new Set(), { tier: 0, covenants: ['乌萨斯', '炎'], status: 'all' }).length, 0)
})

test('无 Ban 时全部可用，全 Ban 时全部禁用，计数完整', () => {
  const all = { tier: 0, covenants: [], status: 'all' } as const
  assert.equal(filterRoster(new Set(), all).filter((item) => item.status === 'available').length, catalog.operators.length)
  const bans = new Set(catalog.covenants.map((item) => item.name))
  assert.equal(filterRoster(bans, all).filter((item) => item.status === 'banned').length, catalog.operators.length)
})

test('已 Ban 干员稳定排到最后，清空 Ban 后恢复原顺序', () => {
  const bans = new Set(['乌萨斯', '炎'])
  const filters = { tier: 0, covenants: [], status: 'all' } as const
  const originalNames = catalog.operators.map((item) => item.name)
  const original = catalog.operators.map((item) => ({ ...item, ...getAvailability(item, bans) }))
  const result = filterRoster(bans, filters)

  assert.ok(result.some((item) => item.status === 'banned'))
  assert.ok(result.some((item) => item.status === 'available'))
  assert.deepEqual(result.map((item) => item.name), [
    ...original.filter((item) => item.status !== 'banned').map((item) => item.name),
    ...original.filter((item) => item.status === 'banned').map((item) => item.name),
  ])
  assert.deepEqual(catalog.operators.map((item) => item.name), originalNames)
  assert.deepEqual(filterRoster(new Set(), filters).map((item) => item.name), originalNames)
})

test('名称、全拼和首字母搜索与现有筛选取交集', () => {
  const filters = { tier: 0, covenants: [], status: 'all' } as const
  for (const [search, name] of [
    ['米娅', '阿米娅'],
    ['amiya', '阿米娅'],
    [' AMY ', '阿米娅'],
    ['a mi ya', '阿米娅'],
    ['mon3tr', 'Mon3tr'],
    ['qiubai', '仇白'],
    ['wnwdly', '维娜·维多利亚'],
    ['lvgu', '旅骨'],
  ]) {
    assert.ok(filterRoster(new Set(), { ...filters, search }).some((item) => item.name === name), search)
  }
  assert.equal(filterRoster(new Set(), { ...filters, search: '   ' }).length, catalog.operators.length)
  assert.equal(filterRoster(new Set(), { ...filters, search: '不存在的干员' }).length, 0)

  const bans = new Set(['乌萨斯'])
  const selected = { tier: 1, covenants: ['乌萨斯'], status: 'banned', search: 'zheya' } as const
  assert.deepEqual(filterRoster(bans, selected).map((item) => item.name), ['折桠'])
  assert.equal(filterRoster(bans, { ...selected, tier: 6 }).length, 0)
  assert.equal(filterRoster(bans, { ...selected, covenants: ['炎'] }).length, 0)
  assert.equal(filterRoster(bans, { ...selected, status: 'available' }).length, 0)
  assert.deepEqual([...bans], ['乌萨斯'])
})

test('特质数据与干员名单一一对应，保留未单独列出的精锐特质', () => {
  assert.deepEqual(
    traitsData.operators.map((trait) => trait.name).sort(),
    catalog.operators.map((item) => item.name).sort(),
  )
  for (const trait of traitsData.operators) {
    assert.ok(trait.type.trim() && trait.normal.trim(), trait.name)
    assert.ok(trait.elite === null || trait.elite.trim(), trait.name)
  }
  assert.equal(traitsData.operators.find((trait) => trait.name === '杰克')?.elite, null)
})

test('静态数据等级、盟约引用与本地图片完整', () => {
  const covenants = new Set(catalog.covenants.map((item) => item.name))
  assert.equal(new Set(catalog.operators.map((item) => item.name)).size, catalog.operators.length)
  assert.equal(catalog.covenants.filter((item) => item.kind === 'primary').length, 10)
  assert.equal(catalog.covenants.filter((item) => item.kind === 'secondary').length, 15)
  for (const item of catalog.operators) {
    assert.ok(Number.isInteger(item.tier) && item.tier >= 1 && item.tier <= 6, item.name)
    assert.ok(item.covenants.length > 0 && item.covenants.every((name) => covenants.has(name)), item.name)
    assert.ok(existsSync(new URL(`../public${item.image}`, import.meta.url)), item.image)
    assert.ok(existsSync(new URL(`../public/images/professions/${item.profession}.png`, import.meta.url)), `${item.name} / ${item.profession}`)
  }
  for (const item of catalog.covenants) assert.ok(existsSync(new URL(`../public${item.logo}`, import.meta.url)), item.logo)
})
