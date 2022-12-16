import { Row, Col, Form } from 'react-bootstrap'
import { Search } from 'react-bootstrap-icons'

const SearchBar = () => {
  return (
    <Row>
      <Col>
        <div className='mx-auto' style={{ width: '80%' }}>
          <Form className='d-flex align-items-center mb-2'>
            <Form.Control
              type='search'
              placeholder='Search'
              className='me-2'
              aria-label='Search'
            />
            <Search
              size='25px'
              style={{ cursor: 'pointer', lineHeight: '25px' }}
            />
          </Form>
        </div>
      </Col>
    </Row>
  )
}

export default SearchBar
