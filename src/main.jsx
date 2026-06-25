import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './Home.jsx'
import Product from './Product.jsx'
import Login from './Login.jsx'
import Register from './Register.jsx'
import Profile from './Profile.jsx'
import Order from './Order.jsx'
import MyOrders from './Myorders.jsx'
import Payment from './payment.jsx'
import PaymentSuccess from './Paymentsuccess.jsx'
import Contact from './Contact.jsx'
import OrderNav from './OrderNav.jsx'
import Guide from './Guide.jsx'
import ForgetPassword from './Forgetpassword.jsx'
import Admin from './Admin.jsx'


import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  { path: '/home', element: <Home /> },
  { path: '/product', element: <Product /> },
  { path: '/', element: <Login /> },
  {path:'/forgetpassword',element:<ForgetPassword/>},
  { path: '/register', element: <Register /> },
  { path: '/profile', element: <Profile /> },
  { path: '/order', element: <Order /> },
  { path: '/order/:id', element: <Order /> },   
  { path: '/myorders', element: <MyOrders /> }, 
  {path:"/product/:category" ,element:<Product/>},
  {path:"/payment" ,element:<Payment/>},
  {path:"/paymentsuccess",element:<PaymentSuccess/>},
  {path:"/Myorders",element:<MyOrders/>},
  {path:"/contact",element:<Contact/>},
  {path:"/ordernav",element:<OrderNav/>},
  {path:"/guide",element:<Guide/>},
  {path:"/admin",element:<Admin/>}
  
 
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
