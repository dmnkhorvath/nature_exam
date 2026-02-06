import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SimilarityGroupsPage from './pages/SimilarityGroupsPage'

function App() {
  return (
    <div className="min-h-screen bg-base-200">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/similarity-groups" element={<SimilarityGroupsPage />} />
      </Routes>
    </div>
  )
}

export default App
