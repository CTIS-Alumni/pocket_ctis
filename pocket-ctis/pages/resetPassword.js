import { Formik, Field, Form } from 'formik'
import { Col, Container, Row } from 'react-bootstrap'
import { useRouter } from 'next/router'
import styles from '../styles/login.module.css'
import {_submitFetcher} from "../helpers/fetchHelpers";
import {craftUrl} from "../helpers/urlHelper";
import {verify} from "../helpers/jwtHelper";
import Link from "next/link";
import {toast} from "react-toastify";


const changePassword = async (password, confirm, token, type) => {
    const res = await _submitFetcher("POST", craftUrl(["accounts"], [{name: type, value: 1}]), {password, confirm, token})
    return res;
}

const checkPassword = (pass, cnfpass) => {
    if(pass !== cnfpass)
        return {errors: [{error: "Passwords do not match"}]};
    if(pass.length < 8)
        return {errors: [{error: "Password must be at least 8 characters"}]};
    return true;
}

const ResetPassword = ({token, type}) => {
    const router = useRouter()
    const onSubmit = async (values) => {
        const is_valid = checkPassword(values.password, values.confirmPassword);
        if (is_valid.errors) {
            toast.error(is_valid.errors[0].error)
            return false;
        }
        const res = await changePassword(values.password, values.confirmPassword, token, type)
        if (res.data && !res.errors) {
            toast.success('Password has been reset successfully.')
            router.push({ pathname: '/login' })
        }else{
        toast.error(res.errors[0].error)
        }
    }

    return (
        <div
            style={type === "forgotAdminPassword"? { backgroundColor: '#9a9a9a', height: '100vh' }
                : { backgroundColor: '#1F272B', height: '100vh' }}
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
                                        Enter New Password
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
                                <p className={styles.forgot_password_container}>
                                    <Link href='/login' className={styles.forgot_password}>
                                        Go back to login
                                    </Link>
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
                            Please enter your new {(type === "forgotAdminPassword") ? `Admin`: ''} password.
                            <br />
                            <br />
                            Your password should be at least 6 characters long.
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export async function getServerSideProps(context) {
    try{
        const {payload} = await verify(context.query.token, process.env.MAIL_SECRET);
        return { props: {token: context.query.token, type: payload.type}};
    }catch(error){
        return {redirect: {permanent: false, destination: "/login"}};
    }
}

export default ResetPassword
