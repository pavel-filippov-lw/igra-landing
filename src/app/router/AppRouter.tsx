import { FC } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes as ReactRoutes } from 'react-router-dom'

import { AboutPage, BenefitsPage, EcosystemPage, HeroPage, ManifestoPage, PrivacyPage, TeamPage, VisionPage } from '~/pages'
import { Routes, to } from '~/shared/lib'

export const AppRouter: FC = () => {
  return (
    <BrowserRouter>
      <ReactRoutes>
        <Route path="/" element={<Outlet />}>
          <Route index element={<Navigate to={to.hero()} />} />
          <Route path={Routes.hero} element={<HeroPage />} />
          <Route path={Routes.team} element={<TeamPage />} />
          <Route path={Routes.manifesto} element={<ManifestoPage />} />
          <Route path={Routes.vision} element={<VisionPage />} />
          <Route path={Routes.ecosystem} element={<EcosystemPage />} />
          <Route path={Routes.privacy} element={<PrivacyPage />} />
          <Route path={Routes.benefits} element={<BenefitsPage />} />
          <Route path={Routes.about} element={<AboutPage />} />
          <Route path="*" element={<Navigate to={to.hero()} />} />
        </Route>
      </ReactRoutes>
    </BrowserRouter>
  )
}
