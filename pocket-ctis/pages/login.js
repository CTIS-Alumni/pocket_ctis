import { Formik, Field, Form } from 'formik'
import { Col, Container, Row } from 'react-bootstrap'
import { useRouter } from 'next/router'
import styles from '../styles/login.module.css'
import { User_data } from '../context/userContext'
import { useContext } from 'react'
import {_submitFetcher} from "../helpers/fetchHelpers";
import {craftUrl} from "../helpers/urlHelper";

const requestLogin = async (authCredentials) => {
  const res = await _submitFetcher("POST", craftUrl("login"), authCredentials);
  console.log("this is res", res);
  return res
}

const Login = () => {
  const { userData, setUserData } = useContext(User_data)

  const router = useRouter()
  const onSubmit = async (values) => {
    const res = await requestLogin(values)
    if (res.data.length > 0) {
      router.push({ pathname: '/user' })
      const data = res.data;
      setUserData({
        id: data[0].id,
        first_name: data[0].first_name,
        last_name: data[0].last_name,
        profile_picture: data[0].profile_picture,
        user_types: data[0].user_types
      })
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
