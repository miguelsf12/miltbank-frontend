import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Componentes
import Container from "./components/layout/Container"
import Login from './components/pages/Auth/Login'
import Register from './components/pages/Auth/Register'
import Welcome from './components/pages/Welcome'
import Message from './components/layout/Message'
import ForgotPassword from './components/pages/Auth/ForgotPassword'
import Home from './components/pages/Home'
import Pix from './components/pages/PixPaymentMethod/Pix'
import RegisterKey from './components/pages/PixPaymentMethod/RegisterKey'
import PixPay from './components/pages/PixPaymentMethod/PixPay'
import ConfirmPayment from './components/pages/PixPaymentMethod/ConfirmPayment'
import Review from './components/pages/PixPaymentMethod/Review'
import PaymentConcluded from './components/pages/PixPaymentMethod/PaymentConcluded'
import TransferDetailPage from './components/pages/PixPaymentMethod/TransferDetailPage'

// Context
import { UserProvider } from './context/UserContext'

function App() {
  return (
    <Router>
      <UserProvider>
        <Container>
          <Message />
          <Routes>
            <Route path='/transference/:id' element={<TransferDetailPage />}></Route>
            <Route path='/paymentconcluded/:id' element={<PaymentConcluded />}></Route>
            <Route path='/review' element={<Review />}></Route>
            <Route path='/confirmpayment' element={<ConfirmPayment />}></Route>
            <Route path='/pixpay' element={<PixPay />}></Route>
            <Route path='/registerkey' element={<RegisterKey />}></Route>
            <Route path='/pix' element={<Pix />}></Route>
            <Route path='/home' element={<Home />} />

            <Route path='/forgotpassword' element={<ForgotPassword />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/' element={<Welcome />} />
          </Routes>
        </Container>
      </UserProvider>
    </Router>
  )
}

export default App
