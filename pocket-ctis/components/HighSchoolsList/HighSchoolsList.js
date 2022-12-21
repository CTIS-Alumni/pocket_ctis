import Link from 'next/link'
import {
  Container,
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  Form,
} from 'react-bootstrap'
import SearchBar from '../SearchBar/SearchBar'
import styles from './HighSchoolsList.module.css'

const HighSchoolList = ({ highSchools }) => {
  return (
    <Container fluid style={{ backgroundColor: '#f9f9f9', paddingTop: 20 }}>
      <h1>High Schools</h1>
      <Row>
        <Col
          style={{
            backgroundColor: 'white',
            border: '1px solid #eee',
            marginLeft: 10,
            paddingTop: 10,
            boxShadow: '5px 5px 10px 0px rgba(0,0,0,0.3)',
          }}
        >
          <h5>Filters</h5>
          <Form.Check type='checkbox' id={`is_internship`} label={`Turkey`} />
        </Col>
        <Col lg='10'>
          <SearchBar />
          <Row>
            <Col>
              <ListGroup
                variant='flush'
                style={{ boxShadow: '5px 5px 10px 0px rgba(0,0,0,0.3)' }}
              >
                {highSchools.map((highSchool) => (
                  <ListGroupItem className={styles.listItem}>
                    <Link
                      href={`/user/highSchools/${highSchool.id}`}
                      className='d-flex justify-content-between align-items-start'
                    >
                      <div>
                        <h5>{highSchool.high_school_name}</h5>
                        <span style={{ fontSize: 12, color: '#999' }}>
                          {`${highSchool.country_name} - ${highSchool.city_name}`}
                        </span>
                      </div>
                    </Link>
                  </ListGroupItem>
                ))}
              </ListGroup>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  )
}

export default HighSchoolList
