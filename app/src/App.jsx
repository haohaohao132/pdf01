import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import ToolPage from './pages/ToolPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/tool/:id" element={<ToolPage />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  )
}
