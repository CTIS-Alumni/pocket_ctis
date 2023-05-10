import { Formik, Field, Form } from 'formik'
import { Col, Container, Row } from 'react-bootstrap'
import { useRouter } from 'next/router'
import styles from '../styles/login.module.css'
import { User_data } from '../context/userContext'
import { useContext,useState } from 'react'
import {_submitFetcher} from "../helpers/fetchHelpers";
import {craftUrl} from "../helpers/urlHelper";

const requestLogin = async (authCredentials) => {
  const res = await _submitFetcher("POST", craftUrl(["login"]), authCredentials);
  return res
}

const requestPasswordReset = async ({username, email}) => {
  const res = await _submitFetcher("POST",craftUrl(["mail"], [{name: "forgotPassword", value: 1}]), {username, email})
  return res;

}

const Login = () => {
  const { userData, setUserData } = useContext(User_data)

  const router = useRouter()
  const onSubmit = async (values) => {
    const res = await requestLogin(values)
    console.log(res);
    if (res.data?.length > 0) {
      router.push({ pathname: '/user' })
      const data = res.data;
      setUserData({
        id: data[0].id,
        first_name: data[0].first_name,
        last_name: data[0].last_name,
        profile_picture: data[0].profile_picture,
        user_types: data[0].user_types
      })
    }else{
      //TODO: SHOW ERROR TOAST;
    }
  }

  const sendMail = async (values) => {
    const res = await requestPasswordReset(values);
    console.log("here",res);
  }

  const [loginForm, changeLoginForm] = useState(true);

  const changeForm = () => {
    changeLoginForm(!loginForm);
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
            {loginForm && <Formik
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
                       <span onClick={changeForm} className={styles.forgot_password}>
                    Forgot password?
                  </span>
                </p>
                <button type='submit' className={styles.button}>
                  Login
                </button>
              </Form>
            </Formik>}
            {!loginForm && <Formik
                initialValues={{ username: '', email: ''}}
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
                  <span onClick={changeForm} className={styles.forgot_password}>
                    Go Back
                  </span>
                </p>
                <button type='submit' className={styles.button}>
                  Send Mail
                </button>
              </Form>
            </Formik>}

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
