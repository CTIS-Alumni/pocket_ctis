import { Container } from 'react-bootstrap'
import styles from './Forms.module.css'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import {_submitFetcher} from "../../helpers/fetchHelpers";
import {craftUrl} from "../../helpers/urlHelper";
import {toast} from "react-toastify";
import {useEffect, useState} from "react";

const SkillTypeForm = ({ activeItem }) => {
  const [refreshKey, setRefreshKey] = useState(Math.random().toString(36))

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

  useEffect(() => {
    if (activeItem) {
      formik.setValues({
        skill_type_name: activeItem.skill_type_name,
      })
    } else {
      setRefreshKey(Math.random().toString(36))
      formik.resetForm()
    }
  }, [activeItem])

  const onSubmitHandler = async (values) => {
    if(activeItem){
      values.id = activeItem.id;
      const res = await _submitFetcher('PUT', craftUrl(['skilltypes']), {skilltypes: [values]})
      if (!res.data[activeItem.id] || res.errors.length) {
        toast.error(res.errors[0].error)
      } else toast.success("Skill type successfully saved")
    }else{
      const res = await _submitFetcher('POST', craftUrl(['skilltypes']), {skilltypes: [values]})
      if (!res.data?.length || res.errors.length) {
        toast.error(res.errors[0].error)
      } else toast.success("Skill type successfully added!")
    }
  }

  return (
    <div>
      <h5>Skill Type</h5>
      <Container>
        <form onSubmit={formik.handleSubmit} key={refreshKey}>
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
