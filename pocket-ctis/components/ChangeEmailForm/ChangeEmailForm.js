import { Container } from 'react-bootstrap'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import styles from './ChangeEmailForm.module.css'
import {useContext, useState} from "react";
import { _submitFetcher} from "../../helpers/fetchHelpers";
import {craftUrl} from "../../helpers/urlHelper";
import {User_data} from "../../context/userContext";

const changeEmail = async (email) => {
  const res = await _submitFetcher('POST', craftUrl(['mail'], [{name: "changeEmail", value: 1}]), {email});
  return res;
}

const ChangeEmailForm = () => {
  const { userData } = useContext(User_data)
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: null,
      confirmEmail: null,
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid Email').required('Required'),
      confirmEmail: Yup.string().email('Invalid Email').required('Required'),
    }),
    onSubmit: async (values) => {
      await onSubmitHandler(values)
    },
  })

  const onSubmitHandler = async (values) => {
    if (values.email !== values.confirmEmail) {
      toast.error('New email address and confirm email do not match!')
      return
    }

    const res = await changeEmail(values.email);
    if(res.data && !res.errors){
      toast.success('A verification link has been sent to ' + values.email);
    }else toast.error(res.errors[0].error);

  }

  return (
    <div>
      <h5>Change Email</h5>
      <Container>
        <form onSubmit={formik.handleSubmit}>
          <div className={styles.inputContainer}>
            <label className={styles.inputLabel}>New Email Address</label>
            <input
              value={formik.values.email}
              onChange={formik.handleChange}
              id='email'
              name='email'
              type='email'
              className={styles.inputField}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className={styles.error}>{formik.errors.email}</div>
            ) : null}
          </div>
          <div className={styles.inputContainer}>
            <label className={styles.inputLabel}>Confirm Email</label>
            <input
              value={formik.values.confirmEmail}
              onChange={formik.handleChange}
              id='confirmEmail'
              name='confirmEmail'
              type='email'
              className={styles.inputField}
            />
            {formik.touched.confirmEmail && formik.errors.confirmEmail ? (
              <div className={styles.error}>{formik.errors.confirmEmail}</div>
            ) : null}
          </div>
          <button type='submit' className={styles.confirmButton}>
            Confirm
          </button>
        </form>
      </Container>
    </div>
  )
}


export default ChangeEmailForm
