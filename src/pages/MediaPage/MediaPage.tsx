import { FC, useMemo, useState } from "react"

import { PageLayout } from "~/Components"

import { mediaItems, MediaCategory } from './mediaData'
import classes from './MediaPage.module.scss'

const ALL = 'All'

const categoryOrder: MediaCategory[] = ['Talk', 'Podcast', 'Video', 'Tutorial']

export const MediaPage: FC = () => {
  const [year, setYear] = useState<number | typeof ALL>(ALL)
  const [category, setCategory] = useState<MediaCategory | typeof ALL>(ALL)

  const years = useMemo(
    () => Array.from(new Set(mediaItems.map((i) => i.year))).sort((a, b) => b - a),
    []
  )

  const categories = useMemo(
    () =>
      categoryOrder.filter((c) => mediaItems.some((i) => i.category === c)),
    []
  )

  const filtered = useMemo(
    () =>
      mediaItems.filter(
        (i) =>
          (year === ALL || i.year === year) &&
          (category === ALL || i.category === category)
      ),
    [year, category]
  )

  return (
    <PageLayout hideBg>
      <div className={classes.root}>
        <h1 className={classes.title}>Talks &amp; Media</h1>

        <div className={classes.filters}>
          <div className={classes.filterRow}>
            <span className={classes.filterLabel}>Year</span>
            <div className={classes.pills}>
              <button
                type="button"
                className={`${classes.pill} ${year === ALL ? classes.pillActive : ''}`}
                onClick={() => setYear(ALL)}
              >
                All
              </button>
              {years.map((y) => (
                <button
                  key={y}
                  type="button"
                  className={`${classes.pill} ${year === y ? classes.pillActive : ''}`}
                  onClick={() => setYear(y)}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>

          <div className={classes.filterRow}>
            <span className={classes.filterLabel}>Category</span>
            <div className={classes.pills}>
              <button
                type="button"
                className={`${classes.pill} ${category === ALL ? classes.pillActive : ''}`}
                onClick={() => setCategory(ALL)}
              >
                All
              </button>
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`${classes.pill} ${category === c ? classes.pillActive : ''}`}
                  onClick={() => setCategory(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={classes.list}>
          {filtered.length === 0 ? (
            <div className={classes.empty}>No media for this selection.</div>
          ) : (
            filtered.map((item, index) => (
              <a
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className={classes.row}
              >
                <div className={classes.thumbnail}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className={classes.image}
                    style={item.imagePosition ? { objectPosition: item.imagePosition } : undefined}
                  />
                </div>
                <h2 className={classes.rowTitle}>{item.title}</h2>
                <p className={classes.description}>{item.description}</p>
                <span className={classes.category}>{item.category}</span>
              </a>
            ))
          )}
        </div>
      </div>
    </PageLayout>
  )
}
