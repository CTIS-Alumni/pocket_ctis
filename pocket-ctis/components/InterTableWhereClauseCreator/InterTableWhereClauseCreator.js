import { Tables_Data } from '../../context/tablesContext'
import styles from './InterTableWhereClauseCreator.module.css'
import Select from 'react-select'
import { useFormik } from 'formik'
import { useEffect, useState, useContext } from 'react'

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

const InterTableWhereClauseCreator = ({
  activeTables,
  setInterWhereSchema,
}) => {
  const [tableOptions, setTableOptions] = useState([])
  const [formatedWhereStatment, setFormatedWhereStatment] = useState('')
  const [column1Options, setColumn1Options] = useState([])
  const [column2Options, setColumn2Options] = useState([])
  const [whereClauses, setWhereClauses] = useState([])

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
      whereClauses.length > 0 ? (
        <>
          <div>
            WHERE
            <div style={{ paddingLeft: 10 }}>
              {whereClauses.map((w, idx) => {
                return (
                  <div
                    key={idx}
                    className={`${styles.clauseContainer} ${styles.removeable}`}
                    onClick={() => removeWhere(w)}
                  >
                    {`${w.column1} ${w.operator} ${w.column2}`}
                  </div>
                )
              })}
            </div>
          </div>
        </>
      ) : (
        ''
      )

    setFormatedWhereStatment(str)
    setInterWhereSchema(whereClauses)
  }, [whereClauses])

  const removeWhere = (clause) => {
    const newClauses = []
    whereClauses.forEach((t, idx) => {
      if (
        clause.column1 != t.column1 ||
        clause.column2 != t.column2 ||
        clause.operator != t.operator
      ) {
        newClauses.push(t)
      }
    })

    setWhereClauses(newClauses)
  }

  const getColumnOptions = (table) => {
    return tableColumns[table].map((t) => ({
      label: t,
      value: `${table}.${t}`,
    }))
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      table1: null,
      column1: null,
      operator: { value: '=', label: '=' },
      table2: null,
      column2: null,
    },
    onSubmit: (val) => onSubmitHandler(val),
  })

  const onSubmitHandler = (val) => {
    const temp = {
      column1: val.column1.value,
      column2: val.column2.value,
      operator: val.operator.value,
    }
    var check = false
    whereClauses.forEach((w) => {
      if (
        temp.column1 === w.column1 &&
        temp.column2 === w.column2 &&
        temp.operator === w.operator
      ) {
        check = true
      }
    })

    const newWhere = [...whereClauses]
    if (!check) newWhere.push(temp)

    setWhereClauses([...newWhere])
    formik.setFieldValue('column1', null)
    formik.setFieldValue('column2', null)
    formik.setFieldValue('table1', null)
    formik.setFieldValue('table2', null)
    formik.setFieldValue('operator', { value: '=', label: '=' })
  }

  return (
    <div>
      <h5>Inter Table Where Clause Creator</h5>
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
        {formatedWhereStatment}
      </div>

      <form onSubmit={formik.handleSubmit} className={styles.formContainer}>
        <div className={styles.section1}>
          <div className={styles.selectContainer}>
            <label className={styles.selectLabel}>Table 1</label>
            <Select
              onChange={(val) => {
                formik.setFieldValue('table1', val)
                setColumn1Options(getColumnOptions(val.value))
              }}
              styles={selectStyles}
              className='mb-2'
              options={tableOptions}
              value={formik.values.table1}
            />
          </div>
          <div className={styles.selectContainer}>
            <label className={styles.selectLabel}>Column 1</label>
            <Select
              options={column1Options}
              onChange={(val) => formik.setFieldValue('column1', val)}
              styles={selectStyles}
              isDisabled={!!!formik.values.table1}
              value={formik.values.column1}
            />
          </div>
        </div>
        <div className={styles.section2}>
          <Select
            styles={selectStyles}
            value={formik.values.operator}
            onChange={(val) => formik.setFieldValue('operator', val)}
            options={[
              { value: '=', label: '=' },
              { value: '<=', label: '<=' },
              { value: '>=', label: '>=' },
              { value: '<>', label: '<>' },
              { value: '<', label: '<' },
              { value: '>', label: '>' },
            ]}
          />
        </div>
        <div className={styles.section3}>
          <div className={styles.selectContainer}>
            <label className={styles.selectLabel}>Table 2</label>
            <Select
              onChange={(val) => {
                formik.setFieldValue('table2', val)
                setColumn2Options(getColumnOptions(val.value))
              }}
              styles={selectStyles}
              className='mb-2'
              options={tableOptions}
              value={formik.values.table2}
            />
          </div>
          <div className={styles.selectContainer}>
            <label className={styles.selectLabel}>Column 2</label>
            <Select
              options={column2Options}
              onChange={(val) => formik.setFieldValue('column2', val)}
              styles={selectStyles}
              isDisabled={!!!formik.values.table2}
              value={formik.values.column2}
            />
          </div>
        </div>
        <button
          type='submit'
          className={styles.submitButton}
          disabled={
            formik.values.column1 == null ||
            formik.values.column1 == {} ||
            formik.values.column2 == null ||
            formik.values.column2 == {}
          }
        >
          Add
        </button>
      </form>
    </div>
  )
}

export default InterTableWhereClauseCreator
