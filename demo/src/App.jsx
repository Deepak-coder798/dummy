import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import Home from './rrr'
import Form from './Form'
import NavBar from './NavBar'
import Signup from './Signup'
import Login from './Login'
import Profile from './pages/Profile'
import ProtectedRoute from './ProtectedRoute'
import './App.css'


const App = ()=>{
return(
<>
<Router>
  <NavBar />
  <Routes>
    <Route path='/' element={
       <ProtectedRoute>
          <Home />
      </ProtectedRoute>
      } />
    <Route path='/signup' element={<Signup />} />
     <Route path='/login' element={<Login />} />
    <Route path='/about' element={<ProtectedRoute>
                                    <Form />
                                   </ProtectedRoute>} />
    <Route path='/profile' element={<ProtectedRoute>
                                    <Profile />
                                   </ProtectedRoute>} />
<Route path='/profile/:id' element={<ProtectedRoute>
                                    <Profile />
                                   </ProtectedRoute>} />
    <Route path='*' element={<Navigate to={'/'} replace/>} />
  </Routes>
  {/* <Footer /> */}
</Router>
</>
);

}

export default App;