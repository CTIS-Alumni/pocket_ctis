import { Container, ListGroupItem, Row, Col } from 'react-bootstrap'
import styles from './InternshipsList.module.scss'
import React from 'react'
import {
  getProfilePicturePath,
  getSemester,
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
    <table className='custom_table'>
              <thead>
                <tr>
                <th> </th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Company</th>
                <th>Internship Type</th>
                <th> </th>
                </tr>
              </thead>
      {internships.map((internship) => {
        const profilePicture = getProfilePicturePath(
          internship.pic_visibility,
          internship.profile_picture
        )
        const internshipSemester = getSemester(
          internship.semester,
          internship.start_date
        )
        return (
                <tr>
                <td>
                  <div
                      className='user_avatar_48'
                      style={{
                        backgroundImage:
                          'url(' +
                          '/profilepictures/' +
                          (internship.record_visibility
                            ? internship.pic_visibility
                              ? internship.profile_picture
                              : 'defaultuser'
                            : 'defaultuser') +
                          '.png' +
                          ')'
                      }}
                    />
                </td>
                <td><span>{`${
                      internship.record_visibility
                        ? internship.first_name
                        : 'Anonymous'
                    }`}</span></td>
                <td><span>{`${
                      internship.record_visibility ? internship.last_name : ''
                    }`}</span></td>
                <td><span className={styles.internship_students_item_company}>
                      {internship.record_visibility
                        ? internship.company_name
                        : ''}
                    </span></td>
                    <td><span className={styles.internship_students_item_semester}>
                      {internship.record_visibility ? internshipSemester : ''}
                    </span></td>
                <td><div className={styles.internship_students_item_badge}>
                  {internship.record_visibility
                    ? internship.user_types
                        .split(',')
                        .map((type, i) => (
                          <span key={i}>{type.toLocaleUpperCase()}</span>
                        ))
                    : null}
                </div></td>
                </tr>
        )
      })}
    </table>
  )
}

export default InternshipsList
