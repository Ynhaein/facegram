import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'
import FollowLayout from './layouts/FollowLayout'
import NewsfeedPage from './pages/public/NewsfeedPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ProfilePage from './pages/public/ProfilePage' 
import FollowingPage from './pages/public/FollowingPage'
import FollowersPage from './pages/public/FollowersPage'

const App = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<NewsfeedPage />}/>  
        <Route path='/profile/:username?' element={<ProfilePage />}/>   

        <Route element={<FollowLayout />}>
          <Route path='/following/:username?' element={<FollowingPage />}/>   
          <Route path='/followers/:username?' element={<FollowersPage />}/>   
        </Route>
      </Route> 

      <Route element={<AuthLayout />}>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
      </Route> 
    </Routes>
  )
}

export default App