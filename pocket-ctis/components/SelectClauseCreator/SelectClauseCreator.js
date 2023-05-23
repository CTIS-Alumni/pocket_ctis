import { useContext, useState, useEffect } from 'react'
import { Tables_Data } from '../../context/tablesContext'
import Select from 'react-select'
import styles from './SelectClauseCreator.module.css'
import { useFormik } from 'formik'

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

const SelectClauseCreator = ({ setSelectSchema, tableOptions }) => {
  const [columnOptions, setColumnOptions] = useState([])
  const [formatedSelectStatment, setFormatedSelectStatment] = useState('')
  const [columns, setColumns] = useState([])
  const [tables, setTables] = useState([])

  const { tableColumns } = useContext(Tables_Data)

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { selectTable: null, selectColumn: null },
    onSubmit: (values) => {
      onSubmitHandler(values)
    },
  })

  const removeColumn = (col) => {
    const newTables = []
    const newColumns = [...columns.filter((column) => column != col)]

    if (newColumns.length > 0) {
      newTables.push(newColumns[0].split('.')[0])
    }
    setTables(newTables)
    setColumns(newColumns)
  }

  useEffect(() => {
    setSelectSchema({ columns: columns, tables: tables })
    const str =
      columns.length > 0 ? (
        <div className={styles.clauseHolder}>
          <span className={styles.clause}>
            SELECT{' '}
            {columns.map((col, idx) => (
              <span key={idx}>
                <span
                  className={styles.removeable}
                  onClick={() => removeColumn(col)}
                >
                  {col}
                </span>
                {columns.length - 1 != idx && ', '}
              </span>
            ))}{' '}
            <br />
            FROM {tables[0]} {tables[0]}
          </span>
        </div>
      ) : (
        ''
      )
    setFormatedSelectStatment(str)
  }, [columns])

  const getColumnOptions = (table) => {
    setColumnOptions(
      tableColumns[table].map((col) => ({
        label: col,
        value: `${table}.${col}`,
      }))
    )
  }

  const onSubmitHandler = (values) => {
    const newTables = []
    const tempColumns = values.selectColumn.map((c) => c.value)
    const newColumns = [...columns]
    for (const col of tempColumns) {
      if (!newColumns.includes(col)) newColumns.push(col)
    }

    if (newColumns.length > 0) {
      newTables.push(newColumns[0].split('.')[0])
    }

    setTables([...newTables])
    setColumns(newColumns)

    formik.setValues({ selectColumn: null, selectTable: null })
  }

  return (
    <div>
      <h5>Create Select Clause</h5>
      <div
        style={{
          border: '1px solid rgb(245, 164, 37)',
          borderRadius: 5,
          height: '100px',
          background: 'rgba(239, 239, 239, 0.3)',
          margin: '10px 0',
          padding: '5px',
          overflowY: 'scroll',
        }}
      >
        {formatedSelectStatment}
      </div>
      <form onSubmit={formik.handleSubmit} className={styles.inputsContainer}>
        <div className={styles.selectContainer}>
          <label htmlFor='selectTable' className={styles.inputLabel}>
            Table
          </label>
          <Select
            name='selectTable'
            id='selectTable'
            className={styles.selectInput}
            isSearchable={true}
            options={tableOptions}
            styles={selectStyles}
            value={formik.values.selectTable}
            onChange={(value) => {
              if (value != null) {
                formik.setFieldValue('selectTable', value)
                formik.setFieldValue('selectColumn', null)
                getColumnOptions(value.value)
              } else {
                formik.setFieldValue('selectTable', null)
                formik.setFieldValue('selectColumn', null)
              }
            }}
          />
        </div>
        <div className={styles.selectContainer}>
          <label htmlFor='selectTable' className={styles.inputLabel}>
            Columns
          </label>
          <Select
            name='selectColumn'
            id='selectColumn'
            value={formik.values.selectColumn}
            isDisabled={!!!formik.values.selectTable}
            styles={selectStyles}
            className={styles.selectInput}
            isMulti
            closeMenuOnSelect={false}
            isSearchable={true}
            options={columnOptions}
            onChange={(values) => {
              formik.setFieldValue('selectColumn', values)
            }}
          />
        </div>
        <button
          type='submit'
          disabled={
            !!!formik.values.selectColumn ||
            formik.values.selectColumn.length == 0
          }
          className={styles.submitButton}
        >
          Add
        </button>
      </form>
    </div>
  )
}

export default SelectClauseCreator
