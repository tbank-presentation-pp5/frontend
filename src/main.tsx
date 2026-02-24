import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import './index.css'
import App from './landing/Landing'
import Generate from './generate/Generate'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App/>}/>
      <Route path='/generate' element={<Generate/>}/>
    </Routes>
  </BrowserRouter>,
)