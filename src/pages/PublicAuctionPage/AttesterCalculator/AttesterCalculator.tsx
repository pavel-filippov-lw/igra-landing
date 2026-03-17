import { FC, useMemo, useCallback, useState } from 'react'
import clsx from 'clsx'

import node1Src from './assets/node1.png'
import node2Src from './assets/node2.png'
import classes from './AttesterCalculator.module.scss'

const TIMELINESS = 0.80
const ATT_PER_HR = 112.5
const SEC_PER_MO = 30 * 24 * 3600
const MONTHS = 24
const SLASH_RATE = 1 / 16
const PEN_MISSED = 1 / 11520
const PEN_INV = 1 / 4860

const PROFILES = [
  { missed: 0, invalid: 0, slashes: 0 },
  { missed: 80, invalid: 2, slashes: 0 },
  { missed: 400, invalid: 15, slashes: 0 },
  { missed: 960, invalid: 30, slashes: 2 },
]

const PROFILE_DESCS = [
  'No missed attestations, no invalid submissions, no slashes. Ideal node operation.',
  'Occasional reorgs and brief downtime. ~80 missed and 2 invalid attestations per month — minor stake penalties.',
  'Frequent downtime and missed windows. ~400 missed and 15 invalid per month — noticeable stake erosion.',
  'Mostly offline with slashing events. ~960 missed, 30 invalid per month, plus 2 slashes over 24 months — stake at risk of ejection.',
]

const PROFILE_LABELS = [
  { label: 'Great', color: '#3dd68c' },
  { label: 'Good', color: '#EED58A' },
  { label: 'Ok', color: '#CB9D4B' },
  { label: 'Nasty', color: '#f05252' },
]

const PROFILE_COLORS = ['var(--calc-green)', 'var(--calc-amber)', 'var(--calc-amber-dark)', 'var(--calc-red)']

function fmt(n: number, d = 0) {
  return n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })
}
function M(v: number) { return fmt(v / 1e6, 2) + 'M' }
function pct(v: number) { return (v * 100).toFixed(2) + '%' }
function kas(n: number) { return fmt(Math.abs(n), 3) + ' KAS' }
function ika(n: number) { return fmt(Math.abs(n), 0) + ' iKAS' }
function igr(n: number) { return fmt(Math.abs(n), 0) + ' IGRA' }

