import React from 'react'
import Navbar from './common/components/Navbar'
import Footer from './common/components/Footer'
import { Route, Routes, useLocation } from 'react-router-dom'
import HomePage from './features/home/pages/HomePage'
import Movie from './features/movie/pages/Movie'
import MovieDetail from './features/moviedetail/pages/MovieDetail'
import SeatLayout from './features/seatdetails/pages/SeatLayout'
import { Toaster } from 'react-hot-toast'
import MovieTickets from './features/movietickets/page/MovieTickets'

const App = () => {
  
  const isAdminRoute = useLocation().pathname.startsWith('/admin');
  
  return (
    <>
    <Toaster />
      { !isAdminRoute && <Navbar />}
      <Routes>
        <Route path='/' element= {<HomePage />} />
        <Route path='/movies' element= {<Movie />} />
        <Route path='/movies/:id' element= {<MovieDetail />} />
        <Route path='/movies/:id/:date' element= {<SeatLayout />} />
        <Route path='/movietickets' element= {<MovieTickets />} />
      </Routes>
      { !isAdminRoute && <Footer /> }
    </>
  )
}

export default App