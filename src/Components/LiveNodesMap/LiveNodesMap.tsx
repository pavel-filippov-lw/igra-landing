import { FC, useEffect, useState, useRef, useCallback } from 'react'
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps'

import classes from './LiveNodesMap.module.scss'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'
const NODES_API = 'https://igra-nodes-proxy-bfec81860b1a.herokuapp.com/nodes'

interface Cluster {
  lat: number
  lon: number
  city: string
  country: string
  count: number
}

interface NodesResponse {
  clusters: Cluster[]
  totalNodes: number
  countries: number
}

// Static fallback when API is unreachable
const FALLBACK: NodesResponse = {
  clusters: [
    { lat: 60.17, lon: 24.93, city: 'Helsinki', country: 'Finland', count: 5 },
    { lat: 48.87, lon: 2.42,  city: 'Paris', country: 'France', count: 3 },
    { lat: 38.75, lon: -77.49, city: 'Virginia', country: 'United States', count: 3 },
    { lat: 49.44, lon: 11.02, city: 'Nuremberg', country: 'Germany', count: 2 },
    { lat: 50.48, lon: 12.36, city: 'Falkenstein', country: 'Germany', count: 1 },
    { lat: 49.03, lon: 8.36,  city: 'Karlsruhe', country: 'Germany', count: 1 },
    { lat: 52.21, lon: 4.42,  city: 'Katwijk', country: 'Netherlands', count: 1 },
    { lat: 47.27, lon: 8.85,  city: 'Zurich', country: 'Switzerland', count: 1 },
    { lat: 43.26, lon: 27.82, city: 'Varna', country: 'Bulgaria', count: 1 },
    { lat: 35.17, lon: 33.35, city: 'Nicosia', country: 'Cyprus', count: 1 },
    { lat: 35.69, lon: 139.69, city: 'Tokyo', country: 'Japan', count: 1 },
    { lat: 1.28,  lon: 103.85, city: 'Singapore', country: 'Singapore', count: 1 },
    { lat: -6.38, lon: 106.82, city: 'Jakarta', country: 'Indonesia', count: 1 },
  ],
  totalNodes: 22,
  countries: 11,
}

export const LiveNodesMap: FC = () => {
  const [data, setData] = useState<NodesResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [hoveredCluster, setHoveredCluster] = useState<Cluster | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const fetchNodes = useCallback(async () => {
    abortRef.current?.abort()
    const ctrl = new AbortController()
    abortRef.current = ctrl

    try {
      const res = await fetch(NODES_API, { signal: ctrl.signal })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json: NodesResponse = await res.json()
      setData(json)
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return
      setData(FALLBACK)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNodes()
    return () => { abortRef.current?.abort() }
  }, [fetchNodes])

  const { clusters, totalNodes, countries } = data ?? FALLBACK

  return (
    <div className={classes.root}>
      <div className={classes.stats}>
        <div className={classes.stat}>
          <span className={classes.statValue}>{loading ? '...' : totalNodes}</span>
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
              const r = cluster.count > 1 ? 5 + Math.min(cluster.count, 6) : 4
              const color = '#6BD1C3'

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
                  {cluster.count > 1 && (
                    <text textAnchor="middle" dominantBaseline="central" fill="#000" fontSize={9} fontWeight={700} fontFamily="sans-serif">
                      {cluster.count}
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
            <div className={classes.tooltipNode}>
              {hoveredCluster.count} {hoveredCluster.count === 1 ? 'node' : 'nodes'}
            </div>
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
