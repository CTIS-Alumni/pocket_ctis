import { Formik, Field, Form } from 'formik'
import { Col, Container, Row } from 'react-bootstrap'
import { useRouter } from 'next/router'
import styles from '../../styles/login.module.css'
import { useState } from 'react'
import { _submitFetcher } from '../../helpers/fetchHelpers'
import { craftUrl } from '../../helpers/urlHelper'
import { toast, ToastContainer } from 'react-toastify'

const requestAdminLogin = async (authCredentials) => {
  const res = await _submitFetcher(
    'POST',
    craftUrl(['login'], [{ name: 'admin', value: 1 }]),
    authCredentials
  )
  return res
}

const requestAdminPassword = async ({ username, email }) => {
  const res = await _submitFetcher(
    'POST',
    craftUrl(['mail'], [{ name: 'forgotAdminPassword', value: 1 }]),
    { username, email }
  )
  return res
}

function checkValues(username, password) {
  if (username.trim() === '' || password.trim() === '')
    return { errors: [{ error: 'Please fill all fields!' }] }
  return true
}

const Login = () => {
  const router = useRouter()
  const onSubmit = async (values) => {
    const is_valid = checkValues(values.username, values.password)
    if (is_valid.errors) {
      toast.error(is_valid.errors[0].error)
      return false
    }
    const res = await requestAdminLogin(values)
    if (res.data && !res.errors) {
      toast.success('Login successful')
      router.push('/admin')
    } else {
      toast.error(res.errors[0].error)
    }
  }

  const sendMail = async (values) => {
    const is_valid = checkValues(values.username, values.email)
    if (is_valid.errors) {
      toast.error(is_valid.errors[0].error)
      return false
    }
    const res = await requestAdminPassword(values)
    if (res.data && !res.errors) {
      toast.success(
        'Please check your email address for your password reset link.'
      )
    } else {
      toast.error(res.errors[0].error)
    }
  }

  const [loginForm, changeLoginForm] = useState(true)

  const changeForm = () => {
    changeLoginForm(!loginForm)
  }

  return (
    <div
      style={{ backgroundColor: '#9a9a9a', height: '100vh' }}
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
        <Row
          className={styles.containerRow}
          style={{ height: '80%', width: '90%' }}
          xs={1}
          md={2}
        >
          <Col className='d-flex align-items-center'>
            {loginForm && (
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
                      Admin Username
                    </label>
                  </p>
                  <p className={styles.input_container}>
                    <Field
                      className={styles.input_field}
                      id='password'
                      name='password'
                      type='password'
                      placeholder='password'
                    />
                    <label className={styles.input_label} htmlFor='password'>
                      Admin Password
                    </label>
                  </p>
                  <p className={styles.forgot_password_container}>
                    <span
                      onClick={changeForm}
                      className={styles.forgot_password}
                    >
                      Forgot admin password?
                    </span>
                  </p>
                  <button type='submit' className={styles.button}>
                    Login
                  </button>
                </Form>
              </Formik>
            )}
            {!loginForm && (
              <Formik
                initialValues={{ username: '', email: '' }}
                enableReinitialize
                onSubmit={sendMail}
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
                      id='email'
                      name='email'
                      placeholder='email'
                    />
                    <label className={styles.input_label} htmlFor='email'>
                      Email
                    </label>
                  </p>
                  <p className={styles.forgot_password_container}>
                    <span
                      onClick={changeForm}
                      className={styles.forgot_password}
                    >
                      Go Back
                    </span>
                  </p>
                  <button type='submit' className={styles.button}>
                    Send Mail
                  </button>
                </Form>
              </Formik>
            )}
          </Col>
          <Col
            style={{ borderLeft: '1px solid #aaa' }}
            className='d-flex align-items-center'
          >
            <div>
              Have an admin account but haven't activated yet?
              <br />
              Check your mail for your activation link!
            </div>
          </Col>
        </Row>
      </Container>
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        draggable
        pauseOnHover
        theme='light'
      />
    </div>
  )
}

export default Login
