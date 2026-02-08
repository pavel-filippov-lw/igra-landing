import { FC } from "react"

import { Flex, Icon } from "~/shared/ui"

import news1Image from './assets/news1.png'
import news2Image from './assets/news2.jpg'
import classes from './LatestNews.module.scss'

interface NewsItem {
  image: string
  tag: string
  title: string
  description: string
  link: string
}

const newsItems: NewsItem[] = [
  {
    image: news1Image,
    tag: "Article",
    title: "On what matters most",
    description: "2025 is fading into the sunset.\nWe could reflect on many things as we built something beautiful this year. The precision mechanics of Viaduct and ATAN, a major refactoring of an Ethereum execution...",
    link: "https://twitter.com",
  },
  {
    image: news2Image,
    tag: "Article",
    title: "Come sail your ships around me",
    description: "Ahoy! Our ship has crossed rough waters—reorgs, battles for storage, and a cold restart iceberg.\nWe're approaching El Dorado. The release schedule is the following:...",
    link: "https://twitter.com",
  },
]

export const LatestNews: FC = () => {
  return (
    <Flex
      flexDirection='column'
      alignItems='center'
      className={classes.root}
    >
      <h3 className={classes.title}>Latest News</h3>
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
              <div className={classes.tag}>
                <Icon name='twitter' size={16} />
                <span>Article</span>
              </div>
            </div>
            <div className={classes.content}>
              <h4 className={classes.cardTitle}>{item.title}</h4>
              <p className={classes.description}>{item.description}</p>
            </div>
          </a>
        ))}
      </div>
    </Flex>
  )
}
