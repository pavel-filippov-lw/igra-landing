import { FC, useEffect, useState, useRef, useCallback } from 'react'
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps'

import classes from './LiveNodesMap.module.scss'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

// IP → geo mapping (resolved via ip-api.com batch)
const IP_GEO: Record<string, { lat: number; lon: number; city: string; country: string }> = {
  '91.98.179.75':    { lat: 50.48, lon: 12.36, city: 'Falkenstein', country: 'Germany' },
  '135.181.209.250': { lat: 60.17, lon: 24.93, city: 'Helsinki', country: 'Finland' },
  '15.235.226.121':  { lat: 1.28,  lon: 103.85, city: 'Singapore', country: 'Singapore' },
  '82.67.184.59':    { lat: 48.87, lon: 2.42, city: 'Paris', country: 'France' },
  '87.208.94.208':   { lat: 52.21, lon: 4.42, city: 'Katwijk', country: 'Netherlands' },
  '95.217.84.237':   { lat: 60.17, lon: 24.93, city: 'Helsinki', country: 'Finland' },
  '152.53.52.37':    { lat: 38.74, lon: -77.49, city: 'Virginia', country: 'United States' },
  '152.53.37.81':    { lat: 38.75, lon: -77.48, city: 'Virginia', country: 'United States' },
  '37.27.59.54':     { lat: 60.17, lon: 24.93, city: 'Helsinki', country: 'Finland' },
  '152.53.243.115':  { lat: 38.79, lon: -77.53, city: 'Virginia', country: 'United States' },
  '45.157.177.54':   { lat: 49.44, lon: 11.02, city: 'Nuremberg', country: 'Germany' },
  '54.64.184.227':   { lat: 35.69, lon: 139.69, city: 'Tokyo', country: 'Japan' },
  '95.217.73.85':    { lat: 60.17, lon: 24.93, city: 'Helsinki', country: 'Finland' },
  '82.102.61.12':    { lat: 35.17, lon: 33.35, city: 'Nicosia', country: 'Cyprus' },
  '152.53.186.140':  { lat: 49.03, lon: 8.36, city: 'Karlsruhe', country: 'Germany' },
  '89.217.36.126':   { lat: 47.27, lon: 8.85, city: 'Zurich', country: 'Switzerland' },
  '89.58.25.231':    { lat: 49.44, lon: 11.02, city: 'Nuremberg', country: 'Germany' },
  '65.108.133.166':  { lat: 60.17, lon: 24.93, city: 'Helsinki', country: 'Finland' },
  '84.238.206.98':   { lat: 43.26, lon: 27.82, city: 'Varna', country: 'Bulgaria' },
  '180.252.90.208':  { lat: -6.38, lon: 106.82, city: 'Jakarta', country: 'Indonesia' },
}

// Stable IP → display number. New nodes get appended; existing keep their number.
const IP_NODE_NUMBER: Record<string, number[]> = {
  '91.98.179.75':    [1],
  '135.181.209.250': [2],
  '15.235.226.121':  [3],
  '82.67.184.59':    [4, 5, 6],
  '87.208.94.208':   [7],
  '95.217.84.237':   [8],
  '37.27.59.54':     [9],
  '95.217.73.85':    [10],
  '65.108.133.166':  [11],
  '152.53.52.37':    [12],
  '152.53.37.81':    [13],
  '152.53.243.115':  [14],
  '45.157.177.54':   [15],
  '89.58.25.231':    [16],
  '152.53.186.140':  [17],
  '54.64.184.227':   [18],
  '82.102.61.12':    [19],
  '89.217.36.126':   [20],
  '84.238.206.98':   [21],
  '180.252.90.208':  [22],
}

// Fallback node list (one entry per node; duplicates = multiple nodes on same IP)
const FALLBACK_IPS: string[] = [
  '91.98.179.75', '135.181.209.250', '15.235.226.121',
  '82.67.184.59', '82.67.184.59', '82.67.184.59',
  '87.208.94.208', '95.217.84.237', '37.27.59.54',
  '95.217.73.85', '65.108.133.166',
  '152.53.52.37', '152.53.37.81', '152.53.243.115',
  '45.157.177.54', '89.58.25.231', '152.53.186.140',
  '54.64.184.227', '82.102.61.12',
  '89.217.36.126', '84.238.206.98', '180.252.90.208',
]

interface NodeInfo {
  nodeId: string
  ip: string
  status: 'healthy' | 'behind' | 'stalled'
}

interface Cluster {
  lat: number
  lon: number
  city: string
  country: string
  nodes: NodeInfo[]
}

interface StatusResponse {
  nodes: Array<{ node_id: string; ip_address: string; status: string; blocks_behind_consensus: number }>
  push_nodes: Array<{ node_id: string; ip_address: string; blocks_behind_consensus: number }>
  stalled_nodes: Record<string, { is_stalled: boolean }>
}

function parseNodes(data: StatusResponse): NodeInfo[] {
  const nodes: NodeInfo[] = []

  for (const n of data.nodes) {
    nodes.push({
      nodeId: n.node_id,
      ip: n.ip_address,
      status: n.status === 'healthy' ? 'healthy' : 'behind',
    })
  }

  for (const n of data.push_nodes) {
    const isStalled = data.stalled_nodes[n.node_id]?.is_stalled
    nodes.push({
      nodeId: n.node_id,
      ip: n.ip_address,
      status: isStalled ? 'stalled' : Math.abs(n.blocks_behind_consensus) > 100 ? 'behind' : 'healthy',
    })
  }

  return nodes
}