export const AttesterCalculator: FC = () => {
  // Main inputs
  const [stake, setStake] = useState(1000000)
  const [tps, setTps] = useState(1)
  const [profileIdx, setProfileIdx] = useState(0)

  // Advanced controls
  const [netS, setNetS] = useState(100000000)
  const [netG, setNetG] = useState(0.05)
  const [txGas, setTxGas] = useState(0.1)
  const [emActive, setEmActive] = useState(true)
  const [emApy, setEmApy] = useState(0.15)
  const [emMo, setEmMo] = useState(6)
  const [attGas, setAttGas] = useState(0.000018)

  const [advancedOpen, setAdvancedOpen] = useState(false)

  const profile = PROFILES[profileIdx]

  const result = useMemo(() => {
    const { missed, invalid, slashes } = profile
    const ejectThresh = stake * 3 / 16

    let effBal = stake
    let totIgRew = 0, totIkRew = 0, totGasKAS = 0
    let s6 = { ig: 0, ik: 0, gas: 0, share: 0 }
    let cum6 = { ig: 0, ik: 0, gas: 0, eff: stake }
    let ejectedMonth: number | null = null

    for (let t = 1; t <= MONTHS; t++) {
      const thisSlash = (slashes / MONTHS) * Math.min(stake * SLASH_RATE, effBal)
      const thisMiss = missed * Math.min(stake * PEN_MISSED, effBal)
      const thisInv = invalid * Math.min(stake * PEN_INV, effBal)
      effBal = Math.max(0, effBal - thisSlash - thisMiss - thisInv)

      if (ejectedMonth === null && effBal < ejectThresh && (slashes > 0 || missed > 0 || invalid > 0))
        ejectedMonth = t

      const netS_t = netS * Math.pow(1 + netG, t)
      const ejected = ejectedMonth !== null && t >= ejectedMonth
      const share = ejected ? 0 : Math.min(1, (effBal / netS_t) * TIMELINESS)

      const igRew_t = (emActive && t <= emMo) ? netS_t * (emApy / 12) * share : 0
      const ikRew_t = tps * txGas * SEC_PER_MO * share
      const gas_t = ATT_PER_HR * 24 * 30 * attGas

      totIgRew += igRew_t
      totIkRew += ikRew_t
      totGasKAS += gas_t

      if (t === 6) {
        s6 = { ig: igRew_t, ik: ikRew_t, gas: gas_t, share }
        cum6 = { ig: totIgRew, ik: totIkRew, gas: totGasKAS, eff: effBal }
      }
    }

    return { s6, cum6 }
  }, [stake, tps, profileIdx, netS, netG, txGas, emActive, emApy, emMo, attGas, profile])

  // Node overlay opacity: stake size + node behaviour penalty
  const BEHAVIOUR_FACTOR = [1, 0.85, 0.65, 0.4]
  const stakeRatio = (stake - 400000) / (10000000 - 400000)
  const nodeOpacity = stakeRatio * BEHAVIOUR_FACTOR[profileIdx]

  const handleToggleAdvanced = useCallback(() => {
    setAdvancedOpen(prev => !prev)
  }, [])

  return (
    <div className={classes.root}>
      {/* Advanced controls toggle */}
      <button
        className={classes.advancedToggle}
        aria-expanded={advancedOpen}
        onClick={handleToggleAdvanced}
      >
        <span>Advanced controls</span>
        <svg className={clsx(classes.chevronIcon, { [classes.chevronOpen]: advancedOpen })} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 6l4 4 4-4" />
        </svg>
      </button>

      {/* Calculator layout */}
      <div className={classes.calcLayout}>
        {/* Left column: inputs or advanced panel */}
        <div className={classes.colLeft}>
          {advancedOpen ? (
            <div className={classes.advancedPanel}>
              {/* Network section */}
              <div className={classes.advancedHeader}>
                <span />
                <button className={classes.advancedClose} onClick={() => setAdvancedOpen(false)}>
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4l8 8M12 4l-8 8" />
                  </svg>
                </button>
              </div>
              <div className={classes.field}>
                <div className={classes.fieldRow}>
                  <span className={classes.fieldLabel}>Total active network stake</span>
                  <span className={classes.fieldVal}>{M(netS)} IGRA</span>
                </div>
                <input type="range" min={10000000} max={500000000} step={5000000} value={netS} onChange={e => setNetS(+e.target.value)} />
              </div>
              <div className={classes.field}>
                <div className={classes.fieldRow}>
                  <span className={classes.fieldLabel}>Stake growth / month</span>
                  <span className={classes.fieldVal}>{fmt(netG * 100, 0)}% / mo</span>
                </div>
                <input type="range" min={0} max={0.2} step={0.01} value={netG} onChange={e => setNetG(+e.target.value)} />
              </div>
              <div className={classes.field}>
                <div className={classes.fieldRow}>
                  <span className={classes.fieldLabel}>iKAS gas per user tx</span>
                  <span className={classes.fieldVal}>{txGas.toFixed(2)} iKAS/tx</span>
                </div>
                <input type="range" min={0.01} max={1} step={0.01} value={txGas} onChange={e => setTxGas(+e.target.value)} />
              </div>
              <div className={classes.field}>
                <div className={classes.fieldRow}>
                  <span className={classes.fieldLabel}>L1 KAS gas / attestation</span>
                  <span className={classes.fieldVal}>{attGas.toFixed(6)} KAS</span>
                </div>
                <input type="range" min={0.000001} max={0.001} step={0.000001} value={attGas} onChange={e => setAttGas(+e.target.value)} />
              </div>

              {/* IGRA Emission section — bordered card */}
              <div className={classes.emissionCard}>
                <div className={classes.emissionHeader}>
                  <span className={classes.emissionTitle}>IGRA Emission {emActive ? 'Active' : 'Inactive'}</span>
                  <label className={classes.toggle}>
                    <input type="checkbox" checked={emActive} onChange={e => setEmActive(e.target.checked)} />
                    <span className={classes.toggleTrack} />
                    <span className={classes.toggleThumb} />
                  </label>
                </div>
                <div className={emActive ? undefined : classes.dimmed}>
                  <div className={classes.field}>
                    <div className={classes.fieldRow}>
                      <span className={classes.fieldLabel}>Emission APY</span>
                      <span className={classes.fieldVal}>{fmt(emApy * 100, 0)}% APY</span>
                    </div>
                    <input type="range" min={0.05} max={0.5} step={0.01} value={emApy} onChange={e => setEmApy(+e.target.value)} />
                  </div>
                  <div className={classes.field}>
                    <div className={classes.fieldRow}>
                      <span className={classes.fieldLabel}>Emission duration</span>
                      <span className={classes.fieldVal}>{emMo} mo</span>
                    </div>
                    <input type="range" min={1} max={24} step={1} value={emMo} onChange={e => setEmMo(+e.target.value)} />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={classes.inputsWrap}>
              {/* Stake */}
              <div className={classes.cardInner}>
                <div className={classes.cardTitle}>Stake</div>
                <div className={classes.field}>
                  <div className={classes.fieldRow}>
                    <span className={classes.fieldLabel}>Stake</span>
                    <span className={classes.fieldVal}>{M(stake)} IGRA</span>
                  </div>
                  <input type="range" min={400000} max={10000000} step={100000} value={stake} onChange={e => setStake(+e.target.value)} />
                </div>
              </div>

              {/* TPS */}
              <div className={classes.cardInner}>
                <div className={classes.field}>
                  <div className={classes.fieldRow}>
                    <span className={classes.fieldLabel}>Network TPS</span>
                    <span className={classes.fieldVal}>{tps.toFixed(1)} tx/s</span>
                  </div>
                  <input type="range" min={0.1} max={50} step={0.1} value={tps} onChange={e => setTps(+e.target.value)} />
                </div>
              </div>

              {/* Node Behaviour */}
              <div className={classes.cardInner}>
                <div className={classes.cardTitle}>Node Behaviour</div>
                <div className={classes.profileGrid}>
                  {PROFILE_LABELS.map((p, i) => (
                    <button
                      key={i}
                      className={clsx(classes.profileBtn, { [classes.profileActive]: profileIdx === i })}
                      onClick={() => setProfileIdx(i)}
                    >
                      <span className={classes.profileIcon} style={{ color: p.color }}>&#9679;</span>
                      <span className={classes.profileLabel}>{p.label}</span>
                    </button>
                  ))}
                </div>
                <p className={classes.profileDesc}>{PROFILE_DESCS[profileIdx]}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right: summary */}
        <div className={classes.colRight}>
          <div className={classes.card}>
            <div className={classes.cardTitle}>Summary after 6 months</div>
            <div className={classes.summaryGrid}>
              <div className={classes.summaryItem}>
                <span className={classes.summaryLabel}>IGRA earned</span>
                <span className={clsx(classes.summaryValue, classes.green)}>{igr(result.cum6.ig)}</span>
              </div>
              <div className={classes.summaryItem}>
                <span className={classes.summaryLabel}>iKAS earned</span>
                <span className={clsx(classes.summaryValue, classes.green)}>{ika(result.cum6.ik)}</span>
              </div>
              <div className={classes.summaryItem}>
                <span className={classes.summaryLabel}>KAS gas spent</span>
                <span className={clsx(classes.summaryValue, classes.red)}>{kas(result.cum6.gas)}</span>
              </div>
              <div className={classes.summaryItem}>
                <span className={classes.summaryLabel}>Reward pool share</span>
                <span className={clsx(classes.summaryValue, classes.teal)}>{pct(result.s6.share)}</span>
              </div>
              <div className={clsx(classes.summaryItem, classes.summaryFull)}>
                <span className={classes.summaryLabel}>Effective stake balance</span>
                <span className={classes.summaryValue} style={{ color: PROFILE_COLORS[profileIdx] }}>{igr(Math.max(0, result.cum6.eff))}</span>
              </div>
            </div>
            <div className={classes.nodeImage}>
              <div className={classes.nodePanel} />
              <img src={node1Src} alt="" className={classes.nodeBase} />
              <img src={node2Src} alt="" className={classes.nodeOverlay} style={{ opacity: nodeOpacity }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
