import { Formik, Field, Form } from 'formik'
import { Col, Container, Row } from 'react-bootstrap'
import { useRouter } from 'next/router'
import styles from '../styles/login.module.css'

const requestLogin = async (authCredentials) => {
  const res = await fetch('http://localhost:3000/api/login', {
    method: 'POST',
    body: JSON.stringify(authCredentials),
  })

  return res
}

const Login = () => {
  const router = useRouter()
  const onSubmit = async (values) => {
    const res = await requestLogin(values)
    if (res.status === 200) {
      router.push({ pathname: '/user' })
    }
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
              <Form className={styles.form_container}>
                <p className={styles.input_container}>
                  <Field
                    className={styles.input_field}
                    id='username'
                    name='username'
                    placeholder='username'
                  />
                  <label className={styles.input_label} htmlFor='username'>
                    Username
                  </label>
                </p>
                <p className={styles.input_container}>
                  <Field
                    className={styles.input_field}
                    id='password'
                    name='password'
                    placeholder='password'
                  />
                  <label className={styles.input_label} htmlFor='password'>
                    Password
                  </label>
                </p>
                <p className={styles.forgot_password_container}>
                  <span className={styles.forgot_password}>
                    Forgot password?
                  </span>
                </p>
                <button type='submit' className={styles.button}>
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
