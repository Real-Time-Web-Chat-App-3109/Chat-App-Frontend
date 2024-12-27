import { Route, Routes } from "react-router-dom"
import { Navbar } from "./Component/Navbar"
import { HomePage } from "./Pages/HomePage"
import { SignUpPage } from "./Pages/SignUpPage"
import { LoginPage } from "./Pages/LoginPage"
import { SettingsPage } from "./Pages/SettingsPage"
import { ProfilePage } from "./Pages/ProfilePage"


function App() {
  

  return (
    <>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />}/>
          <Route path="/signup" element={<SignUpPage />}/>
          <Route path="/login" element={<LoginPage />}/>
          <Route path="/settings" element={<SettingsPage />}/>
          <Route path="/profile" element={<ProfilePage />}/>
        </Routes>
      </div>
    </>
  )
}

export default App
