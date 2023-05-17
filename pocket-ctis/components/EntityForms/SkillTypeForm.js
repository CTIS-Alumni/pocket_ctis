import { Container } from 'react-bootstrap'
import styles from './Forms.module.css'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import {_submitFetcher} from "../../helpers/fetchHelpers";
import {craftUrl} from "../../helpers/urlHelper";
import {toast} from "react-toastify";

const SkillTypeForm = () => {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      skill_type_name: null,
    },
    validationSchema: Yup.object({
      skill_type_name: Yup.string().required('Skill Type name is required'),
    }),
    onSubmit: async (values) => {
      await onSubmitHandler(values)
    },
  })

  const onSubmitHandler = async (values) => {
    const res = await _submitFetcher('POST', craftUrl(['skilltypes']), {skilltypes: [values]})
    if(!res.data?.length || res.errors.length){
      toast.error(res.errors[0].error)
    }
    else toast.success("Exam successfully added")
  }

  return (
    <div>
      <h5>Skill Type</h5>
      <Container>
        <form onSubmit={formik.handleSubmit}>
          <div className={styles.inputContainer}>
            <label className={styles.inputLabel}>Skill Type Name</label>
            <input
              className={styles.inputField}
              id='skill_type_name'
              name='skill_type_name'
              value={formik.values.skill_type_name}
              onChange={formik.handleChange}
            />
            {formik.touched.skill_type_name && formik.errors.skill_type_name ? (
              <div className={styles.error}>
                {formik.errors.skill_type_name}
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

export default SkillTypeForm
