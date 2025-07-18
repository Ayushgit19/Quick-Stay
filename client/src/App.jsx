import React from 'react'
import NavBar from './components/NavBar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/home'
import Footer from './components/Footer'
import AllRooms from './pages/AllRooms'
import RoomDetails from './pages/RoomDetails'
import MyBookings from './pages/MyBookings'
import HotelReg from './components/HotelReg'
import Layout from './pages/Hotel-Owner/Layout'
import DashBoard from './pages/Hotel-Owner/DashBoard'
import AddRoom from './pages/Hotel-Owner/AddRoom'
import ListRoom from './pages/Hotel-Owner/ListRoom'



const App = () => {

  const isOwnerPath = useLocation().pathname.includes("owner")

  return (
    <div>
      {!isOwnerPath && <NavBar />}
      {false && <HotelReg />}
      <div className='min-h-[70vh]'>
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/rooms' element={<AllRooms />}/>
          <Route path='/rooms/:id' element={<RoomDetails />}/>
          <Route path='/my-bookings' element={<MyBookings />}/>
          <Route path='/owner' element={<Layout />}>
            <Route index element={<DashBoard />} />
            <Route path='add-room' index element={<AddRoom />} />
            <Route path='list-room' index element={<ListRoom />} />
          </Route>
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App