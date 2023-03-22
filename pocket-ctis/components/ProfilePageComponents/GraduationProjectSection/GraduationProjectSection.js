import Link from 'next/link'
import React from 'react'
import { Container } from 'react-bootstrap'

const GraduationProjectSection = ({ graduationProject }) => {
    if (graduationProject.length == 0) {
        return (
            <Container
                className='px-0'
                style={{ height: 50, width: 350, color: '#999' }}
            >
                No data available
            </Container>
        )
    }
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
              <p className='m-0' style={{ fontSize: 15, color: 'gray' }}>
                  {graduationProject[0].product_name}
              </p>
              <p className='m-0' style={{ fontSize: 15, color: 'gray' }}>
                  {graduationProject[0].project_type} Project {
                      (graduationProject[0].project_type === "Instructor" ? (" - " + graduationProject[0].advisor) :
                          graduationProject[0].project_type === "Company" ? (" - " + graduationProject[0].company_name) : "")}
              </p>
            <Container>
              <div>{`${graduationProject[0].project_year} - ${graduationProject[0].semester}`}</div>
              <div>{graduationProject[0].graduation_project_description}</div>
                <div>{graduationProject[0].project_type} Project</div>
                <div>Advisor: {graduationProject[0].advisor}</div>
                <div>{graduationProject[0].project_description}</div>
            </Container>
          </div>
        </Link>}
      </Container>
    </div>
  )
}

export default GraduationProjectSection
