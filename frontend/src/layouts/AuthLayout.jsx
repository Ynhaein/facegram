import { Outlet } from 'react-router-dom'
import { LiaCameraSolid } from 'react-icons/lia'
import { Link } from 'react-router-dom'

const AuthLayout = () => {
  return (
    <div className='font-primary flex flex-col md:flex-row h-screen bg-bg-primary'>
      <div className='flex-1 flex flex-col items-center justify-center p-10 text-center md:text-left'>
        <div className='max-w-md'>
          <div className='flex items-center justify-center md:justify-start gap-2 mb-4'>
            <Link to={'/'} className='h-14 w-14 flex items-center justify-center text-3xl rounded-2xl bg-primary/20 text-primary'>
              <LiaCameraSolid />
            </Link>
            <h1 className='text-4xl font-bold text-primary'>Facegram</h1>
          </div>
          <p className='text-text-secondary text-lg leading-relaxed'>
            Abadikan dan bagikan momen-momenmu dengan dunia. Terhubung dengan teman-teman, jelajahi konten kreatif, dan bangun cerita visualmu.
          </p>
        </div>
      </div>

      <div className='flex-1 flex items-center justify-center bg-bg-secondary p-10'>
        <div className='w-full max-w-md'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AuthLayout