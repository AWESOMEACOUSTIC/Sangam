import React from 'react'
import Hero from '../components/Hero'
import WhatToWatch from '../components/WhatToWatch'

function HomePage() {
  return (
    <div className='bg-black min-h-screen'>
      <Hero />
      <WhatToWatch />
    </div>
  )
}

export default HomePage