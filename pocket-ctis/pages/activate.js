import { Formik, Field, Form } from 'formik'
import { Col, Container, Row } from 'react-bootstrap'
import { useRouter } from 'next/router'
import styles from '../styles/login.module.css'
import {_submitFetcher} from "../helpers/fetchHelpers";
import {craftUrl} from "../helpers/urlHelper";
import {verify} from "../helpers/jwtHelper";
import departmentConfig from "../config/departmentConfig";
import {toast, ToastContainer} from "react-toastify";


const activateAccount = async (username, password, token) => {
    const res = await _submitFetcher("POST", craftUrl(["accounts"], [{name: "activateAccount", value:1}]), {username, password, token})
    return res;
}

const activateAdminAccount = async (username, password, token) => {
    const res = await _submitFetcher("POST", craftUrl(["accounts"], [{name: "activateAdminAccount", value:1}]), {username, password, token})
    return res;
}

const checkPassword = (pass, cnfpass, usr) => {
    if(pass.trim() === "" || cnfpass.trim() === "" || usr.trim() === "")
        return {errors: [{error: "Please fill all fields!"}]};
    if(pass !== cnfpass)
        return {errors: [{error: "Passwords do not match"}]};
    if(pass.length < 8){
        return {errors: [{error: "Password must be at least 8 characters"}]};
    }
    return true;
}

const ActivateAccount = ({token, type}) => {
    const router = useRouter()
    const onSubmit = async (values) => {
        const is_valid = checkPassword(values.password, values.confirmPassword, values.username);
        if (is_valid.errors) {
            toast.error(is_valid.errors[0].error)
            return false;
        }

        let res;
        if (type === "activateAccount") {
            res = await activateAccount(values.username, values.password, token);
            if (res.data && !res.errors) {
                toast.success('Your account has been activated successfully.')
                setTimeout(() => {
                    router.push('/login');
                }, 3000);
            } else {
                toast.error(res.errors[0].error)
            }
        } else if (type === "activateAdminAccount") {
            res = await activateAdminAccount(values.username, values.password, token);
            console.log("hers res", res);
            if (res.data?.insertId && !res.errors) {
                toast.success('Your admin account has been activated successfully.')
                setTimeout(() => {
                    router.push('/login');
                }, 3000);
            } else {
                console.log("here");
                toast.error(res.errors[0].error)
            }
        }
    }

    return (
        <div
            style={type === "activateAdminAccount"? { backgroundColor: '#9a9a9a', height: '100vh' }
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
                            initialValues={{ username: '',password: '', confirmPassword: '' }}
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
                                        Enter Username
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
                                        Enter Password
                                    </label>
                                </p>
                                <p className={styles.input_container}>
                                    <Field
                                        className={styles.input_field}
                                        id='confirmPassword'
                                        name='confirmPassword'
                                        type='password'
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
                            Welcome to {departmentConfig.app_name}
                            <br />
                            <br />
                            Please select a username and password to activate your account
                            <br />
                            Passwords must be at least 6 characters
                        </div>
                    </Col>
                </Row>
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

export default ActivateAccount
