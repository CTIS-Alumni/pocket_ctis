import { Formik, Field, Form } from 'formik'
import { Col, Container, Row } from 'react-bootstrap'
import { useRouter } from 'next/router'
import styles from '../styles/login.module.css'
import {_submitFetcher} from "../helpers/fetchHelpers";
import {craftUrl} from "../helpers/urlHelper";


const changePassword = async (password, token) => {
    const res = await _submitFetcher("POST", craftUrl("changePassword"), {password, token})
    return res;
}

const ResetPassword = ({token}) => {
    const router = useRouter()
    const onSubmit = async (values) => {
        if(values.password === values.confirmPassword){
            const res = await changePassword(values.password, token)
            if (res.data?.changedRows === 1)  {
                router.push({ pathname: '/login' })
            }else{
                console.log(res.error);
            }
        }else{
            console.log("Passwords do not match");
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
                            initialValues={{ password: '', confirmPassword: '' }}
                            enableReinitialize
                            onSubmit={onSubmit}
                        >
                            <Form className={styles.form_container}>
                                <p className={styles.input_container}>
                                    <Field
                                        className={styles.input_field}
                                        id='password'
                                        name='password'
                                        placeholder='password'
                                    />
                                    <label className={styles.input_label} htmlFor='password'>
                                        Enter Password
                                    </label>
                                </p>
                                <p className={styles.input_container}>
                                    <Field
                                        className={styles.input_field}
                                        id='confirmPassword'
                                        name='confirmPassword'
                                        placeholder='confirmPassword'
                                    />
                                    <label className={styles.input_label} htmlFor='confirmPassword'>
                                        Confirm Password
                                    </label>
                                </p>

                                <button type='submit' className={styles.button}>
                                    Change Password
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

export async function getServerSideProps(context) {
    return { props: {token: context.query.token}}
}

export default ResetPassword
