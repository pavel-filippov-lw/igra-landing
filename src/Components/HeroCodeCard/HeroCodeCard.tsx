import clsx from "clsx"
import { forwardRef } from "react"

import { Button } from "~/shared/ui"

import classes from './HeroCodeCard.module.scss'

export interface HeroCodeCardProps {
  className?: string
}

export const HeroCodeCard = forwardRef<HTMLDivElement, HeroCodeCardProps>(({ className }, ref) => {
  return (
    <div ref={ref} className={clsx(classes.root, className)}>
      <div className={classes.title}>
        10M blocks / 9M transactions
        <br />
        10TPS
      </div>
      <pre className={classes.code}>
        <code>
          {`jLabel1.setFont(new java.awt.Font("Tahoma", java.awt.Font.BOLD, 14));
jLabel1.setText("Login Admin");
jLabel2.setFont(new java.awt.Font("Tahoma", java.awt.Font.PLAIN, 12));
jLabel2.setText("Username:");
jLabel3.setFont(new java.awt.Font("Tahoma", java.awt.Font.PLAIN, 12));
jLabel3.setText("Password:");
jButton1.setFont(new java.awt.Font("Tahoma", java.awt.Font.BOLD, 12));
jButton1.setText("Login");
layout.setVerticalGroup(
    layout.createSequentialGroup()
        .addGap(50, 50, 50)
        .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
            .addComponent(jLabel1)
            .addComponent(jButton1))
        .addGap(30, 30, 30);
);
`}
        </code>
      </pre>
      <Button variant='gradient' className={classes.button}>
        Learn more
      </Button>
    </div>
  )
})
