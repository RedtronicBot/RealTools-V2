import { Route, Routes } from "react-router-dom"
import Dashboard from "./pages/Dashboard/Dashboard"
import { ToastContainer } from "react-toastify"

function App() {
  return (
    <div className="font-ubuntu">
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={5000} theme="dark" />
    </div>
  )
}

export default App
