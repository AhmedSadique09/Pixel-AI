import { HashRouter, Navigate, Route, Routes, useParams } from 'react-router-dom'
import { Landing } from './Landing'
import { GuestApp } from './guest/GuestApp'
import { OperatorApp } from './operator/OperatorApp'

function GuestRoute() {
  const { facilityId = '' } = useParams()
  return <GuestApp key={facilityId} facilityId={facilityId} />
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/g/:facilityId" element={<GuestRoute />} />
        <Route path="/op" element={<OperatorApp />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  )
}
