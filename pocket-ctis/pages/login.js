import { Formik, Field, Form } from 'formik'
import { Col, Container, Row } from 'react-bootstrap'

const requestLogin = async (authCredentials) => {
  const res = await fetch('http://localhost:3000/api/login', {
    method: 'POST',
    body: JSON.stringify(authCredentials),
  })

  const token = await res.json()
  console.log(token)
  // await fetch(url, {
  //     method: 'POST', // *GET, POST, PUT, DELETE, etc.
  //     mode: 'cors', // no-cors, *cors, same-origin
  //     cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
  //     credentials: 'same-origin', // include, *same-origin, omit
  //     headers: {
  //       'Content-Type': 'application/json'
  //       // 'Content-Type': 'application/x-www-form-urlencoded',
  //     },
  //     redirect: 'follow', // manual, *follow, error
  //     referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  //     body: JSON.stringify(data) // body data type must match "Content-Type" header
  //   });
}

const Login = () => {
  const onSubmit = (values) => {
    console.log(values)
    requestLogin(values)
  }
  return (
    <div
      style={{ backgroundColor: '#1F272B', height: '100vh' }}
      className='d-flex justify-content-center align-items-center'
    >
      <Container
        style={{
          height: '40%',
          backgroundColor: '#eee',
          width: '50%',
          borderRadius: 14,
        }}
        className='d-flex justify-content-center align-items-center'
      >
        <Row style={{ height: '80%', width: '90%' }}>
          <Col className='d-flex align-items-center'>
            <Formik
              initialValues={{ username: '', password: '' }}
              enableReinitialize
              onSubmit={onSubmit}
            >
              <Form>
                <label htmlFor='username'>Username</label>
                <Field id='username' name='username' placeholder='Username' />
                <label htmlFor='password'>Password</label>
                <Field id='password' name='password' placeholder='Password' />
                <button
                  type='submit'
                  className='mt-3'
                  style={{
                    backgroundColor: '#f5a425',
                    border: 'none',
                    padding: 5,
                    width: 100,
                  }}
                >
                  Login
                </button>
              </Form>
            </Formik>
          </Col>
          <Col
            style={{ borderLeft: '1px solid #aaa' }}
            className='d-flex align-items-center'
          >
            <div>
              Welcome to PocketCTIS
              <br />
              <br />
              Your everlasting connection to you Alma Mater
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Login
