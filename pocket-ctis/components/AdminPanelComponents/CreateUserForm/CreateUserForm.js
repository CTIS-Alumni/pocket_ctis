import { ChevronLeft } from 'react-bootstrap-icons'
import styles from './CreateUserForm.module.css'
import { Card } from 'react-bootstrap'
import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import {_getFetcher, _submitFetcher} from '../../../helpers/fetchHelpers'
import { ToastContainer, toast } from 'react-toastify'
import { craftUrl } from '../../../helpers/urlHelper'
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner'
import Select from 'react-select'
import * as Yup from 'yup'
import { clone } from 'lodash'
import {replaceWithNull, splitFields} from "../../../helpers/submissionHelpers";

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    border: 'none',
    minHeight: '30px',
    height: '30px',
    borderRadius: '3px',
    backgroundColor: '#fff1c9',
    boxShadow: state.isFocused ? null : null,
  }),

  valueContainer: (provided, state) => ({
    ...provided,
    height: '30px',
    padding: '0 6px',
  }),

  input: (provided, state) => ({
    ...provided,
    margin: '0px',
  }),
  indicatorSeparator: (state) => ({
    display: 'none',
  }),
  indicatorsContainer: (provided, state) => ({
    ...provided,
    height: '30px',
  }),
}

const CreateUserForm = ({ goBack }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [accountTypes, setAccountTypes] = useState([])
  const [refreshKey, setRefreshKey] = useState(Math.random().toString(36))

  useEffect(() => {
    _getFetcher({ types: craftUrl(['accounttypes']) })
      .then(({ types }) => {
        if (types?.data) {
          const data = types.data.map((role) => ({
            value: `${role.id}-${role.type_name}`,
            label: role.type_name,
          }))
          setAccountTypes(data)
        } else {
          types.errors.map((error) => {
            toast.error(error)
          })
        }
      })
      .catch((err) => {
        console.log(err)
        toast.error('Error:', err)
      })
  }, [])

  const onSubmitHandler = async (values) => {

    const user = clone(values)
    user.types = user.types.map((role) => role.value.split("-")[0]);
    user.gender = user.gender.value == 'Male' ? 1 : 0
    replaceWithNull(user);

    console.log("heres user", user)
    const res = await _submitFetcher('POST', craftUrl(['users']), {users: [user]});
    console.log(res);

    /*formik.resetForm({
      values: {
        types: null,
        gender: null,
        first_name: null,
        last_name: null,
        bilkent_id: null,
        contact_email: null,
      },
    })*/
    setRefreshKey(Math.random().toString(36))
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      types: null,
      gender: null,
      first_name: null,
      last_name: null,
      bilkent_id: null,
      contact_email: null,
    },
    validationSchema: Yup.object({
      first_name: Yup.string()
        .max(15, 'Must be 15 characters or less')
        .required('Required'),
      last_name: Yup.string()
        .max(20, 'Must be 20 characters or less')
        .required('Required'),
      contact_email: Yup.string()
        .email('Invalid email address')
        .required('Required'),
      bilkent_id: Yup.number()
        .positive('Invalid BILKENT ID')
        .integer('Invalid BILKENT ID')
        .required('Required'),
      gender: Yup.object().required('Required'),
      types: Yup.array().required('Required'),
    }),

    onSubmit: (values) => {
      onSubmitHandler(values)
    },
  })

  const goBackHandler = () => {
    formik.resetForm({
      values: {
        types: null,
        gender: null,
        first_name: null,
        last_name: null,
        bilkent_id: null,
        contact_email: null,
      },
    })
    setRefreshKey(Math.random().toString(36))
    goBack()
  }


  return (
    <>
      <LoadingSpinner isLoading={isLoading} />
      <div className={styles.headerContainer}>
        <span className={styles.backButton}>
          <ChevronLeft onClick={goBackHandler} />
        </span>
        <h4 className='m-0'>Create User</h4>
      </div>
      <Card className={styles.defaultCard} border='light' key={refreshKey}>
        <form onSubmit={formik.handleSubmit}>
          <div className={styles.formContainer}>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ width: '50%' }}>
                <div>
                  <label htmlFor='first_name' className={styles.inputLabel}>
                    First Name
                  </label>
                </div>
                <div>
                  <input
                    value={formik.values.first_name}
                    onChange={formik.handleChange}
                    type='text'
                    name='first_name'
                    className={styles.inputField}
                  />
                  {formik.touched.first_name && formik.errors.first_name ? (
                    <div className={styles.error}>
                      {formik.errors.first_name}
                    </div>
                  ) : null}
                </div>
              </div>
              {/* ------ */}
              <div style={{ width: '50%' }}>
                <div>
                  <label htmlFor='last_name' className={styles.inputLabel}>
                    Last Name
                  </label>
                </div>
                <div>
                  <input
                    value={formik.values.last_name}
                    onChange={formik.handleChange}
                    type='text'
                    name='last_name'
                    className={styles.inputField}
                  />
                  {formik.touched.last_name && formik.errors.last_name ? (
                    <div className={styles.error}>{formik.errors.last_name}</div>
                  ) : null}
                </div>
              </div>
            </div>
            {/* ------ */}
            <div style={{ display: 'flex', gap: 10 }} className='my-2'>
              <div style={{ width: '50%' }}>
                <div>
                  <label htmlFor='bilkent_id' className={styles.inputLabel}>
                    BILKENT ID
                  </label>
                </div>
                <div>
                  <input
                    value={formik.values.bilkent_id}
                    onChange={formik.handleChange}
                    type='text'
                    name='bilkent_id'
                    className={styles.inputField}
                  />
                  {formik.touched.bilkent_id && formik.errors.bilkent_id ? (
                    <div className={styles.error}>
                      {formik.errors.bilkentId}
                    </div>
                  ) : null}
                </div>
              </div>
              {/* ------ */}
              <div style={{ width: '50%' }}>
                <div>
                  <label htmlFor='gender' className={styles.inputLabel}>
                    Gender
                  </label>
                </div>
                <div>
                  <Select
                    value={formik.values.gender}
                    onChange={(val) => formik.setFieldValue('gender', val)}
                    name='gender'
                    styles={customStyles}
                    options={[
                      { value: 'Male', label: 'Male' },
                      { value: 'Female', label: 'Female' },
                    ]}
                  />
                  {formik.touched.gender && formik.errors.gender ? (
                    <div className={styles.error}>{formik.errors.gender}</div>
                  ) : null}
                </div>
              </div>
            </div>
            {/* ------ */}
            <div className='my-2'>
              <div>
                <label htmlFor='contact_email' className={styles.inputLabel}>
                  Email Address
                </label>
              </div>
              <div>
                <input
                  value={formik.values.contact_email}
                  onChange={formik.handleChange}
                  type='email'
                  name='contact_email'
                  className={styles.inputField}
                />
                {formik.touched.contact_email && formik.errors.contact_email ? (
                  <div className={styles.error}>
                    {formik.errors.contact_email}
                  </div>
                ) : null}
              </div>
            </div>
            <div>
              <label htmlFor='types'>Roles</label>
              <Select
                value={formik.values.types}
                onChange={(val) => formik.setFieldValue('types', val)}
                isMulti
                closeMenuOnSelect={false}
                name='types'
                styles={customStyles}
                options={accountTypes}
              />
              {formik.touched.types && formik.errors.types ? (
                <div className={styles.error}>{formik.errors.types}</div>
              ) : null}
            </div>
            {/* ----- */}

            <div style={{ textAlign: 'center' }}>
              <button type='submit' className={styles.submitButton}>
                Create User
              </button>
            </div>
          </div>
        </form>
      </Card>
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
      />
    </>
  )
}

export default CreateUserForm

{
  /* <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              <Input name='first_name' label='First Name' type='text' />
              <Input name='last_name' label='Last Name' type='text' />
            </div>
            <Input
              name='contact_email'
              label='Email Address'
              type='email'
              className={styles.contact_emailInput}
            /> */
}
