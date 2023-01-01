import { useEffect, useState } from 'react'
import { PencilSquare } from 'react-bootstrap-icons'
import { Modal, Button, Accordion } from 'react-bootstrap'
import styles from './ProfileEditModal.module.css'
import { Field, Form, Formik, useFormik, FieldArray } from 'formik'
import {
  fetchAllCompanies,
  fetchAllDegreeTypes,
  fetchAllEducationInstitutes,
  fetchAllHighSchool,
  fetchAllSkillTypes,
  fetchAllSocieties,
} from '../../../helpers/searchHelpers'

const PersonalInformationForm = ({
  user,
  socials,
  phone,
  email,
  careerObjectives,
  location,
}) => {
  return (
    <Formik
      initialValues={{
        user,
        socials,
        phone,
        email,
        careerObjectives,
        location,
      }}
      enableReinitialize
      onSubmit={(values) => console.log(values)}
    >
      {(props) => {
        // console.log(props)
        return (
          <>
            <Form>
              <div>
                <label>Name: </label>
                <Field
                  disabled
                  id='user.name'
                  name='user.name'
                  placeholder='name'
                />
              </div>
              <div>
                <label>Career Objectives: </label>
                <Field
                  as='textarea'
                  id='careerObjectives[0].career_objective'
                  name='careerObjectives[0].career_objective'
                  placeholder='Enter your career objectives...'
                />
                <label>Visibility: </label>
                <Field
                  type='checkbox'
                  id='careerObjectives.visibility'
                  name='careerObjectives.visibility'
                  placeholder='name'
                />
              </div>
              <div>
                <label>City: </label>
                <Field
                  id='location[0].city_name'
                  name='location[0].city_name'
                  placeholder='Enter your city...'
                />
                <label>Country: </label>
                <Field
                  id='location[0].country_name'
                  name='location[0].country_name'
                  placeholder='Enter your country...'
                />
                <label>Visibility: </label>
                <Field
                  type='checkbox'
                  id='location[0].visibility'
                  name='location[0].visibility'
                />
              </div>
              <FieldArray
                name='socials'
                render={(arrayHelpers) => (
                  <div>
                    {props.values.socials && props.values.socials.length > 0 ? (
                      props.values.socials.map((social, index) => {
                        return (
                          <div key={index}>
                            <label>Social Media:</label>
                            <Field
                              as='select'
                              name={`socials[${index}]social_media_name`}
                              id={`socials[${index}]social_media_name`}
                            >
                              <option value='Facebook'>Facebook</option>
                              <option value='Linkedin'>LinkedIn</option>
                              <option value='Other'>Other</option>
                            </Field>
                            <label>Link:</label>
                            <Field
                              name={`socials[${index}]link`}
                              id={`socials[${index}]link`}
                            />
                            <label>Visibility:</label>
                            <Field
                              type='checkbox'
                              name={`socials[${index}]visibility`}
                              id={`socials[${index}]visibility`}
                            />
                            <button
                              type='button'
                              onClick={() => arrayHelpers.remove(index)} // remove a friend from the list
                            >
                              -
                            </button>
                          </div>
                        )
                      })
                    ) : (
                      <button
                        type='button'
                        onClick={() => arrayHelpers.push('')}
                      >
                        Add a Social Media
                      </button>
                    )}
                    <button
                      type='button'
                      onClick={() => arrayHelpers.push('')} // insert an empty string at a position
                    >
                      +
                    </button>
                  </div>
                )}
              />
              <FieldArray
                name='phone'
                render={(arrayHelpers) => (
                  <div>
                    {props.values.phone && props.values.phone.length > 0 ? (
                      props.values.phone.map((p, index) => {
                        return (
                          <div key={index}>
                            <label>Phone Number:</label>
                            <Field
                              name={`phone[${index}]phone_number`}
                              id={`phone[${index}]phone_number`}
                            />
                            <label>Visibility:</label>
                            <Field
                              type='checkbox'
                              name={`phone[${index}]visibility`}
                              id={`phone[${index}]visibility`}
                            />
                            <button
                              type='button'
                              onClick={() => arrayHelpers.remove(index)} // remove a friend from the list
                            >
                              -
                            </button>
                          </div>
                        )
                      })
                    ) : (
                      <button
                        type='button'
                        onClick={() => arrayHelpers.push('')}
                      >
                        Add a Phone Number
                      </button>
                    )}
                    <button
                      type='button'
                      onClick={() => arrayHelpers.push('')} // insert an empty string at a position
                    >
                      +
                    </button>
                  </div>
                )}
              />
              <FieldArray
                name='email'
                render={(arrayHelpers) => (
                  <div>
                    {props.values.email && props.values.email.length > 0 ? (
                      props.values.email.map((e, index) => {
                        return (
                          <div key={index}>
                            <label>Email:</label>
                            <Field
                              name={`email[${index}]email_address`}
                              id={`email[${index}]email_address`}
                            />
                            <label>Visibility:</label>
                            <Field
                              type='checkbox'
                              name={`email[${index}]visibility`}
                              id={`email[${index}]visibility`}
                            />
                            <button
                              type='button'
                              onClick={() => arrayHelpers.remove(index)} // remove a friend from the list
                            >
                              -
                            </button>
                          </div>
                        )
                      })
                    ) : (
                      <button
                        type='button'
                        onClick={() => arrayHelpers.push('')}
                      >
                        Add an Email
                      </button>
                    )}
                    <button
                      type='button'
                      onClick={() => arrayHelpers.push('')} // insert an empty string at a position
                    >
                      +
                    </button>
                  </div>
                )}
              />
              <div>
                <button type='submit'>Submit</button>
              </div>
            </Form>
          </>
        )
      }}
    </Formik>
  )
}

