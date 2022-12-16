import Link from 'next/link'
import {
  Container,
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  Badge,
  Form,
} from 'react-bootstrap'
import SearchBar from '../SearchBar/SearchBar'
import styles from './CompaniesList.module.css'

const CompaniesList = ({ companies }) => {
  return (
    <Container fluid style={{ backgroundColor: '#f9f9f9', paddingTop: 20 }}>
      <h1>Companies</h1>
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
          <Row>
            <Col>
              <Form.Check
                type='checkbox'
                id={`is_internship`}
                label={`Accepts CTIS Interns?`}
              />
            </Col>
          </Row>
        </Col>
        <Col lg='10'>
          <SearchBar />
          <Row>
            <Col>
              <ListGroup
                variant='flush'
                style={{ boxShadow: '5px 5px 10px 0px rgba(0,0,0,0.3)' }}
              >
                {companies.map((company) => (
                  <ListGroupItem className={styles.listItem}>
                    <Link
                      href={`/user/companies/${company.id}`}
                      className='d-flex justify-content-between align-items-start'
                    >
                      <div>
                        <h5>{company.company_name}</h5>
                        <span style={{ fontSize: 12, color: '#999' }}>
                          {company.sector_name}
                        </span>
                      </div>
                      {company.is_internship == 1 && (
                        <Badge bg='primary' pill>
                          Accepts CTIS Interns
                        </Badge>
                      )}
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

export default CompaniesList
