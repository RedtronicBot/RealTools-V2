import { Route, Routes } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import Dashboard from "./pages/Dashboard/Dashboard"
import LeafletMap from "./pages/Map/Map"

function App() {
  return (
    <div className="font-ubuntu">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/map" element={<LeafletMap />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={5000} theme="dark" />
    </div>
  )
}

export default App
