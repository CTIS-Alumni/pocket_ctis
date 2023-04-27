import { Container, ListGroupItem, Row, Col } from 'react-bootstrap'
import styles from './InternshipsList.module.scss'
import React from 'react'
import {
  getProfilePicturePath,
  getSemester, getTimePeriod,
} from '../../../helpers/formatHelpers'

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
    <div className={styles.internship_students}>
      {internships.map((internship) => {
        const profilePicture = getProfilePicturePath(internship.pic_visibility, internship.profile_picture)
        const internshipSemester = getSemester(internship.semester, internship.start_date)
        const timePeriod = getTimePeriod(internship.start_date, internship.end_date)
        return (
          <div className={styles.internship_students_item} key={internship.id}>
            {/* This will become a link in the future maybe */}
            <div className={styles.student_link} href={`/#`}>
              <div className={styles.internship_students_item_info}>
                <div
                  className='user_avatar_48'
                  style={{
                    backgroundImage:
                      'url(' +
                      '/profilepictures/' +
                      ( internship.pic_visibility
                          ? internship.profile_picture
                          : 'defaultuser') +
                      '.png' +
                      ')',
                  }}
                />
                <div>
                  <span
                    className={`${styles.internship_students_item_name}`}
                  >{`${internship.first_name} ${internship.last_name}`}</span>
                  <span className={styles.internship_students_item_company}>
                    {internship.company_name}
                  </span>
                  <span className={styles.internship_students_item_semester}>
                    {internshipSemester}
                  </span>
                  <span className={styles.internship_students_item_time_period}>
                    {timePeriod}
                  </span>
                </div>
              </div>
              <div className={styles.internship_students_item_badge}>
                {internship.user_types
                      .split(',')
                      .map((type, i) => (
                        <span key={i}>{type.toLocaleUpperCase()}</span>
                      ))}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default InternshipsList
