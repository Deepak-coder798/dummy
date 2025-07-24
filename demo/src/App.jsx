import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './rrr'
import Form from './Form'
import NavBar from './NavBar'
import Signup from './Signup'
import Login from './Login'
import ProtectedRoute from './ProtectedRoute'

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
  </Routes>
  {/* <Footer /> */}
</Router>
</>
);

}

export default App;