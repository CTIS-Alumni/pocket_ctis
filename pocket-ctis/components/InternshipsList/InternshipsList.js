import Link from 'next/link'
import {
  Container,
  ListGroup,
  ListGroupItem,
  Badge,
  Row,
  Col,
} from 'react-bootstrap'
import styles from './InternshipsList.module.css'
import React from 'react'
import { getProfilePicturePath, getSemester } from '../../helpers/formatHelpers'

const Anonymous = () => {
  return (
    <ListGroupItem className={styles.listItem}>
      <Container>
        <Row>
          <Col md='auto'>
            <img
              className={styles.user_avatar_48}
              src={getProfilePicturePath()}
            />
          </Col>
          <Col>
            <h5>Anonymous</h5>
          </Col>
        </Row>
      </Container>
    </ListGroupItem>
  )
}

const InternshipsList = ({ internships }) => {
  return (
    <Container>
      <ListGroup variant='flush'>
        {internships.map((internship) => {
          if (internship.record_visibility == 0) {
            return <Anonymous key={internship.id} />
          }
          const profilePicture = getProfilePicturePath(
            internship.pic_visibility,
            internship.profile_picture
          )
          const internshipSemester = getSemester(
            internship.semester,
            internship.start_date
          )
          return (
            <ListGroupItem className={styles.listItem} key={internship.id}>
              <Link href={`/internship/companies/${internship.id}`}>
                <Container>
                  <Row>
                    <Col md='auto'>
                      <img
                        alt={internship.first_name}
                        className={styles.user_avatar_48}
                        src={profilePicture}
                      />
                    </Col>
                    <Col>
                      <div className='d-flex justify-content-between'>
                        <h5>
                          {`${internship.first_name} ${internship.last_name} - ${internship.company_name}`}
                        </h5>
                        <div>
                          {internship.user_types.split(',').map((type, i) => (
                            <Badge className='mx-1' bg='info' pill key={i}>
                              {type.toLocaleUpperCase()}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Container style={{ fontSize: 14, color: '#999' }}>
                        {internshipSemester}
                      </Container>
                    </Col>
                  </Row>
                </Container>
              </Link>
            </ListGroupItem>
          )
        })}
      </ListGroup>
    </Container>
  )
}

export default InternshipsList
