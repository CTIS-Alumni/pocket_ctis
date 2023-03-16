import Link from 'next/link'
import React from 'react'
import { Container } from 'react-bootstrap'

const GraduationProjectSection = ({ graduationProject }) => {
  return (
    <div>
      <Container
        style={{
          height: 300,
          overflowY: 'scroll',
        }}
      >
          {graduationProject.length > 0 && <Link href={'/user/graduationProjects'}>
          <div
            className='mb-3 pb-1'
            style={{
              cursor: 'pointer',
              fontSize: 14,
              color: '#999',
              borderBottom: '1px solid #ccc',
            }}
          >
            <p className='m-0' style={{ fontSize: 18, color: 'black' }}>
              {graduationProject[0].graduation_project_name}
            </p>
            <Container>
              <div>{`${graduationProject[0].project_year} - ${graduationProject[0].semester}`}</div>
              <div>{graduationProject[0].graduation_project_description}</div>
            </Container>
          </div>
        </Link>}
      </Container>
    </div>
  )
}

export default GraduationProjectSection
