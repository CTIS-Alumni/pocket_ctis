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
import styles from './InternshipsList.module.css'

const InternshipsList = ({ internships }) => {
  console.log(internships)
  return (
    <Container fluid style={{ backgroundColor: '#f9f9f9', paddingTop: 20 }}>
      <h1>Internships</h1>
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
                {internships.map((internship) => (
                  <ListGroupItem className={styles.listItem}>
                    <Link
                      href={`/user/companies/${internship.id}`}
                      className='d-flex justify-content-between align-items-start'
                    >
                      <div style={{ width: '100%' }}>
                        <div className='d-flex justify-content-between '>
                          <h5>{`${internship.first_name} ${internship.last_name} - ${internship.company_name}`}</h5>
                          <p>{`${internship.semester}`}</p>
                        </div>
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

export default InternshipsList
