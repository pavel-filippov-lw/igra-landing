import { FC } from "react"
import { Link } from "react-router-dom"

import { Flex } from "~/shared/ui"
import { to } from "~/shared/lib"

import { newsItems } from './newsData'
import classes from './LatestNews.module.scss'

export const LatestNews: FC = () => {
  return (
    <Flex
      flexDirection='column'
      alignItems='center'
      className={classes.root}
    >
      <h3 className={classes.title}>Latest News</h3>
      <div className={classes.newsGrid}>
        {newsItems.slice(0, 4).map((item, index) => (
          <a
            key={index}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className={classes.newsCard}
          >
            <div className={classes.imageWrapper}>
              <img src={item.image} alt={item.title} className={classes.image} />
            </div>
            <div className={classes.content}>
              <h4 className={classes.cardTitle}>{item.title}</h4>
              <p className={classes.description}>{item.description}</p>
            </div>
          </a>
        ))}
      </div>
      <Link
        to={to.news()}
        className={classes.readAll}
        onClick={() => document.getElementById('root')?.scrollTo({ top: 0 })}
      >
        Read all →
      </Link>
    </Flex>
  )
}
