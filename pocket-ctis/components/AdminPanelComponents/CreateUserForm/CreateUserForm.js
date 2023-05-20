import { ChevronLeft } from 'react-bootstrap-icons'
import styles from './CreateUserForm.module.css'
import { Card } from 'react-bootstrap'
import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import { _getFetcher, _submitFetcher } from '../../../helpers/fetchHelpers'
import { toast } from 'react-toastify'
import { craftUrl } from '../../../helpers/urlHelper'
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner'
import Select from 'react-select'
import * as Yup from 'yup'
import { clone } from 'lodash'
import { replaceWithNull } from '../../../helpers/submissionHelpers'

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    borderColor: 'rgb(245, 164, 37)',
  }),
  menu: (provided, state) => ({
    ...provided,
    zIndex: 2,
  }),
}

const CreateUserForm = ({ activeItem, goBack }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [accountTypes, setAccountTypes] = useState([])
  const [refreshKey, setRefreshKey] = useState(Math.random().toString(36))

  useEffect(() => {
    _getFetcher({ types: craftUrl(['accounttypes']) })
      .then(({ types }) => {
        if (types?.data) {
          const data = types.data.map((type) => ({
            value: `${type.id}-${type.type_name}`,
            label: type.type_name,
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
    const data = clone(values)
    data.user[0].types = data.user[0].types.map(
        (role) => Number(role.value.split('-')[0])
    )
    data.user[0].gender = data.user[0].gender.value == 'Female' ? 1 : 0
    replaceWithNull(data)
    if(activeItem){
      data.user[0].id = activeItem.id;
      const res = await _submitFetcher('PUT', craftUrl(['users']), {user: data.user[0]})
      if(res?.errors?.length && !res.data){
        toast.error(res.errors[0].error)
      }else{
        toast.success("User saved successfully")
        if(res.data === true)
          toast.success("Admin account activation mail successfully sent to user!");
      }
    }else{
      const res = await _submitFetcher('POST', craftUrl(['users']), {
        users: data.user,
      })
      if (res.data['0']?.data?.mail_status && !res.errors?.length) {
        toast.success('User created successfully!')
        toast.success('Activation mail successfully sent to user!')
      } else {
        toast.error(res.errors[0].error)
      }
    }
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      user: [
        {
          types: null,
          gender: null,
          first_name: null,
          last_name: null,
          nee: null,
          bilkent_id: null,
          contact_email: null,
        },
      ],
    },
    validationSchema: Yup.object({
      user: Yup.array().of(
        Yup.object({
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
        })
      ),
    }),
    onSubmit: (values) => {
      onSubmitHandler(values)
    },
  })

  useEffect(() => {
    if (activeItem) {
      const acTypes = activeItem.user_types.split(',').map((t) => {
        return accountTypes.find((a) => a.label == t)
      })
      formik.setValues({
        user: [
          {
            types: acTypes,
            gender:
              activeItem.gender == 1
                ? { value: 'Female', label: 'Female' }
                : { value: 'Male', label: 'Male' },
            first_name: activeItem.first_name,
            last_name: activeItem.last_name,
            nee: activeItem.nee,
            bilkent_id: activeItem.bilkent_id,
            contact_email: activeItem.contact_email,
          },
        ],
      })
    } else {
      formik.resetForm()
      setRefreshKey(Math.random().toString(36))
    }
  }, [activeItem])

  const goBackHandler = () => {
    formik.resetForm({
      values: {
        types: null,
        gender: null,
        first_name: null,
        nee: null,
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
      <div className={styles.headerContainer} onClick={goBackHandler}>
        <span className={styles.backButton}>
          <ChevronLeft />
        </span>
        <h4 className='m-0'>{activeItem ? 'Edit User': 'Create User'}</h4>
      </div>
      <Card className={styles.defaultCard} border='light' key={refreshKey}>
        <form onSubmit={formik.handleSubmit}>
          <div className={styles.formContainer}>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ width: '35%' }}>
                <div className={styles.inputContainer}>
                  <label
                    htmlFor='user[0].first_name'
                    className={styles.inputLabel}
                  >
                    First Name
                  </label>
                  <input
                    value={formik.values.user?.[0].first_name}
                    onChange={formik.handleChange}
                    type='text'
                    id='first_name'
                    name='user[0].first_name'
                    className={styles.inputField}
                  />
                  {formik.touched.user?.[0].first_name &&
                  formik.errors.user?.[0].first_name ? (
                    <div className={styles.error}>
                      {formik.errors.user?.[0].first_name}
                    </div>
                  ) : null}
                </div>
              </div>
              {/* ------ */}
              <div style={{ width: '30%' }}>
                <div className={styles.inputContainer}>
                  <label htmlFor='nee' className={styles.inputLabel}>
                    Nee
                  </label>
                  <input
                      value={formik.values.user?.[0].nee}
                      onChange={formik.handleChange}
                      type='text'
                      name='user[0].nee'
                      id='nee'
                      className={styles.inputField}
                  />
                </div>
              </div>
              {/* ------ */}
              <div style={{ width: '35%' }}>
                <div className={styles.inputContainer}>
                  <label htmlFor='last_name' className={styles.inputLabel}>
                    Last Name
                  </label>
                  <input
                    value={formik.values.user?.[0].last_name}
                    onChange={formik.handleChange}
                    type='text'
                    id='last_name'
                    name='user[0].last_name'
                    className={styles.inputField}
                  />
                  {formik.touched.user?.[0].last_name &&
                  formik.errors.user?.[0].last_name ? (
                    <div className={styles.error}>
                      {formik.errors.user?.[0].last_name}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            {/* ------ */}
            <div style={{ display: 'flex', gap: 10 }} className='my-2'>
              <div style={{ width: '50%' }}>
                <div className={styles.inputContainer}>
                  <label htmlFor='bilkent_id' className={styles.inputLabel}>
                    BILKENT ID
                  </label>
                  <input
                    value={formik.values.user?.[0].bilkent_id}
                    onChange={formik.handleChange}
                    type='number'
                    name='user[0].bilkent_id'
                    id='bilkent_id'
                    className={styles.inputField}
                  />
                  {formik.touched.user?.[0].bilkent_id &&
                  formik.errors.user?.[0].bilkent_id ? (
                    <div className={styles.error}>
                      {formik.errors.user?.[0].bilkent_id}
                    </div>
                  ) : null}
                </div>
              </div>
              {/* ------ */}
              <div style={{ width: '50%' }}>
                <div className={styles.inputContainer}>
                  <label htmlFor='gender' className={styles.inputLabel}>
                    Gender
                  </label>
                  <Select
                    value={formik.values.user?.[0].gender}
                    onChange={(val) =>
                      formik.setFieldValue('user[0].gender', val)
                    }
                    id='gender'
                    name='user[0].gender'
                    styles={customStyles}
                    options={[
                      { value: 'Male', label: 'Male' },
                      { value: 'Female', label: 'Female' },
                    ]}
                  />
                  {formik.touched.user?.[0].gender &&
                  formik.errors.user?.[0].gender ? (
                    <div className={styles.error}>
                      {formik.errors.user?.[0].gender}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            {/* ------ */}
            <div className='my-2'>
              <div className={styles.inputContainer}>
                <label htmlFor='contact_email' className={styles.inputLabel}>
                  Email Address
                </label>
                <input
                  value={formik.values.user?.[0].contact_email}
                  onChange={formik.handleChange}
                  type='email'
                  id='contact_email'
                  name='user[0].contact_email'
                  className={styles.inputField}
                />
                {formik.touched.user?.[0].contact_email &&
                formik.errors.user?.[0].contact_email ? (
                  <div className={styles.error}>
                    {formik.errors.user?.[0].contact_email}
                  </div>
                ) : null}
              </div>
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor='types' className={styles.inputLabel}>
                Account Types
              </label>
              <Select
                value={formik.values.user?.[0].types}
                onChange={(val) => formik.setFieldValue('user[0].types', val)}
                isMulti
                closeMenuOnSelect={false}
                id='types'
                name='user[0].types'
                styles={customStyles}
                options={accountTypes}
              />
              {formik.touched.user?.[0].types &&
              formik.errors.user?.[0].types ? (
                <div className={styles.error}>
                  {formik.errors.user?.[0].types}
                </div>
              ) : null}
            </div>
            {/* ----- */}

            <div style={{ textAlign: 'center' }}>
              <button type='submit' className={styles.submitButton}>
                {activeItem ? 'Save User' : 'Create User'}
              </button>
            </div>
          </div>
        </form>
      </Card>
    </>
  )
}

export default CreateUserForm
