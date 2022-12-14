import React from 'react'
import { Navbar, Container, Nav, Form, Button } from 'react-bootstrap'
import { Search } from 'react-bootstrap-icons'

const NavigationBar = () => {
  return (
    <>
      <Navbar style={{ backgroundColor: '#d9d9d9' }}>
        <Container>
          <Navbar.Brand href='/user'>PocketCTIS</Navbar.Brand>
          <Form className='d-flex align-items-center'>
            <Form.Control
              type='search'
              placeholder='Search'
              className='me-2'
              aria-label='Search'
            />
            {/* <Button variant='outline-success'> */}
            <Search
              size='25px'
              style={{ cursor: 'pointer', lineHeight: '25px' }}
            />
            {/* </Button> */}
          </Form>
        </Container>
      </Navbar>
    </>
  )
}

export default NavigationBar
