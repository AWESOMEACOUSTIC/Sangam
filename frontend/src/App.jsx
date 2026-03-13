import React from 'react'
import Navbar from './common/components/Navbar'
import { Route, Routes } from 'react-router-dom'
import HomePage from './features/home/pages/HomePage'
import Movie from './features/movie/pages/Movie'
import MovieDetail from './features/moviedetail/pages/MovieDetail'
import SeatLayout from './features/seatdetails/pages/SeatLayout'

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element= {<HomePage />} />
        <Route path='/movies' element= {<Movie />} />
        <Route path='/movies/:id' element= {<MovieDetail />} />
        <Route path='/movies/:id/:date' element= {<SeatLayout />} />
      </Routes>
    </>
  )
}

export default App