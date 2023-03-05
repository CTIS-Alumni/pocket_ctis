import styles from '../UserProfileFormStyles.module.css'
import { Formik, FieldArray, Form, Field } from 'formik'
import {
  EyeFill,
  EyeSlashFill,
  XCircleFill,
  PlusCircleFill,
} from 'react-bootstrap-icons'
import { cloneDeep } from 'lodash'
import {
  fetchAllSkills,
  fetchAllSkillTypes,
} from '../../../../helpers/searchHelpers'
import { useState, useEffect } from 'react'
import {createReqObject, submitChanges} from "../../../../helpers/fetchHelpers";
import {splitFields} from "../../../../helpers/formatHelpers";
import {craftUserUrl} from "../../../../helpers/urlHelper";

const SkillsInformationForm = ({ data }) => {
  const [skillType, setSkillType] = useState([])
  const [skills, setSkills] = useState([])

  useEffect(() => {
    fetchAllSkills().then((res) => setSkills(res.data))
    fetchAllSkillTypes().then((res) => setSkillType(res.data))
  }, [])

  let deletedData = [];

  const transformData = (data) => {
    let newData = cloneDeep(data)
    newData = newData.map((datum) => {
      datum.visibility = datum.visibility == 1
      datum.skill_type = `${datum.skill_type_id}-${datum.type_name}`
      datum.skill = `${datum.skill_id}-${datum.skill_name}`
      return datum
    })
    return newData
  }

  const onSubmit = async (values) =>{
    let newData = cloneDeep(values);
    newData.skills = newData.skills.map((val) => {
      val.visibility = val.visibility ? 1 : 0
      splitFields(val, ["skill_type", "skill"]);
      return val;
    });

    const requestObj = createReqObject(data, newData.skills, deletedData);
    const url = craftUserUrl(1, "userskills");
    const responseObj = await submitChanges(url, requestObj);
    deletedData = [];
  }

  return (
    <Formik
      enableReinitialize
      initialValues={{ skills: transformData(data) }}
      onSubmit={onSubmit}
    >
      {(props) => (
        <Form>
          <table style={{ width: '100%' }}>
            <tbody>
              <FieldArray
                name='skills'
                render={(arrayHelpers) => {
                  return (
                    <>
                      <tr>
                        <td colSpan={3}>
                          <div
                            className={styles.formPartitionHeading}
                            style={{ marginTop: 0 }}
                          >
                            <span>Skills</span>
                            <button
                              className={styles.addButton}
                              type='button'
                              onClick={() => arrayHelpers.insert(0, '')}
                            >
                              <PlusCircleFill size={20} />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {props.values.skills && props.values.skills.length > 0 ? (
                        props.values.skills.map((skill, index) => {
                          return (
                            <>
                              <tr key={index} style={{ width: '100%' }}>
                                <td>
                                  <div style={{ display: 'flex' }}>
                                    <div className={styles.removeBtnContainer}>
                                      <button
                                        className={styles.removeBtn}
                                        type='button'
                                        onClick={() =>{
                                          arrayHelpers.remove(index);
                                          if(skill.hasOwnProperty("id"))
                                            deletedData.push({name: skill.id, id: skill.id});
                                        }}
                                      >
                                        <XCircleFill
                                          size={13}
                                          className={styles.removeIcon}
                                        />
                                      </button>
                                    </div>
                                    <div style={{ flexGrow: '1' }}>
                                      <div className={styles.inputContainer}>
                                        <label className={styles.inputLabel}>
                                          Skill Type
                                        </label>
                                        <Field
                                          as='select'
                                          className={styles.inputField}
                                          id={`skills[${index}]skill_type`}
                                          name={`skills[${index}]skill_type`}
                                        >
                                          <option disabled selected value=''>
                                            Please Select skill type
                                          </option>
                                          {skillType.map((type) => (
                                            <option
                                              value={`${type.id}-${type.skill_type_name}`}
                                            >
                                              {type.skill_type_name}
                                            </option>
                                          ))}
                                        </Field>
                                      </div>
                                      <div
                                        style={{
                                          display: 'flex',
                                          justifyContent: 'space-between',
                                        }}
                                      >
                                        <div
                                          className={styles.inputContainer}
                                          style={{ width: '49%' }}
                                        >
                                          <label className={styles.inputLabel}>
                                            Skill Name
                                          </label>
                                          <Field
                                            as='select'
                                            className={styles.inputField}
                                            id={`skills[${index}]skill`}
                                            name={`skills[${index}]skill`}
                                            disabled={!skill.skill_type}
                                          >
                                            <option selected disabled value=''>
                                              Please select a Skill
                                            </option>
                                            {skills
                                              .filter(
                                                (s) =>
                                                  skill.skill_type?.split(
                                                    '-'
                                                  )[0] == s.skill_type_id
                                              )
                                              .map((s) => (
                                                <option
                                                  value={`${s.id}-${s.skill_name}`}
                                                >
                                                  {s.skill_name}
                                                </option>
                                              ))}
                                          </Field>
                                        </div>
                                        <div
                                          className={styles.inputContainer}
                                          style={{ width: '49%' }}
                                        >
                                          <label className={styles.inputLabel}>
                                            Skill Level
                                          </label>
                                          <Field
                                            type='number'
                                            className={styles.inputField}
                                            id={`skills[${index}]skill_level`}
                                            name={`skills[${index}]skill_level`}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td
                                  className={styles.visibilityCheckboxContainer}
                                >
                                  <Field name={`skills[${index}]visibility`}>
                                    {({ field, form, meta }) => {
                                      return (
                                        <label>
                                          {field.value ? (
                                            <EyeFill
                                              size={20}
                                              className={`${styles.visibilityCheckbox} ${styles.visibilityUnchecked}`}
                                            />
                                          ) : (
                                            <EyeSlashFill
                                              size={20}
                                              className={`${styles.visibilityCheckbox}`}
                                            />
                                          )}
                                          <input
                                            type='checkbox'
                                            {...field}
                                            style={{ display: 'none' }}
                                          />
                                        </label>
                                      )
                                    }}
                                  </Field>
                                </td>
                              </tr>
                              {/* shows spaver only between records */}
                              {props.values.skills.length - 1 > index && (
                                <tr className={styles.spacer}>
                                  <td />
                                </tr>
                              )}
                            </>
                          )
                        })
                      ) : (
                        <tr>
                          <td>
                            <button
                              className={styles.bigAddBtn}
                              type='button'
                              onClick={() => arrayHelpers.push('')}
                            >
                              Add a Skill
                            </button>
                          </td>
                        </tr>
                      )}
                    </>
                  )
                }}
              />
            </tbody>
          </table>
          <div>
            <button type='submit' className={styles.submitBtn}>
              Submit
            </button>
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default SkillsInformationForm
