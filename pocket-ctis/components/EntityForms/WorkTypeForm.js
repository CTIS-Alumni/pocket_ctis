import { Container } from 'react-bootstrap'
import styles from './Forms.module.css'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import {_submitFetcher} from "../../helpers/fetchHelpers";
import {craftUrl} from "../../helpers/urlHelper";
import {toast} from "react-toastify";

const WorkTypeForm = () => {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      work_type_name: null,
    },
    validationSchema: Yup.object({
      work_type_name: Yup.string().required('Work Type name is required'),
    }),
    onSubmit: async (values) => {
      await onSubmitHandler(values)
    },
  })

  const onSubmitHandler = async (values) => {
    const res = await _submitFetcher('POST', craftUrl(['worktypes']), {worktypes: [values]})
    if(!res.data?.length || res.errors.length){
      toast.error(res.errors[0].error)
    }
    else toast.success("Exam successfully added")
  }
  return (
    <div>
      <h5>Work Type</h5>
      <Container>
        <form onSubmit={formik.handleSubmit}>
          <div className={styles.inputContainer}>
            <label className={styles.inputLabel}>Work Type Name</label>
            <input
              className={styles.inputField}
              id='work_type_name'
              name='work_type_name'
              value={formik.values.work_type_name}
              onChange={formik.handleChange}
            />
            {formik.touched.work_type_name && formik.errors.work_type_name ? (
              <div className={styles.error}>{formik.errors.work_type_name}</div>
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

export default WorkTypeForm
