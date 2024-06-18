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

import Home from './components/pages/User/Home'
import Configurations from './components/pages/User/Configurations'
import MyAccount from './components/pages/User/MyAccount'
import Pix from './components/pages/PixPaymentMethod/Pix'
import RegisterKey from './components/pages/PixPaymentMethod/RegisterKey'
import PixPay from './components/pages/PixPaymentMethod/PixPay'
import ConfirmPayment from './components/pages/PixPaymentMethod/ConfirmPayment'
import Review from './components/pages/PixPaymentMethod/Review'
import PaymentConcluded from './components/pages/PixPaymentMethod/PaymentConcluded'
import TransferDetailPage from './components/pages/PixPaymentMethod/TransferDetailPage'
import ViewAllTransfers from './components/pages/PixPaymentMethod/ViewAllTransfers'

// Context
import { UserProvider } from './context/UserContext'

function App() {
  return (
    <Router>
      <UserProvider>
        <Container>
          <Message />
          <Routes>
            <Route path='/user/all-transfers' element={<ViewAllTransfers />}></Route>
            <Route path='/user/transference/:id' element={<TransferDetailPage />}></Route>
            <Route path='/payments/paymentconcluded/:id' element={<PaymentConcluded />}></Route>
            <Route path='/payments/review' element={<Review />}></Route>
            <Route path='/confirmpayment' element={<ConfirmPayment />}></Route>
            <Route path='/user/user/pixpay' element={<PixPay />}></Route>
            <Route path='/user/registerkey' element={<RegisterKey />}></Route>
            <Route path='/user/pix' element={<Pix />}></Route>
            <Route path='/user/configurations' element={<Configurations />}></Route>
            <Route path='/user/home' element={<Home />} />

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