function clusterNodes(nodes: NodeInfo[]): Cluster[] {
  const groups = new Map<string, Cluster>()

  for (const node of nodes) {
    const geo = IP_GEO[node.ip]
    if (!geo) continue

    const key = `${Math.round(geo.lat)},${Math.round(geo.lon)}`
    const existing = groups.get(key)
    if (existing) {
      existing.nodes.push(node)
    } else {
      groups.set(key, { lat: geo.lat, lon: geo.lon, city: geo.city, country: geo.country, nodes: [node] })
    }
  }

  return Array.from(groups.values())
}

export const LiveNodesMap: FC = () => {
  const [clusters, setClusters] = useState<Cluster[]>([])
  const [loading, setLoading] = useState(true)
  const [hoveredCluster, setHoveredCluster] = useState<Cluster | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const fetchStatus = useCallback(async () => {
    abortRef.current?.abort()
    const ctrl = new AbortController()
    abortRef.current = ctrl

    try {
      const res = await fetch('/api/status', { signal: ctrl.signal })
      const text = await res.text()
      if (!res.ok || text.startsWith('<!')) throw new Error('not json')
      const data: StatusResponse = JSON.parse(text)

      setClusters(clusterNodes(parseNodes(data)))
      setLoading(false)
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return
      // Fallback to hardcoded data when API is unreachable (dev mode / CORS)
      const fallbackNodes: NodeInfo[] = FALLBACK_IPS.map((ip, i) => ({
        nodeId: `node-${i + 1}`,
        ip,
        status: 'healthy' as const,
      }))
      setClusters(clusterNodes(fallbackNodes))
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStatus()
    return () => { abortRef.current?.abort() }
  }, [fetchStatus])

  const countries = new Set(clusters.map(c => c.country)).size
  const nodeCount = clusters.reduce((sum, c) => sum + c.nodes.length, 0)

  return (
    <div className={classes.root}>
      <div className={classes.stats}>
        <div className={classes.stat}>
          <span className={classes.statValue}>{loading ? '...' : nodeCount}</span>
          <span className={classes.statLabel}>nodes</span>
        </div>
        <div className={classes.stat}>
          <span className={classes.statValue}>{loading ? '...' : countries}</span>
          <span className={classes.statLabel}>countries</span>
        </div>
        <div className={classes.stat}>
          <span className={classes.statValue}>{loading ? '...' : 6}</span>
          <span className={classes.statLabel}>attesters</span>
        </div>
      </div>

      <div className={classes.mapContainer}>
        <ComposableMap
          projection="geoEquirectangular"
          projectionConfig={{ scale: 160, center: [30, 28] }}
          width={800}
          height={380}
          className={classes.map}
        >
          <ZoomableGroup minZoom={1} maxZoom={5}>
            <Geographies geography={GEO_URL}>
              {({ geographies }: { geographies: Array<{ rsmKey: string }> }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="rgba(255,255,255,0.06)"
                    stroke="rgba(255,255,255,0.12)"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: 'none' },
                      hover: { outline: 'none', fill: 'rgba(255,255,255,0.1)' },
                      pressed: { outline: 'none' },
                    }}
                  />
                ))
              }
            </Geographies>

            {clusters.map((cluster, i) => {
              const count = cluster.nodes.length
              const r = count > 1 ? 5 + Math.min(count, 6) : 4
              const allHealthy = cluster.nodes.every(n => n.status === 'healthy')
              const color = allHealthy ? '#6BD1C3' : '#EAFF6A'

              return (
                <Marker
                  key={i}
                  coordinates={[cluster.lon, cluster.lat]}
                  onMouseEnter={() => setHoveredCluster(cluster)}
                  onMouseLeave={() => setHoveredCluster(null)}
                >
                  <circle r={r + 8} fill="none" stroke={color} strokeWidth={1.5} strokeOpacity={0.4} className={classes.pulseRing} />
                  <circle r={r + 4} fill={color} fillOpacity={0.12} className={classes.glow} />
                  <circle r={r} fill={color} fillOpacity={0.9} className={classes.dot} />
                  {count > 1 && (
                    <text textAnchor="middle" dominantBaseline="central" fill="#000" fontSize={9} fontWeight={700} fontFamily="sans-serif">
                      {count}
                    </text>
                  )}
                </Marker>
              )
            })}
          </ZoomableGroup>
        </ComposableMap>

        {hoveredCluster && (
          <div className={classes.tooltip}>
            <div className={classes.tooltipCity}>{hoveredCluster.city}, {hoveredCluster.country}</div>
            {hoveredCluster.nodes.map((n) => {
              const nums = IP_NODE_NUMBER[n.ip]
              const ipNodes = hoveredCluster.nodes.filter(x => x.ip === n.ip)
              const ipIdx = ipNodes.indexOf(n)
              const num = nums?.[ipIdx] ?? '?'
              return (
                <div key={`${n.ip}-${ipIdx}`} className={classes.tooltipNode}>
                  <span className={`${classes.statusDot} ${n.status === 'healthy' ? classes.statusHealthy : classes.statusBehind}`} />
                  node-{num}
                </div>
              )
            })}
          </div>
        )}
      </div>

      <a
        href="https://grafana.igralabs.com/public-dashboards/56eb9e43b3854d38b1744f48675a82ac"
        target="_blank"
        rel="noopener noreferrer"
        className={classes.dashboardLink}
      >
        Open Grafana Dashboard &rarr;
      </a>
    </div>
  )
}
