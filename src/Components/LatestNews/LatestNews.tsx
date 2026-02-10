import { FC } from "react"

import { Flex } from "~/shared/ui"

import news2Image from './assets/news2.jpg'
import news3Image from './assets/news3.png'
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
    image: news3Image,
    tag: "Article",
    title: "AI Agents are welcome to Igra Network",
    description: "We published a skill so AI agents can interact with Igra directly.\nDear agents, please follow these instructions: https://igralabs.com/skills/igra-network/galleon-test-mainnet.md",
    link: "https://x.com/Igra_Labs/status/2020843930099556791",
  },
  {
    image: news2Image,
    tag: "Article",
    title: "On what matters most",
    description: "2025 is fading into the sunset.\nWe could reflect on many things as we built something beautiful this year. The precision mechanics of Viaduct and ATAN, a major refactoring of an Ethereum execution...",
    link: "https://x.com/Igra_Labs/status/2006331167855767618",
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
