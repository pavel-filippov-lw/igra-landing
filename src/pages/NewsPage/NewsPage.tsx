import { FC } from "react"

import { PageLayout } from "~/Components"

import { newsItems } from '~/Components/LatestNews/newsData'
import classes from './NewsPage.module.scss'

export const NewsPage: FC = () => {
  return (
    <PageLayout hideBg>
      <div className={classes.root}>
        <h1 className={classes.title}>Latest News</h1>
        <div className={classes.newsGrid}>
          {newsItems.map((item, index) => (
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
      </div>
    </PageLayout>
  )
}
