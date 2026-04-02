import React from 'react'
import Navbar from './common/components/Navbar'
import Footer from './common/components/Footer'
import { Route, Routes, useLocation } from 'react-router-dom'
import HomePage from './features/home/pages/HomePage'
import Movie from './features/movie/pages/Movie'
import MovieDetail from './features/moviedetail/pages/MovieDetail'
import { Toaster } from 'react-hot-toast'
import { bookingRouteDefinitions } from './features/bookings/routes/bookingRoutes'

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
        {bookingRouteDefinitions.map((routeDefinition) => (
          <Route
            key={routeDefinition.path}
            path={routeDefinition.path}
            element={routeDefinition.element}
          />
        ))}
      </Routes>
      { !isAdminRoute && <Footer /> }
    </>
  )
}

export default App