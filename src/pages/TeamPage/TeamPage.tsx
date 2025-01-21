import { FC } from "react"

import { Header, Layout } from "~/Components"
import { Icon } from "~/shared/ui"

import classes from './Team.module.scss'

export const TeamPage: FC = () => {
  return (
    <div>
      <Header />
      <Layout>
        <h1>Team</h1>
        <div className={classes.container}>

          <div className={classes.box}>
            <div className={classes.description}>
                <div className={classes.name}>Pavel Emdin<br/>Captain</div>
                <div className={classes.text}><b>CEO</b><br/>Serial entrepreneur, 20+ years in software engineering, 7 yrs in building and growing crypto companies</div>
                <a href="https://www.linkedin.com/in/emdin/"><Icon name="linkedin" size={29} /></a>
            </div>
          </div>

          <div className={classes.box}>
            <div className={classes.description}>
                <div className={classes.name}>***** ********<br/>Navigator and Boatswain </div>
                <div className={classes.text}>CTO / VP R&D<br/>To be disclosed <br/><br/><br/></div>
                <a href="https://www.linkedin.com/in/emdin/"><Icon name="linkedin" size={29} /></a>
            </div>
          </div>

          <div className={classes.box}>
            <div className={classes.description}>
                <div className={classes.name}>Denis Mashkevich<br/>Superkargo</div>
                <div className={classes.text}>Chief of Strategy, Devops<br/>Founder and engineer with 25+ years in software development, 18+ years leading teams, ex teamlead @ Kaspa/DAGlabs Linkedin </div>
                <a href="https://www.linkedin.com/in/emdin/"><Icon name="linkedin" size={29} /></a>
            </div>
          </div>

          <div className={classes.box}>
            <div className={classes.description}>
                <div className={classes.name}>Roman Melnikov <br/>Passenger with a Map</div>
                <div className={classes.text}>Advisor<br/>Chief architect @ Kaspa/DAGlabs, chief architect for Kaspa smart contract integration; Crypto/ZKP software architect<br/><br/></div>
                <a href="https://www.linkedin.com/in/emdin/"><Icon name="linkedin" size={29} /></a>
            </div>
          </div>

          <div className={classes.box}>
            <div className={classes.description}>
                <div className={classes.name}>Mike Zak<br/>Sailor</div>
                <div className={classes.text}>Software engineer<br/>Seasoned software developer and an OG Kasper - led development of Kaspa up to the release of mainnet, ex core teamlead at DAGlabs</div>
                <a href="https://www.linkedin.com/in/emdin/"><Icon name="linkedin" size={29} /></a>
            </div>
          </div>

          <div className={classes.box}>
            <div className={classes.description}>
                <div className={classes.name}>Ilya Arosov<br/>Sailor</div>
                <div className={classes.text}>Software engineer<br/>Ex-Intel, embedded, C++<br/><br/><br/><br/></div>
                <a href="https://www.linkedin.com/in/emdin/"><Icon name="linkedin" size={29} /></a>
            </div>
          </div>

          <div className={classes.box}>
            <div className={classes.description}>
                <div className={classes.name}>**** ********<br/>Sailor</div>
                <div className={classes.text}>Software engineer<br/>To be disclosed<br/><br/><br/><br/></div>
                <a href="https://www.linkedin.com/in/emdin/"><Icon name="linkedin" size={29} /></a>
            </div>
          </div>

          <div className={classes.box}>
            <div className={classes.description}>
                <div className={classes.name}>****** *****<br/>Sailor</div>
                <div className={classes.text}>Software engineer<br/>To be disclosed<br/><br/><br/><br/></div>
                <a href="https://www.linkedin.com/in/emdin/"><Icon name="linkedin" size={29} /></a>
            </div>
          </div>

        </div>
      </Layout>
    </div>
  )
}
