import { useState } from 'react'
import OperatorCard from './OperatorCard'
import { catalog, filterRoster, rulesSource, tierLabels, type StatusFilter } from './roster'
import './App.css'

const statusOptions = [
  { value: 'all', label: '全部' },
  { value: 'available', label: '可用' },
  { value: 'banned', label: '已 Ban' },
  { value: 'uncertain', label: '待核实' },
] as const

function App() {
  const [bans, setBans] = useState<Set<string>>(() => new Set())
  const [tier, setTier] = useState(0)
  const [covenants, setCovenants] = useState<string[]>([])
  const [disableBannedKinds, setDisableBannedKinds] = useState<string[]>([])
  const [status, setStatus] = useState<StatusFilter>('all')

  const roster = filterRoster(bans, { tier, covenants, status: 'all' })
  const visibleOperators = roster.filter((operator) => status === 'all' || operator.status === status)
  const counts = {
    all: roster.length,
    available: roster.filter((operator) => operator.status === 'available').length,
    banned: roster.filter((operator) => operator.status === 'banned').length,
    uncertain: roster.filter((operator) => operator.status === 'uncertain').length,
  }
  const hasFilters = tier !== 0 || covenants.length > 0 || disableBannedKinds.length > 0 || status !== 'all'

  function toggleBan(name: string, kind: string) {
    if (!bans.has(name) && disableBannedKinds.includes(kind)) {
      setCovenants((current) => current.filter((item) => item !== name))
    }

    setBans((current) => {
      const next = new Set(current)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  function toggleBannedFilters(kind: string, enabled: boolean) {
    setDisableBannedKinds((current) => enabled ? [...current, kind] : current.filter((item) => item !== kind))

    if (enabled) {
      const bannedNames = catalog.covenants
        .filter((item) => item.kind === kind && bans.has(item.name))
        .map((item) => item.name)
      setCovenants((current) => current.filter((name) => !bannedNames.includes(name)))
    }
  }

  function clearFilters() {
    setTier(0)
    setCovenants([])
    setDisableBannedKinds([])
    setStatus('all')
  }

  return (
    <>
      <a className="skip-link" href="#operators">跳转到干员列表</a>
      <header className="site-header">
        <div className="site-heading">
          <svg className="brand-mark" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <rect x="3" y="3" width="10" height="10" rx="1" />
            <rect x="19" y="3" width="10" height="10" rx="1" />
            <rect x="3" y="19" width="10" height="10" rx="1" />
            <path d="M19 24h10m-5-5v10" />
          </svg>
          <h1>卫戍协议助手</h1>
          <span className="edition">规程 · 干员图录</span>
        </div>
        <a className="source-link" href={catalog.source} target="_blank" rel="noreferrer">
          PRTS 数据来源
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M5 15 15 5M5 5h10v10" /></svg>
        </a>
      </header>

      <main>
        <section className="ban-panel" aria-labelledby="ban-title">
          <div className="section-heading">
            <div>
              <h2 id="ban-title">设置 Ban 位 <span className="selection-count">已选 {bans.size}</span></h2>
              <p>点选本局禁用的盟约，再次点击取消。干员状态实时更新。</p>
            </div>
            <button className="quiet-button" onClick={() => setBans(new Set())} disabled={bans.size === 0}>
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 7a6 6 0 1 1-.4 5M4 3v4h4" /></svg>
              清空 Ban
            </button>
          </div>

          {[
            { kind: 'primary', label: '核心盟约' },
            { kind: 'secondary', label: '附加盟约' },
          ].map((group) => (
            <div className="covenant-group" role="group" aria-label={`${group.label} Ban 设置`} key={group.kind}>
              <div className="group-heading"><h3>{group.label}</h3></div>
              <div className="covenant-buttons">
                {catalog.covenants.filter((item) => item.kind === group.kind).map((item) => (
                  <button
                    key={item.name}
                    className="covenant-button"
                    aria-pressed={bans.has(item.name)}
                    aria-label={`${item.name}，${bans.has(item.name) ? '已 Ban，点击取消' : '点击 Ban'}`}
                    onClick={() => toggleBan(item.name, item.kind)}
                  >
                    <span className="covenant-icon"><img src={item.logo} alt="" width="40" height="40" /></span>
                    <span className="covenant-name">{item.name}</span>
                    <svg className="ban-mark" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <circle cx="8" cy="8" r="5.5" /><path d="m4 4 8 8" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="roster-section" id="operators" aria-labelledby="roster-title" tabIndex={-1}>
          <div className="roster-heading">
            <div className="roster-title"><h2 id="roster-title">干员一览</h2><span>{catalog.operators.length} 名干员</span></div>
            <p>等级为卫戍协议等阶，非干员星级</p>
          </div>

          <div className="status-filters" role="group" aria-label="按干员状态筛选">
            {statusOptions.map((option) => (
              <button
                className={`status-filter status-${option.value}`}
                key={option.value}
                aria-pressed={status === option.value}
                onClick={() => setStatus(option.value)}
              >
                {option.label}<span>{counts[option.value]}</span>
              </button>
            ))}
          </div>

          <div className="filter-bar">
            <div className="tier-filter" role="group" aria-label="按等级筛选">
              <span className="filter-label">等级</span>
              {[0, 1, 2, 3, 4, 5, 6].map((value) => (
                <button key={value} aria-pressed={tier === value} onClick={() => setTier(value)} aria-label={value === 0 ? '全部等级' : `${value} 阶`}>
                  {value === 0 ? '全部' : tierLabels[value - 1]}
                </button>
              ))}
            </div>
            <div className="covenant-filter" role="group" aria-label="按盟约筛选">
              <div className="covenant-filter-heading">
                <button className="reset-filters" onClick={clearFilters} disabled={!hasFilters}>重置筛选</button>
              </div>
              <div className="covenant-filter-toggles">
                <span>禁用已 Ban：</span>
                {[
                  { kind: 'primary', label: '核心盟约' },
                  { kind: 'secondary', label: '附加盟约' },
                ].map((group) => (
                  <button
                    key={group.kind}
                    className="ban-filter-switch"
                    role="switch"
                    aria-label={`禁用已 Ban 的${group.label}筛选按钮`}
                    aria-checked={disableBannedKinds.includes(group.kind)}
                    onClick={() => toggleBannedFilters(group.kind, !disableBannedKinds.includes(group.kind))}
                  >
                    <span className="switch-track" aria-hidden="true" />
                    {group.label}
                  </button>
                ))}
              </div>
              {[
                { kind: 'primary', label: '核心盟约' },
                { kind: 'secondary', label: '附加盟约' },
              ].map((group) => (
                <div className="covenant-group" role="group" aria-label={`${group.label}筛选`} key={group.kind}>
                  <div className="group-heading"><h3>{group.label}</h3></div>
                  <div className="covenant-buttons">
                    {catalog.covenants.filter((item) => item.kind === group.kind).map((item) => (
                      <button
                        key={item.name}
                        className="covenant-button covenant-filter-button"
                        disabled={disableBannedKinds.includes(group.kind) && bans.has(item.name)}
                        aria-pressed={covenants.includes(item.name)}
                        aria-label={`${item.name}，${covenants.includes(item.name) ? '已选，点击取消' : '点击筛选'}`}
                        onClick={() => setCovenants((current) => current.includes(item.name)
                          ? current.filter((name) => name !== item.name)
                          : [...current, item.name])}
                      >
                        <span className="covenant-icon"><img src={item.logo} alt="" width="40" height="40" /></span>
                        <span className="covenant-name">{item.name}</span>
                        <svg className="filter-mark" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                          <path d="m4 8 3 3 5-6" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="results-summary" role="status" aria-live="polite" aria-atomic="true">
            <span>显示 <strong>{visibleOperators.length}</strong> / {catalog.operators.length} 名干员</span>
            <span>{bans.size === 0 ? '尚未设置 Ban，所有干员均可用' : `当前筛选：${counts.available} 可用 · ${counts.banned} 已 Ban · ${counts.uncertain} 待核实`}</span>
          </div>

          {visibleOperators.length > 0 ? (
            <ul className="operator-grid">
              {visibleOperators.map((operator) => <OperatorCard key={operator.name} operator={operator} bans={bans} />)}
            </ul>
          ) : (
            <div className="empty-state">
              <svg viewBox="0 0 40 40" fill="none" aria-hidden="true"><rect x="7" y="5" width="26" height="30" rx="3" /><path d="M13 14h14m-14 6h14m-14 6h7" /></svg>
              <h3>{status === 'banned' && bans.size === 0 ? '还没有干员被 Ban' : '没有符合条件的干员'}</h3>
              <p>{status === 'banned' && bans.size === 0 ? '在上方点选盟约，即可查看受影响的干员。' : '试试其他等级、盟约或状态；重置筛选不会清除 Ban。'}</p>
              <button className="primary-button" onClick={clearFilters}>查看全部干员</button>
            </div>
          )}
        </section>
      </main>

      <footer className="site-footer">
        <span>卫戍协议 · 规程</span>
        <span>名单与头像来自 PRTS · 本工具仅辅助查询，不代表游戏内实时结果</span>
        <a href={rulesSource} target="_blank" rel="noreferrer">规则来源</a>
      </footer>
    </>
  )
}

export default App
