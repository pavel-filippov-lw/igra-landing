import clsx from "clsx"
import { FC } from "react"

import classes from './Roadmap.module.scss'

const roadmapData = [
  {
    date: "2025 Q1",
    title: "Dromon:",
    description: "Invite-only devnet with core development infrastructure",
    position: "top",
    status: "completed",
  },
  {
    date: "2025 July",
    title: "Caravel:",
    description: "Incentivized testnet on Kaspa TN10",
    subdescription: "Pre-liquid",
    position: "bottom",
    status: "completed",
  },
  {
    date: "2025 Q3",
    title: "Public Nodes: Caravel",
    description: "Lestnet running on community operators hardware",
    position: "top",
    status: "completed",
  },
  {
    date: "2026 Jan",
    title: "Galleon:",
    description: "Closed Mainnet run by community node operators",
    position: "bottom",
    status: "completed",
  },
  {
    date: "2026 January",
    title: "Fluyt:",
    description: "Open Mainnet with Attestors and TGE",
    subdescription: "Audit by Sigma Prime",
    position: "top",
    status: "future",
  },
  {
    date: "2026 Feb",
    title: "Brigantine:",
    description: "Whitelisted Mainnet with core DeFi",
    position: "bottom",
    status: "future",
  },
  {
    date: "2026 Mar",
    title: "Frigate:",
    description: "Public Open Mainnet",
    position: "top",
    status: "future",
  },
]

export const Roadmap: FC = () => {
  return (
    <section className={classes.root}>
      <div className={classes.backgroundEffect} />
      <h2 className={classes.title}>Roadmap</h2>
      <div className={classes.timeline}>
        <div className={classes.glowEffect} />
        <div className={classes.timelineLine} />
        <div className={classes.timelineItems}>
          {roadmapData.map((item, index) => (
            <div
              key={index}
              className={clsx(
                classes.timelineItem,
                classes[item.position],
                classes[item.status],
              )}
            >
              <div className={classes.content}>
                <div className={classes.date}>{item.date}</div>
                <div className={classes.itemTitle}>{item.title}</div>
                <div className={classes.description}>
                  {item.description.split('\n').map((line, i) => (
                    <span key={i}>
                      {line}
                      <br />
                    </span>
                  ))}
                </div>
                {item.subdescription && (
                  <div className={classes.subdescription}>
                    {item.subdescription}
                  </div>
                )}
              </div>
              <div className={classes.connector} />
              <div className={classes.dot} />
            </div>
          ))}
        </div>
      </div>
      <div className={classes.mobileTimeline}>
        <div className={classes.mobileGlow} />
        <div className={classes.mobileLine} />
        <div className={classes.mobileItems}>
          {roadmapData.map((item, index) => (
            <div
              key={index}
              className={clsx(classes.mobileItem, classes[item.status])}
            >
              <div className={classes.mobileMarker}>
                <div className={classes.mobileDot} />
                <div className={classes.mobileConnector} />
              </div>
              <div className={classes.mobileContent}>
                <div className={classes.mobileDate}>{item.date}</div>
                <div className={classes.mobileTitle}>{item.title}</div>
                <div className={classes.mobileDescription}>
                  {item.description.split('\n').map((line, i) => (
                    <span key={i}>
                      {line}
                      <br />
                    </span>
                  ))}
                </div>
                {item.subdescription && (
                  <div className={classes.mobileSubdescription}>
                    {item.subdescription}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
