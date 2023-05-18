import { Container } from 'react-bootstrap'
import { useFormik } from 'formik'
import styles from './ChangePasswordForm.module.css'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import {_submitFetcher} from "../../helpers/fetchHelpers";
import {craftUrl} from "../../helpers/urlHelper";

const checkPassword = (pass, cnfpass) => {
  if(pass !== cnfpass)
    return {errors: [{error: "Passwords do not match"}]};
  if(pass.length < 8)
    return {errors: [{error: "Password must be at least 8 characters"}]};
  return true;
}

const changePassword = async (current, newPass) => {
  const res = await _submitFetcher("POST", craftUrl(["accounts"], [{name: "changeAdminPassword", value: 1}]), {current, newPass})
  return res;
}

const ChangePasswordForm = () => {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      currentPass: null,
      newPassword: null,
      retypeNewPassword: null,
    },
    validationSchema: Yup.object({
      currentPass: Yup.string()
        .min(8, 'Password must be longer than 8 characters')
        .required('Required'),
      newPassword: Yup.string()
        .min(8, 'Password must be longer than 8 characters')
        .required('Required'),
      retypeNewPassword: Yup.string()
        .min(8, 'Password must be longer than 8 characters')
        .required('Required'),
    }),
    onSubmit: async (values) => {
     await onSubmitHandler(values)
    },
  })

  const onSubmitHandler = async (values) => {
    console.log("here",values)
    const is_valid = checkPassword(values.newPassword, values.confirmPassword);
    if (is_valid.errors) {
      toast.error(is_valid.errors[0].error)
      return false;
    }

    const res = await changePassword(values.currentPassword, values.newPassword, values.confirmPassword)
    console.log(res);
    if (res.data && !res.errors) {
      toast.success('Admin password has been reset successfully.')
    }else{
      toast.error(res.errors[0].error)
    }
  }

  return (
    <div>
      <h5>Change Password</h5>
      <Container>
        <form onSubmit={formik.handleSubmit}>
          <div className={styles.inputContainer}>
            <label className={styles.inputLabel}>Current Password</label>
            <input
              value={formik.values.currentPassword}
              onChange={formik.handleChange}
              id='currentPassword'
              name='currentPassword'
              type='password'
              className={styles.inputField}
            />
            {formik.touched.currentPassword && formik.errors.currentPassword ? (
              <div className={styles.error}>{formik.errors.currentPassword}</div>
            ) : null}
          </div>
          <div className={styles.inputContainer}>
            <label className={styles.inputLabel}>New Password</label>
            <input
              value={formik.values.newPassword}
              onChange={formik.handleChange}
              id='newPassword'
              name='newPassword'
              type='password'
              className={styles.inputField}
            />
            {formik.touched.newPassword && formik.errors.newPassword ? (
              <div className={styles.error}>{formik.errors.newPassword}</div>
            ) : null}
          </div>
          <div className={styles.inputContainer}>
            <label className={styles.inputLabel}>Confirm New Password</label>
            <input
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              id='confirmPassword'
              name='confirmPassword'
              type='password'
              className={styles.inputField}
            />
            {formik.touched.confirmPassword &&
            formik.errors.confirmPassword ? (
              <div className={styles.error}>
                {formik.errors.confirmPassword}
              </div>
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

export default ChangePasswordForm
