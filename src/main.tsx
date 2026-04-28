import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import './index.css'
import App from './landing/Landing'
import Generate from './generate/Generate'
import PlanPage from './plans/PlanPage'
import Zero from './generate/GenerateZero'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Presentation from './presentations/Presentation'
import MyProjects from './my-projects/MyProjects'
import PresentationViewer from './presentations/PresentationViewer'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path="/generate" element={<Generate />} />
        <Route path="/generate/zero" element={<Zero />} />
        {/* <Route path="/generate/file" element={<File />} /> */}
        
        <Route path='/plans/:id' element={<PlanPage />} />
        <Route path='/presentations/:id' element={<Presentation />} />
        <Route path='/watch-presentations/:id' element={<PresentationViewer />} />
        <Route path='/my-projects' element={<MyProjects />} />
      </Routes>
    </QueryClientProvider>
  </BrowserRouter>,
)