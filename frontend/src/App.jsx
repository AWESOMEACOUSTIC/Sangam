import React from 'react'
import Navbar from './common/components/Navbar'
import Footer from './common/components/Footer'
import { Route, Routes, useLocation } from 'react-router-dom'
import HomePage from './features/home/pages/HomePage'
import Movie from './features/movie/pages/Movie'
import MovieDetail from './features/moviedetail/pages/MovieDetail'
import { Toaster } from 'react-hot-toast'
import SeatLayoutPage from './features/bookings/seat-selection/pages/SeatLayoutPage'
import BookingConfirmationPage from './features/bookings/confirmation/pages/BookingConfirmationPage'
import MyBookingsPage from './features/bookings/history/pages/MyBookingsPage'

const App = () => {
  
  const isAdminRoute = useLocation().pathname.startsWith('/admin');
  
  return (
    <>
    <Toaster />
      { !isAdminRoute && <Navbar />}
      <Routes>
        <Route path='/' element= {<HomePage />} />
        <Route path='/movies' element= {<Movie />} />
        <Route path='/movie/:movieSlug' element= {<MovieDetail />} />
        <Route path='/movies/:id' element= {<MovieDetail />} />
        <Route path='/movies/:id/:date' element= {<SeatLayoutPage />} />
        <Route path='/movietickets' element= {<BookingConfirmationPage />} />
        <Route path='/bookings' element= {<MyBookingsPage />} />
      </Routes>
      { !isAdminRoute && <Footer /> }
    </>
  )
}

export default App