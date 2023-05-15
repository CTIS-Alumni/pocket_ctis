import { useFormik } from 'formik'
import { useState, useEffect, useContext } from 'react'
import Select from 'react-select'
import styles from './GroupByClauseCreator.module.css'
import { Tables_Data } from '../../context/tablesContext'

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

const GroupByClauseCreator = ({ activeTables, setGroupSchema }) => {
  const [formatedGroupByStatment, setFormatedGroupByStatment] = useState('')
  const [groupsClauses, setGroupsClauses] = useState([])
  const [tableOptions, setTableOptions] = useState([])
  const [columnOptions, setColumnOptions] = useState([])

  const { tableColumns } = useContext(Tables_Data)

  useEffect(() => {
    const tables = []
    activeTables.forEach((d) => {
      if (!tables.includes(d)) tables.push(d)
    })

    setTableOptions(tables.map((t) => ({ value: t, label: t })))
  }, [activeTables])

  useEffect(() => {
    const str =
      groupsClauses.length > 0 ? (
        <>
          <div className={styles.clauseHolder}>
            GROUP BY&nbsp;
            {groupsClauses.map((column, idx) => (
              <span
                className={styles.removeable}
                onClick={() => removeGroup(column)}
              >
                {column}
                {idx != groupsClauses.length - 1 && ', '}
              </span>
            ))}
          </div>
        </>
      ) : (
        ''
      )
    setGroupSchema(groupsClauses)
    setFormatedGroupByStatment(str)
  }, [groupsClauses])

  const removeGroup = (column) => {
    const temp = groupsClauses.filter((g) => g != column)
    setGroupsClauses([...temp])
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { table: null, column: null },
    onSubmit: (val) => onSubmitHandler(val),
  })

  const getColumnOptions = (table) => {
    setColumnOptions(
      tableColumns[table].map((t) => ({ label: t, value: `${table}.${t}` }))
    )
  }

  const onSubmitHandler = (val) => {
    const groups = []
    val.column.forEach((v) => {
      if (!groupsClauses.includes(v.value)) groups.push(v.value)
    })

    setGroupsClauses([...groupsClauses, ...groups])
    formik.setFieldValue('table', null)
    formik.setFieldValue('column', null)
  }

  return (
    <div>
      <h5>GroupByClauseCreator</h5>
      <div
        style={{
          border: '1px solid rgb(245, 164, 37)',
          height: '100px',
          borderRadius: 5,
          background: 'rgba(239, 239, 239, 0.3)',
          margin: '10px 0',
          padding: '5px',
          overflowY: 'scroll',
        }}
      >
        {formatedGroupByStatment}
      </div>

      <form onSubmit={formik.handleSubmit} className={styles.inputsContainer}>
        <div className={styles.selectContainer}>
          <label htmlFor='table' className={styles.inputLabel}>
            Table
          </label>
          <Select
            name='table'
            id='table'
            className={styles.selectInput}
            isSearchable={true}
            options={tableOptions}
            styles={selectStyles}
            value={formik.values.table}
            onChange={(value) => {
              if (value != null) {
                formik.setFieldValue('table', value)
                formik.setFieldValue('column', null)
                getColumnOptions(value.value)
              } else {
                formik.setFieldValue('table', null)
                formik.setFieldValue('column', null)
              }
            }}
          />
        </div>
        <div className={styles.selectContainer}>
          <label htmlFor='column' className={styles.inputLabel}>
            Columns
          </label>
          <Select
            name='column'
            id='column'
            value={formik.values.column}
            isDisabled={!!!formik.values.table}
            styles={selectStyles}
            className={styles.selectInput}
            isMulti
            closeMenuOnSelect={false}
            isSearchable={true}
            options={columnOptions}
            onChange={(values) => {
              formik.setFieldValue('column', values)
            }}
          />
        </div>
        <button
          type='submit'
          disabled={!!!formik.values.column || formik.values.column.length == 0}
          className={styles.submitButton}
        >
          Add
        </button>
      </form>
    </div>
  )
}

export default GroupByClauseCreator
