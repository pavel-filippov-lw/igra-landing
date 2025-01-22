import { FC } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes as ReactRoutes } from 'react-router-dom'

import { HeroPage, TeamPage } from '~/pages'
import { Routes, to } from '~/shared/lib'

export const AppRouter: FC = () => {
  return (
    <BrowserRouter>
      <ReactRoutes>
        <Route path="/" element={<Outlet />}>
          <Route index element={<Navigate to={to.hero()} />} />
          <Route path={Routes.hero} element={<HeroPage />} />
          <Route path={Routes.team} element={<TeamPage />} />
          <Route path="*" element={<Navigate to={to.hero()} />} />
        </Route>
      </ReactRoutes>
    </BrowserRouter>
  )
}
