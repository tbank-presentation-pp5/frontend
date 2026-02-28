import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import './index.css'
import App from './landing/Landing'
import Generate from './generate/Generate'
import PlanPage from './plans/PlanPage'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='/generate' element={<Generate />} />
        <Route path='/plans/:id' element={<PlanPage />} />
      </Routes>
    </QueryClientProvider>
  </BrowserRouter>,
)