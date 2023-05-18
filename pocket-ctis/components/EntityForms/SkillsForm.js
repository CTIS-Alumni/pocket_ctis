import { Container } from 'react-bootstrap'
import styles from './Forms.module.css'
import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import { _getFetcher } from '../../helpers/fetchHelpers'
import { craftUrl } from '../../helpers/urlHelper'
import Select from 'react-select'
import * as Yup from 'yup'

const selectStyles = {
  control: (provided, state) => ({
    ...provided,
    borderColor: 'rgb(245, 164, 37)',
  }),
  menu: (provided, state) => ({
    ...provided,
    zIndex: 2,
  }),
}

const SkillsForm = ({ activeItem }) => {
  const [refreshKey, setRefreshKey] = useState(Math.random().toString(36))
  const [skillType, setSkillType] = useState([])

  useEffect(() => {
    _getFetcher({ skillType: craftUrl(['skilltypes']) })
      .then((res) => {
        const options = res.skillType.data.map((d) => ({
          value: d.id,
          label: d.skill_type_name,
        }))
        setSkillType(options)
      })
      .catch((err) => console.log(err))
  }, [])

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      skill_name: null,
      skill_type_name: null,
    },
    validationSchema: Yup.object({
      skill_name: Yup.string().required('Skill name is required'),
      skill_type_name: Yup.object().required('Skill Type is required'),
    }),
    onSubmit: (vals) => {
      onSubmitHandler(vals)
    },
  })

  useEffect(() => {
    if (activeItem) {
      formik.setValues({
        skill_name: activeItem.skill_name,
        skill_type_name: {
          value: activeItem.skill_type_id,
          label: activeItem.skill_type_name,
        },
      })
    } else {
      setRefreshKey(Math.random().toString(36))
      formik.resetForm()
    }
  }, [activeItem])

  const onSubmitHandler = (vals) => {
    console.log(vals)
  }

  return (
    <div>
      <h5>Skill</h5>
      <Container>
        <form onSubmit={formik.handleSubmit} key={refreshKey}>
          <div className={styles.inputContainer}>
            <label className={styles.inputLabel}>Skill Name</label>
            <input
              className={styles.inputField}
              id='skill_name'
              name='skill_name'
              value={formik.values.skill_name}
              onChange={formik.handleChange}
            />
            {formik.touched.skill_name && formik.errors.skill_name ? (
              <div className={styles.error}>{formik.errors.skill_name}</div>
            ) : null}
          </div>
          <div className={styles.inputContainer}>
            <label className={styles.inputLabel}>Skill Type</label>
            <Select
              styles={selectStyles}
              options={skillType}
              id='skill_type_name'
              name='skill_type_name'
              value={formik.values.skill_type_name}
              onChange={(val) => formik.setFieldValue('skill_type_name', val)}
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

export default SkillsForm
