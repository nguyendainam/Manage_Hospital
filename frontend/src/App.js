import { path } from './untils/constants'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import HomeRouter from './router/HomeRouter'
import SystemsRouter from './router/Systems'

function App () {
  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route path={path.HOME} element={<HomeRouter />} />
          <Route path={path.HOMEPAGE} element={<HomeRouter />} />
          <Route path={path.SYSTEM} element={<SystemsRouter />} />
          <Route />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