const WorkInformationForm = ({ workRecords }) => {
  const [companies, setCompanies] = useState([])
  useEffect(() => {
    fetchAllCompanies().then((res) => setCompanies(res))
  }, [])

  const handleSubmit = (values) => {
    console.log(values)
  }

  return (
    <Formik
      initialValues={{ workRecords }}
      enableReinitialize
      onSubmit={handleSubmit}
    >
      {(props) => (
        <Form>
          <FieldArray
            name='workRecords'
            render={(arrayHelpers) => (
              <div>
                {props.values.workRecords &&
                props.values.workRecords.length > 0 ? (
                  props.values.workRecords.map((workRecord, index) => {
                    // console.log(workRecord)
                    return (
                      <div
                        style={{
                          borderBottom: '1px solid #999',
                          padding: '10px 0',
                          position: 'relative',
                        }}
                        key={index}
                      >
                        <p>
                          <label>Company:</label>
                          <Field
                            name={`workRecords[${index}]company_name`}
                            id={`workRecords[${index}]company_name`}
                            as='select'
                          >
                            <option value='' selected disabled hidden>
                              Choose here
                            </option>
                            {companies.map((company, i) => {
                              return (
                                <option value={company.company_name}>
                                  {company.company_name}
                                </option>
                              )
                            })}
                          </Field>
                        </p>
                        <p>
                          <label>City:</label>
                          <Field
                            name={`workRecords[${index}]city_name`}
                            id={`workRecords[${index}]city_name`}
                          />
                        </p>
                        <p>
                          <label>Country:</label>
                          <Field
                            name={`workRecords[${index}]country_name`}
                            id={`workRecords[${index}]country_name`}
                          />
                        </p>
                        <p>
                          <label>Department:</label>
                          <Field
                            name={`workRecords[${index}]department`}
                            id={`workRecords[${index}]department`}
                          />
                        </p>
                        <p>
                          <label>Position:</label>
                          <Field
                            name={`workRecords[${index}]position`}
                            id={`workRecords[${index}]position`}
                          />
                        </p>
                        <p>
                          <label>Work Type:</label>
                          <Field
                            component='select'
                            defaultValue='Full Time'
                            name={`workRecords[${index}]type_name`}
                            id={`workRecords[${index}]type_name`}
                          >
                            <option value='' selected disabled hidden>
                              Choose here
                            </option>
                            <option value='Full Time'>Full Time</option>
                            <option value='Part Time'>Part Time</option>
                            <option value='Freelance'>Freelance</option>
                          </Field>
                        </p>
                        <p>
                          <label>Currently Working:</label>
                          <Field
                            type='checkbox'
                            name={`workRecords[${index}]is_current`}
                            id={`workRecords[${index}]is_current`}
                          />
                        </p>
                        <p>
                          <label>Start Date:</label>
                          <Field
                            name={`workRecords[${index}]start_date`}
                            id={`workRecords[${index}]start_date`}
                          />
                          <label>End Date:</label>
                          <Field
                            disabled={workRecord.is_current == true}
                            name={`workRecords[${index}]end_date`}
                            id={`workRecords[${index}]end_date`}
                          />

                          {/* <Field
                            name='end_data'
                            component={DateTimePicker}
                            inputVariant='outlined'
                            label='Zoned Date and Time'
                            helperText='Timezone specified'
                            clearable
                            margin='dense'
                          /> */}
                        </p>
                        <p>
                          <label>Visibility:</label>
                          <Field
                            type='checkbox'
                            name={`workRecords[${index}]visibility`}
                            id={`workRecords[${index}]visibility`}
                          />
                        </p>
                        <div
                          style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                          }}
                        >
                          <button
                            type='button'
                            onClick={() => arrayHelpers.remove(index)} // remove a friend from the list
                          >
                            -
                          </button>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <button type='button' onClick={() => arrayHelpers.push('')}>
                    Add Work Record
                  </button>
                )}
                <button
                  type='button'
                  onClick={() => arrayHelpers.push('')} // insert an empty string at a position
                >
                  +
                </button>
                <button type='submit'>Submit</button>
              </div>
            )}
          />
        </Form>
      )}
    </Formik>
  )
}

const SocietiesInformationForm = ({ societies }) => {
  const [studentSocieties, setStudentSocieties] = useState([])
  useEffect(() => {
    fetchAllSocieties().then((res) => setStudentSocieties(res))
  }, [])

  const onSubmitHandler = (values) => {
    console.log(values)
  }
  return (
    <Formik
      initialValues={{ societies }}
      enableReinitialize
      onSubmit={onSubmitHandler}
    >
      {(props) => (
        <Form>
          <FieldArray
            name='societies'
            render={(arrayHelpers) => (
              <div>
                {props.values.societies && props.values.societies.length > 0 ? (
                  props.values.societies.map((society, index) => {
                    // console.log(workRecord)
                    return (
                      <div
                        style={{
                          borderBottom: '1px solid #999',
                          padding: '10px 0',
                          position: 'relative',
                        }}
                        key={index}
                      >
                        <p>
                          <label>Society Name:</label>
                          <Field
                            component='select'
                            name={`societies[${index}]society_name`}
                            id={`societies[${index}]society_name`}
                          >
                            <option value='' disabled selected hidden>
                              Select here
                            </option>
                            {studentSocieties.map((s) => (
                              <option value={s.society_name}>
                                {s.society_name}
                              </option>
                            ))}
                          </Field>
                        </p>
                        <p>
                          <label>Active:</label>
                          <Field
                            type='checkbox'
                            name={`societies[${index}]activity_status`}
                            id={`societies[${index}]activity_status`}
                          />
                        </p>
                        <p>
                          <label>Visibility:</label>
                          <Field
                            type='checkbox'
                            name={`societies[${index}]visibility`}
                            id={`societies[${index}]visibility`}
                          />
                        </p>
                        <div
                          style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                          }}
                        >
                          <button
                            type='button'
                            onClick={() => arrayHelpers.remove(index)} // remove a friend from the list
                          >
                            -
                          </button>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <button type='button' onClick={() => arrayHelpers.push('')}>
                    Add Society
                  </button>
                )}
                <button
                  type='button'
                  onClick={() => arrayHelpers.push('')} // insert an empty string at a position
                >
                  +
                </button>
                <button type='submit'>Submit</button>
              </div>
            )}
          />
        </Form>
      )}
    </Formik>
  )
}

const EducationInformationForm = ({ eduRecords }) => {
  const [eduInsts, setEduInsts] = useState([])
  const [degreeTypes, setDegreeTypes] = useState([])
  useEffect(() => {
    fetchAllEducationInstitutes().then((res) => {
      setEduInsts(res)
    })
    fetchAllDegreeTypes().then((res) => setDegreeTypes(res))
  }, [])

  const onSubmitHandler = (values) => {
    console.log(values)
  }
  return (
    <Formik
      initialValues={{ eduRecords }}
      enableReinitialize
      onSubmit={onSubmitHandler}
    >
      {(props) => (
        <Form>
          <FieldArray
            name='eduRecords'
            render={(arrayHelpers) => {
              return (
                <div>
                  {props.values.eduRecords &&
                  props.values.eduRecords.length > 0 ? (
                    props.values.eduRecords.map((eduRecord, index) => {
                      // console.log(workRecord)
                      return (
                        <div
                          style={{
                            borderBottom: '1px solid #999',
                            padding: '10px 0',
                            position: 'relative',
                          }}
                          key={index}
                        >
                          <p>
                            <label>Institute Name:</label>
                            <Field
                              component='select'
                              name={`eduRecords[${index}]inst_name`}
                              id={`eduRecords[${index}]inst_name`}
                            >
                              <option value='' hidden disabled selected>
                                Select here
                              </option>
                              {eduInsts.map((inst) => {
                                return (
                                  <option value={inst.inst_name}>
                                    {inst.inst_name} | {inst.city_name},{' '}
                                    {inst.country_name}
                                  </option>
                                )
                              })}
                            </Field>
                          </p>
                          <p>
                            <label>Name of Degree:</label>
                            <Field
                              component='select'
                              name={`eduRecords[${index}]degree_name`}
                              id={`eduRecords[${index}]degree_name`}
                            >
                              <option value='' disabled hidden selected>
                                Select here
                              </option>
                              {degreeTypes.map((degree) => (
                                <option value={degree.degree_name}>
                                  {degree.degree_name}
                                </option>
                              ))}
                            </Field>
                          </p>
                          <p>
                            <label>Name of Program:</label>
                            <Field
                              name={`eduRecords[${index}]name_of_program`}
                              id={`eduRecords[${index}]name_of_program`}
                            />
                          </p>
                          <p>
                            <label>Currently Studying:</label>
                            <Field
                              type='checkbox'
                              name={`eduRecords[${index}]is_current`}
                              id={`eduRecords[${index}]is_current`}
                            />
                          </p>
                          <p>
                            <label>Start Date:</label>
                            <Field
                              name={`eduRecords[${index}]start_date`}
                              id={`eduRecords[${index}]start_date`}
                            />
                            <label>End Date:</label>
                            <Field
                              disabled={eduRecord.is_current == true}
                              name={`eduRecords[${index}]end_date`}
                              id={`eduRecords[${index}]end_date`}
                            />
                          </p>
                          <p>
                            <label>Visibility:</label>
                            <Field
                              type='checkbox'
                              name={`eduRecords[${index}]visibility`}
                              id={`eduRecords[${index}]visibility`}
                            />
                          </p>
                          <div
                            style={{
                              position: 'absolute',
                              top: '20px',
                              right: '20px',
                            }}
                          >
                            <button
                              type='button'
                              onClick={() => arrayHelpers.remove(index)} // remove a friend from the list
                            >
                              -
                            </button>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <button type='button' onClick={() => arrayHelpers.push('')}>
                      Add Work Record
                    </button>
                  )}
                  <button
                    type='button'
                    onClick={() => arrayHelpers.push('')} // insert an empty string at a position
                  >
                    +
                  </button>
                  <button type='submit'>Submit</button>
                </div>
              )
            }}
          />
        </Form>
      )}
    </Formik>
  )
}

const CertificatesInformationForm = ({ certificates }) => {
  const onSubmitHandler = (values) => {
    console.log(values)
  }
  return (
    <Formik
      enableReinitialize
      initialValues={{ certificates }}
      onSubmit={onSubmitHandler}
    >
      {(props) => (
        <Form>
          <FieldArray
            name='certificates'
            render={(arrayHelpers) => (
              <div>
                {props.values.certificates &&
                props.values.certificates.length > 0 ? (
                  props.values.certificates.map((certificate, index) => {
                    // console.log(workRecord)
                    return (
                      <div
                        style={{
                          borderBottom: '1px solid #999',
                          padding: '10px 0',
                          position: 'relative',
                        }}
                        key={index}
                      >
                        <p>
                          <label>Certificate Title:</label>
                          <Field
                            type='text'
                            name={`certificates[${index}]certificate_name`}
                            id={`certificates[${index}]certificate_name`}
                          />
                        </p>
                        <p>
                          <label>Issuing Authority:</label>
                          <Field
                            name={`certificates[${index}]issuing_authority`}
                            id={`certificates[${index}]issuing_authority`}
                          />
                        </p>
                        <p>
                          <label>Visibility:</label>
                          <Field
                            type='checkbox'
                            name={`certificates[${index}]visibility`}
                            id={`certificates[${index}]visibility`}
                          />
                        </p>
                        <div
                          style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                          }}
                        >
                          <button
                            type='button'
                            onClick={() => arrayHelpers.remove(index)} // remove a friend from the list
                          >
                            -
                          </button>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <button type='button' onClick={() => arrayHelpers.push('')}>
                    Add Society
                  </button>
                )}
                <button
                  type='button'
                  onClick={() => arrayHelpers.push('')} // insert an empty string at a position
                >
                  +
                </button>
                <button type='submit'>Submit</button>
              </div>
            )}
          />
        </Form>
      )}
    </Formik>
  )
}

const SkillsInformationForm = ({ skills }) => {
  const [skillTypes, setSkillTypes] = useState([])
  useEffect(() => {
    fetchAllSkillTypes().then((res) => setSkillTypes(res))
  }, [])
  const onSubmitHandler = (values) => {
    console.log(values)
  }

  return (
    <Formik
      initialValues={{ skills }}
      enableReinitialize
      onSubmit={onSubmitHandler}
    >
      {(props) => (
        <Form>
          <FieldArray
            name='skills'
            render={(arrayHelpers) => (
              <div>
                {props.values.skills && props.values.skills.length > 0 ? (
                  props.values.skills.map((skill, index) => {
                    return (
                      <div
                        style={{
                          borderBottom: '1px solid #999',
                          padding: '10px 0',
                          position: 'relative',
                        }}
                        key={index}
                      >
                        <p>
                          <label>Skill Type:</label>
                          <Field
                            as='select'
                            name={`skills[${index}]type_name`}
                            id={`skills[${index}]type_name`}
                          >
                            <option value='' hidden selected disabled>
                              Select here
                            </option>
                            {skillTypes.map((skillType) => (
                              <option value={skillType.type_name}>
                                {skillType.type_name}
                              </option>
                            ))}
                          </Field>
                        </p>
                        <p>
                          <label>Skill Name:</label>
                          <Field
                            type='text'
                            name={`skills[${index}]skill_name`}
                            id={`skills[${index}]skill_name`}
                          />
                        </p>
                        <p>
                          <label>Skill Level:</label>
                          <Field
                            type='number'
                            name={`skills[${index}]skill_level`}
                            id={`skills[${index}]skill_level`}
                          />
                        </p>
                        <p>
                          <label>Visibility:</label>
                          <Field
                            type='checkbox'
                            name={`skills[${index}]visibility`}
                            id={`skills[${index}]visibility`}
                          />
                        </p>
                        <div
                          style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                          }}
                        >
                          <button
                            type='button'
                            onClick={() => arrayHelpers.remove(index)} // remove a friend from the list
                          >
                            -
                          </button>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <button type='button' onClick={() => arrayHelpers.push('')}>
                    Add Society
                  </button>
                )}
                <button
                  type='button'
                  onClick={() => arrayHelpers.push('')} // insert an empty string at a position
                >
                  +
                </button>
                <button type='submit'>Submit</button>
              </div>
            )}
          />
        </Form>
      )}
    </Formik>
  )
}

const HighSchoolInformationForm = ({ highSchool }) => {
  const [highSchools, setHighSchools] = useState([])
  useEffect(() => {
    fetchAllHighSchool().then((res) => setHighSchools(res))
  }, [])

  //   console.log(highSchool[0])
  const onSubmitHandler = (values) => [console.log(values)]

  return (
    <Formik
      enableReinitialize
      initialValues={{ highSchool }}
      onSubmit={onSubmitHandler}
    >
      <Form name='highSchool'>
        <p>
          <label>High School Name:</label>
          <Field
            as='select'
            id='highSchool[0].high_school_name'
            name='highSchool[0].high_school_name'
          >
            <option hidden disabled selected>
              Select here
            </option>
            {highSchools.map((datum) => (
              <option value={datum.high_school_name}>
                {datum.high_school_name}
              </option>
            ))}
          </Field>
        </p>
        <p>
          <label>Visibility:</label>
          <Field
            type='checkbox'
            id='highSchool[0].visibility'
            name='highSchool[0].visibility'
          />
        </p>
      </Form>
    </Formik>
  )
}

const ProfileEditModal = ({ meta, user }) => {
  const [show, setShow] = useState(false)
  const {
    cert,
    eduRecords,
    email,
    erasmus,
    workRecords,
    phone,
    socials,
    skills,
    pfp,
    wantSectors,
    location,
    societies,
    internships,
    careerObjectives,
    highSchool,
  } = meta
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  //   console.log(user)
  useEffect(() => {
    user.name = user.first_name + ' ' + user.last_name
  }, [])

  return (
    <>
      <div
        onClick={handleShow}
        className='mx-1'
        style={{ display: 'inline-block' }}
      >
        <div className={styles.editBtn}>
          <PencilSquare color='black' />
        </div>
      </div>

      <Modal
        size='lg'
        show={show}
        onHide={handleClose}
        backdrop='static'
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Modal title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Accordion defaultActiveKey='0' flush>
            <Accordion.Item eventKey='0'>
              <Accordion.Header>Personal Information</Accordion.Header>
              <Accordion.Body style={{ overflowY: 'scroll' }}>
                <PersonalInformationForm
                  user={user}
                  location={location}
                  socials={socials}
                  email={email}
                  phone={phone}
                  careerObjectives={careerObjectives}
                />
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey='1'>
              <Accordion.Header>Work Information</Accordion.Header>
              <Accordion.Body>
                <WorkInformationForm workRecords={workRecords} />
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey='2'>
              <Accordion.Header>Education Information</Accordion.Header>
              <Accordion.Body>
                <EducationInformationForm eduRecords={eduRecords} />
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey='3'>
              <Accordion.Header>High School Information</Accordion.Header>
              <Accordion.Body>
                <HighSchoolInformationForm highSchool={highSchool} />
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey='4'>
              <Accordion.Header>Certificates</Accordion.Header>
              <Accordion.Body>
                <CertificatesInformationForm certificates={cert} />
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey='5'>
              <Accordion.Header>Skills</Accordion.Header>
              <Accordion.Body>
                <SkillsInformationForm skills={skills} />
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey='6'>
              <Accordion.Header>Socieites</Accordion.Header>
              <Accordion.Body>
                <SocietiesInformationForm societies={societies} />
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ProfileEditModal
