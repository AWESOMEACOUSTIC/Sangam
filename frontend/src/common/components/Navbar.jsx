import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, Search, TicketPlus, X } from 'lucide-react';
import { useClerk, UserButton, useUser } from '@clerk/react';
import MagneticLink from './MagneticLink';

function Navbar() {

  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { user } = useUser();
  const { openSignIn } = useClerk();
  const navigate = useNavigate();

  return (
    <div className='fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5'>
      <Link to='/' className='max-md:flex-1'>
        <img src="logo" alt='Logo'
          className='w-36 h-auto'
        />
      </Link>
      <div className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium
      max-md:text-lg z-50 flex flex-col md:flex-row items-center max-md:justify-center gap-8 md:px-8 py-3 max-md:h-screen
      md:rounded-full border overflow-hidden transition-all duration-300
      bg-black/70 md:backdrop-blur-xl md:backdrop-saturate-150
      ${isScrolled
          ? 'md:bg-slate-950/35 md:border-white/15 md:shadow-[0_8px_30px_rgba(0,0,0,0.35)]'
          : 'md:bg-white/10 md:border-gray-300/20 md:shadow-none'}
      ${isOpen ? 'max-md:w-full' : 'max-md:w-0'}`}>
        <X
          className='md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer'
          onClick={() => setIsOpen(!isOpen)}
        />

        <MagneticLink>
          <Link to='/' onClick={() => { scrollTo(0, 0); setIsOpen(false) }}>
            Home
          </Link>
        </MagneticLink>
        <MagneticLink>
          <Link to='/' onClick={() => { scrollTo(0, 0); setIsOpen(false) }}>
            Movies
          </Link>
        </MagneticLink>
        <MagneticLink>
          <Link to='/' onClick={() => { scrollTo(0, 0); setIsOpen(false) }}>
            Theaters
          </Link>
        </MagneticLink>
        <MagneticLink>
          <Link to='/' onClick={() => { scrollTo(0, 0); setIsOpen(false) }}>
            Releases
          </Link>
        </MagneticLink>
        <MagneticLink>
          <Link to='/movietickets' onClick={() => { scrollTo(0, 0); setIsOpen(false) }}>
            Movie Tickets
          </Link>
        </MagneticLink>
      </div>
      <div className='flex items-center gap-8'>
        <Search className='max-md:hidden w-6 h-6 cursor-pointer' />
        {!user ? (
          <button
            onClick={openSignIn}
            className='px-4 py-1 sm:px-7 sm:py-2 bg-primary hover:bg-primary-full transition rounded-full font-medium'>
            Login
          </button>
        ) : (
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action label="My Bookings" labelIcon={<TicketPlus width={15} />}
                onClick={() => { navigate('/bookings') }}
              />
            </UserButton.MenuItems>
          </UserButton>
        )}

      </div>
      <Menu className='max-md:ml-4 md:hidden w-8 h-8 cursor-pointer'
        onClick={() => setIsOpen(!isOpen)}
      />
    </div>
  )
}

export default Navbar