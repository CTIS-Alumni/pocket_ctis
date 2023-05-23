import { Formik, Field, Form } from 'formik'
import { Col, Container, Row } from 'react-bootstrap'
import { useRouter } from 'next/router'
import styles from '../styles/login.module.css'
import { useState } from 'react'
import {_submitFetcher} from "../helpers/fetchHelpers";
import {craftUrl} from "../helpers/urlHelper";
import departmentConfig from "../config/departmentConfig";
import {toast, ToastContainer} from "react-toastify";

const requestLogin = async (authCredentials) => {
  const res = await _submitFetcher("POST", craftUrl(["login"]), authCredentials);
  return res
}

const requestPasswordReset = async ({username, email}) => {
  const res = await _submitFetcher("POST",craftUrl(["mail"], [{name: "forgotPassword", value: 1}]), {username, email})
  return res;

}

function checkValues(username, password) {
  if(username.trim() === "" || password.trim() === "")
    return {errors: [{error: "Please fill all fields!"}]};
  return true;
}

const Login = () => {
  const router = useRouter()
  const onSubmit = async (values) => {
    const is_valid = checkValues(values.username, values.password);
    if(is_valid.errors) {
      toast.error(is_valid.errors[0].error)
      return false;
    }
    const res = await requestLogin(values)
    console.log(res);
    if (res?.data?.length && !res.errors) {
      toast.success('Login successful')
      router.push('/user' )
    }else{
      toast.error(res.errors[0].error)
    }
  }

  const sendMail = async (values) => {
    const is_valid = checkValues(values.username, values.email);
    if(is_valid.errors) {
      toast.error(is_valid.errors[0].error)
      return false;
    }
    const res = await requestPasswordReset(values);
    if(res.data && !res.errors){
      toast.success('Please check your email address for your password reset link.')
    }else{
      toast.error(res.errors[0].error)
    }
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
            {loginForm && <div>
              Welcome to {departmentConfig.app_name}
              <br />
              <br />
              Your everlasting connection to your Alma Mater
            </div>}
            {!loginForm && <div>
              Please enter your username and email address.
              <br />
              <br />
              An link for resetting your password will be sent to your email shortly.
            </div>}
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
