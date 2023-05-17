import {useRouter} from "next/router";
import {toast, ToastContainer} from "react-toastify";
import {Col, Container, Row} from "react-bootstrap";
import {Field, Form, Formik} from "formik";
import styles from "../styles/login.module.css";
import {_submitFetcher} from "../helpers/fetchHelpers";
import {craftUrl} from "../helpers/urlHelper";
import {verify} from "../helpers/jwtHelper";

const confirmEmail = async (username, password, email, token) => {
    const res = await _submitFetcher("POST", craftUrl(["accounts"], [{name: "changeEmail", value: 1}]), {username, password, email, token})
    return res;
}


function checkValues(username, password) {
    if(username.trim() === "" || password.trim() === "")
        return {errors: [{error: "Please fill all fields!"}]};
    return true;
}

const ConfirmNewContactEmail = ({token, email}) => {
    const router = useRouter()
    const onSubmit = async (values) => {

        const is_valid = checkValues(values.username, values.password);
        if(is_valid.errors) {
            toast.error(is_valid.errors[0].error)
            return false;
        }

        const res = await confirmEmail(values.username, values.password, email,token);
        console.log(res)
        if (res.data && !res.errors) {
            toast.success('Your email has been changed successfully.')
            router.push('/login');
        } else {
            console.log("why doesnt this print")
            toast.error(res.errors[0].error)
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
                            initialValues={{ username: '',password: ''}}
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

                                <button type='submit' className={styles.button}>
                                    Confirm New Email Address
                                </button>
                            </Form>
                        </Formik>
                    </Col>
                    <Col
                        style={{ borderLeft: '1px solid #aaa' }}
                        className='d-flex align-items-center'
                    >
                        <div>
                            Your contact email will be changed to {email}.
                            <br />
                            <br />
                            Please enter your user account username and password to confirm your new email address.
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
        console.log()
        return { props: {token: context.query.token, email: payload.email_address}}; //TODO: CHANGE CONTACT EMAIL IN CONTEXT if this is successful
    }catch(error){
        return {redirect: {permanent: false, destination: "/login"}};
    }
}

export default ConfirmNewContactEmail
