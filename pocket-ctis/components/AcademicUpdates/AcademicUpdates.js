import React from 'react'
import { Container } from 'react-bootstrap'

const AcademicUpdates = () => {
  return (
    <div
      className='rounded'
      style={{ width: '45%', overflow: 'hidden', borderRadius: '10px' }}
    >
      <div
        className='text-center p-2'
        style={{ backgroundColor: 'grey', color: 'white' }}
      >
        AcademicUpdates
      </div>
      <div className='p-2' style={{ height: 200, backgroundColor: 'white' }}>
        pfp | name surname | update date | update
      </div>
    </div>
  )
}

export default AcademicUpdates
