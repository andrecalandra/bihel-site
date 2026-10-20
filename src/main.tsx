import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const rootEl = document.getElementById('root')!
// As páginas de serviço (geradas no build) marcam o #root com data-service="<slug>".
const serviceSlug = rootEl.dataset.service

if (serviceSlug) {
  // carregado só nessas páginas: a home não paga o peso desse código
  void import('./ServicePage.tsx').then(({ default: ServicePage }) => {
    createRoot(rootEl).render(
      <StrictMode>
        <ServicePage slug={serviceSlug} />
      </StrictMode>,
    )
  })
} else {
  createRoot(rootEl).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
