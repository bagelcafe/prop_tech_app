import { Routes, Route } from 'react-router-dom'
import { Box } from '@mui/material'
import AppShell from './components/AppShell'
import RealEstatePage from './pages/RealEstatePage'
import KiwoomPage from './pages/KiwoomPage'
import ConditionSearchPage from './pages/ConditionSearchPage'
import StatsPage from './pages/StatsPage'

export default function App() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppShell>
        <Routes>
          <Route path="/" element={<RealEstatePage />} />
          <Route path="/kiwoom" element={<KiwoomPage />} />
          <Route path="/kiwoom/conditions" element={<ConditionSearchPage />} />
          <Route path="/stats" element={<StatsPage />} />
        </Routes>
      </AppShell>
    </Box>
  )
}
