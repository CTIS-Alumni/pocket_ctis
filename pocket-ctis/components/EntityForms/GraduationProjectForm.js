import { useFormik } from 'formik'
import { Container } from 'react-bootstrap'
import styles from './Forms.module.css'
import { useEffect, useState } from 'react'
import { _getFetcher } from '../../helpers/fetchHelpers'
import { craftUrl } from '../../helpers/urlHelper'
import Select from 'react-select'
import * as Yup from 'yup'
import { Check2Square, Square } from 'react-bootstrap-icons'
import { toast } from 'react-toastify'

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

const GraduationProjectForm = ({ activeItem }) => {
  const [refreshKey, setRefreshKey] = useState(Math.random().toString(36))

  const [supervisors, setSupervisors] = useState([])
  const [years, setYears] = useState([])
  const [companies, setCompanies] = useState([])
  const [students, setStudents] = useState([])

  const [posterPic, setPosterPic] = useState(null)
  const [teamPic, setTeamPic] = useState(null)

  useEffect(() => {
    _getFetcher({
      supervisors: craftUrl(['users'], [{ name: 'advisors', value: 1 }]),
      companies: craftUrl(['companies']),
      students: craftUrl(['users?students=1']),
    })
      .then((res) => {
        setSupervisors(
          res.supervisors.data.map((s) => ({
            label: `${s.first_name} ${s.last_name}`,
            value: s.id,
          }))
        )
        setCompanies(
          res.companies.data.map((s) => ({
            label: `${s.company_name}`,
            value: s.id,
          }))
        )
        setStudents(
          res.students.data.map((s) => ({
            label: `${s.bilkent_id} - ${s.first_name} ${s.last_name}`,
            value: s.id,
          }))
        )
      })
      .catch((err) => {
        toast.error(err)
      })

    const firstYear = 2007
    const options = []
    for (let i = 2023; i > firstYear; i--) {
      options.push({ value: ` ${i - 1} ${i}`, label: `${i - 1}-${i}` })
    }
    setYears(options)
  }, [])

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      graduation_project_name: null,
      team_number: null,
      product_name: null,
      project_year: null,
      semester: null,
      project_description: null,
      advisor_id: null,
      project_type: null,
      company_id: null,
      students: null,
    },
    validationSchema: Yup.object({
      graduation_project_name: Yup.string().required(
        'Project Name is required'
      ),
      team_number: Yup.number().required('Team Number is required'),
      project_year: Yup.object().required('Project Year is required'),
      semester: Yup.object().required('Project Semester is required'),
      project_description: Yup.string().required(
        'Project Description is required'
      ),
      advisor_id: Yup.object().required('Supervisor is required'),
      project_type: Yup.object().required('Project Type is required'),
    }),
    onSubmit: (vals) => onSubmitHandler(vals),
  })

  useEffect(() => {
    console.log(activeItem)
    if (activeItem) {
      formik.setValues({
        skill_name: activeItem.skill_name,
        graduation_project_name: activeItem.graduation_project_name,
        team_number: activeItem.team_number,
        product_name: activeItem.product_name,
        project_year: {
          value: activeItem.project_year,
          label: `${activeItem.project_year.split(' ')[0]}-${
            activeItem.project_year.split(' ')[1]
          }`,
        },
        semester: {
          value: activeItem.semester,
          label: `${activeItem.semester.split(' ')[0]}-${
            activeItem.semester.split(' ')[1]
          }`,
        },
        project_description: activeItem.project_description,
        advisor_id: {
          value: activeItem.advisor_id,
          label: activeItem.advisor,
        },
        project_type: {
          value: activeItem.project_type,
          label: activeItem.project_type,
        },
        company_id: {
          value: activeItem.company_id,
          label: activeItem.company_name,
        },
        students: activeItem.team_members?.split(',').map((m) => {
          console.log(m.split('-'))
          return {
            value: m.trim().split('-')[0],
            label: `${m.trim().split('-')[2]} - ${m.trim().split('-')[1]}`,
          }
        }),
      })
    } else {
      setRefreshKey(Math.random().toString(36))
      formik.resetForm()
    }
  }, [activeItem])

  const onSubmitHandler = (vals) => {
    console.log(vals)
    //get images from posterPic and teamPic useStates
  }

  return (
    <div>
      <h4>Graduation Project</h4>
      <Container>
        <form onSubmit={formik.handleSubmit} key={refreshKey}>
          <div className={styles.inputContainer}>
            <label className={styles.inputLabel}>Graduation Project Name</label>
            <input
              className={styles.inputField}
              id='graduation_project_name'
              name='graduation_project_name'
              value={formik.values.graduation_project_name}
              onChange={formik.handleChange}
            />
            {formik.touched.graduation_project_name &&
            formik.errors.graduation_project_name ? (
              <div className={styles.error}>
                {formik.errors.graduation_project_name}
              </div>
            ) : null}
          </div>
          <div className={styles.inputContainer}>
            <label className={styles.inputLabel}>Team Number</label>
            <input
              className={styles.inputField}
              id='team_number'
              name='team_number'
              type='number'
              value={formik.values.team_number}
              onChange={formik.handleChange}
            />
            {formik.touched.team_number && formik.errors.team_number ? (
              <div className={styles.error}>{formik.errors.team_number}</div>
            ) : null}
          </div>
          <div className={styles.inputContainer}>
            <label className={styles.inputLabel}>Students</label>
            <Select
              styles={selectStyles}
              isMulti
              closeMenuOnSelect={false}
              options={students}
              id='students'
              name='students'
              value={formik.values.students}
              onChange={(val) => formik.setFieldValue('students', val)}
            />
            {formik.touched.project_year && formik.errors.project_year ? (
              <div className={styles.error}>{formik.errors.project_year}</div>
            ) : null}
          </div>
          <div className={styles.inputContainer}>
            <label className={styles.inputLabel}>Product Name</label>
            <input
              className={styles.inputField}
              id='product_name'
              name='product_name'
              value={formik.values.product_name}
              onChange={formik.handleChange}
            />
            {formik.touched.product_name && formik.errors.product_name ? (
              <div className={styles.error}>{formik.errors.product_name}</div>
            ) : null}
          </div>
          <div className={styles.inputContainer}>
            <label className={styles.inputLabel}>Project Year</label>
            <Select
              styles={selectStyles}
              isMulti={false}
              options={years}
              id='project_year'
              name='project_year'
              value={formik.values.project_year}
              onChange={(val) => formik.setFieldValue('project_year', val)}
            />
            {formik.touched.project_year && formik.errors.project_year ? (
              <div className={styles.error}>{formik.errors.project_year}</div>
            ) : null}
          </div>
          <div className={styles.inputContainer}>
            <label className={styles.inputLabel}>Project Semester</label>
            <Select
              styles={selectStyles}
              isMulti={false}
              options={[
                { value: 'Spring Summer', label: 'Spring Summer' },
                { value: 'Fall Spring', label: 'Fall Spring' },
                { value: 'Spring Fall', label: 'Spring Fall' },
              ]}
              id='semester'
              name='semester'
              value={formik.values.semester}
              onChange={(val) => formik.setFieldValue('semester', val)}
            />
            {formik.touched.semester && formik.errors.semester ? (
              <div className={styles.error}>{formik.errors.semester}</div>
            ) : null}
          </div>
          <div className={styles.inputContainer}>
            <label className={styles.inputLabel}>Description</label>
            <textarea
              className={styles.inputField}
              rows={5}
              isMulti={false}
              id='project_description'
              name='project_description'
              value={formik.values.project_description}
              onChange={formik.handleChange}
            />
            {formik.touched.project_description &&
            formik.errors.project_description ? (
              <div className={styles.error}>
                {formik.errors.project_description}
              </div>
            ) : null}
          </div>
          <div className={styles.inputContainer}>
            <label className={styles.inputLabel}>Supervisor</label>
            <Select
              styles={selectStyles}
              isMulti={false}
              options={supervisors}
              id='advisor_id'
              name='advisor_id'
              value={formik.values.advisor_id}
              onChange={(val) => formik.setFieldValue('advisor_id', val)}
            />
            {formik.touched.advisor_id && formik.errors.advisor_id ? (
              <div className={styles.error}>{formik.errors.advisor_id}</div>
            ) : null}
          </div>
          <div className={styles.inputContainer}>
            <label className={styles.inputLabel}>Project Type</label>
            <Select
              styles={selectStyles}
              isMulti={false}
              options={[
                { value: 'Company', label: 'Company' },
                { value: 'Instructor', label: 'Instructor' },
                { value: 'Student', label: 'Student' },
              ]}
              id='project_type'
              name='project_type'
              value={formik.values.project_type}
              onChange={(val) => formik.setFieldValue('project_type', val)}
            />
            {formik.touched.project_type && formik.errors.project_type ? (
              <div className={styles.error}>{formik.errors.project_type}</div>
            ) : null}
          </div>

          <div className={styles.inputContainer}>
            <label className={styles.inputLabel}>Team Picture</label>
            <input
              className={styles.inputField}
              type='file'
              accept='image/png, image/gif, image/jpeg'
              id='team_pic'
              name='team_pic'
              value={formik.values.team_pic}
              onChange={(event) => setTeamPic(event.target.files[0])}
            />
            {formik.touched.team_pic && formik.errors.team_pic ? (
              <div className={styles.error}>{formik.errors.team_pic}</div>
            ) : null}
          </div>
          <div className={styles.inputContainer}>
            <label className={styles.inputLabel}>Poster Picture</label>
            <input
              className={styles.inputField}
              type='file'
              accept='image/png, image/gif, image/jpeg'
              id='poster_pic'
              name='poster_pic'
              value={formik.values.poster_pic}
              onChange={(event) => {
                setPosterPic(event.target.files[0])
              }}
            />
            {formik.touched.poster_pic && formik.errors.poster_pic ? (
              <div className={styles.error}>{formik.errors.poster_pic}</div>
            ) : null}
          </div>

          <div className={styles.inputContainer}>
            <label className={styles.inputLabel}>Sponsor</label>
            <Select
              styles={selectStyles}
              isMulti={false}
              options={companies}
              id='company_id'
              name='company_id'
              value={formik.values.company_id}
              onChange={(val) => formik.setFieldValue('company_id', val)}
            />
            {formik.touched.company_id && formik.errors.company_id ? (
              <div className={styles.error}>{formik.errors.company_id}</div>
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

export default GraduationProjectForm
