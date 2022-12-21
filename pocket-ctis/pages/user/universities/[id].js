import NavigationBar from '../../../components/navbar/NavigationBar'
import UserInfoSidebar from '../../../components/UserInfoSidebar/UserInfoSidebar'
import { Container, Badge, ListGroup, ListGroupItem } from 'react-bootstrap'
import { getTimePeriod } from '../../../helpers/dateHelpers'
import styles from '../../../components/WorkUpdates/WorkUpdates.module.scss'
import React from 'react'

const EducationInstitute = ({ edu_inst, users }) => {
  return (
    <div style={{ height: '100vh' }}>
      <NavigationBar />
      <div className='d-flex' style={{ height: '100%' }}>
        <UserInfoSidebar />
        <Container className='py-3'>
          <div
            className='d-flex justify-content-between align-items-start'
            style={{ width: '100%' }}
          >
            <div>
              <h5>{edu_inst.inst_name}</h5>
              <p>
                {edu_inst.city_name}{' '}
                {edu_inst.city_name && edu_inst.country_name && `-`}{' '}
                {edu_inst.country_name}
              </p>
            </div>
            {edu_inst.is_erasmus == 1 && (
              <Badge bg='primary' pill>
                ERASMUS
              </Badge>
            )}
          </div>
          <hr className='mx-auto' style={{ width: '80%' }} />
          <div className='my-2'>
            {users.length > 0
              ? `
            People who have studied at ${edu_inst.inst_name}:`
              : `No one from your department have studied at ${edu_inst.inst_name}.`}
          </div>
          <ListGroup variant='flush'>
            {users.map((user) => {
              const studyPeriod = getTimePeriod(
                user.start_date,
                user.end_date,
                user.is_current
              )
              return (
                <ListGroupItem key={user.id}>
                  <div>
                    <img
                      alt={user.first_name}
                      className={styles.user_avatar_48}
                      src={
                        '/profilepictures/' +
                        (user.record_visibility
                          ? user.pic_visibility
                            ? user.profile_picture
                            : 'defaultuser'
                          : 'defaultuser') +
                        '.png'
                      }
                    />
                  </div>
                  <div className='d-flex justify-content-between align-items'>
                    <h5>
                      {user.first_name} {user.last_name}
                    </h5>
                    <div>
                      {user.user_types.split(',').map((type, i) => (
                        <Badge className='mx-1' bg='info' pill key={i}>
                          {type.toLocaleUpperCase()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Container style={{ fontSize: 14 }}>
                    <p
                      className='my-0'
                      style={{ fontSize: 16, fontWeight: 'bold' }}
                    >
                      {user.degree_name}
                      {user.name_of_program && ` - ${user.name_of_program}`}
                    </p>
                    <p className='my-0'>{user.type_name}</p>
                    <p style={{ color: '#999' }} className='my-0'>
                      {studyPeriod}
                    </p>
                    <p style={{ color: '#999' }}>
                      {user.city_name && `${user.city_name} - `}
                      {user.country_name}
                    </p>
                  </Container>
                </ListGroupItem>
              )
            })}
          </ListGroup>
        </Container>
      </div>
    </div>
  )
}

export async function getServerSideProps(context) {
  const res = await fetch(
    'http://localhost:3000/api/educationinstitutes/' + context.params.id
  )
  const { data } = await res.json()

  const res2 = await fetch(
    'http://localhost:3000/api/educationrecords?edu_inst_id=' +
      context.params.id
  )
  const users = await res2.json()
  return { props: { edu_inst: data[0], users: users.edu } }
}

export default EducationInstitute
