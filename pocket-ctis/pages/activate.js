import { Formik, Field, Form } from 'formik'
import { Col, Container, Row } from 'react-bootstrap'
import { useRouter } from 'next/router'
import styles from '../styles/login.module.css'
import {_submitFetcher} from "../helpers/fetchHelpers";
import {craftUrl} from "../helpers/urlHelper";
import {verify} from "../helpers/jwtHelper";


const activateAccount = async (username, password, token) => {
    const res = await _submitFetcher("POST", craftUrl(["accounts"], [{name: "activate", value:1}]), {username, password, token})
    return res;
}

const checkPassword = (pass, cnfpass) => {
    if(pass !== cnfpass)
        return {errors: [{error: "Passwords do not match"}]};
    if(pass.length < 6)
        return {errors: [{error: "Password must be at least 6 characters"}]};
    return true;
}

const ActivateAccount = ({token}) => {
    const router = useRouter()
    const onSubmit = async (values) => {
        const is_valid = checkPassword(values.password, values.confirmPassword);
        //TODO: CHECK IS_VALID AND MAKE TOAST
        if(is_valid === true){
            const res = await activateAccount(values.username, values.password, token);
            if(res.data.changedRows === 1){
                router.push({pathname: '/login'}); //TODO: show success message
            }
        }else{
            console.log(is_valid);
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
                                    <label className={styles.input_label} htmlFor='password'>
                                        Enter Username
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
                            Please select a username and password to activate your account
                            <br />
                            Passwords must be at least 6 characters
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export async function getServerSideProps(context) {
    try{
        const payload = await verify(context.query.token, process.env.MAIL_SECRET);
        return { props: {token: context.query.token}};
    }catch(error){
        return {redirect: {permanent: false, destination: "/login"}};
    }
}

export default ActivateAccount
