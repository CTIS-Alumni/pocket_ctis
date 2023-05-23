import { useFormik } from 'formik'
import { Tables_Data } from '../../context/tablesContext'
import styles from './SortClauseCreator.module.css'
import { useEffect, useState, useContext } from 'react'
import Select from 'react-select'

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

const SortClauseCreator = ({ activeTables, setSortSchema }) => {
  const [tableOptions, setTableOptions] = useState([])
  const [columnOptions, setColumnOptions] = useState([])
  const [formatedSortByStatment, setFormatedSortByStatment] = useState('')
  const [sortClauses, setSortClauses] = useState([])

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
      sortClauses.length > 0 ? (
        <>
          <div className={styles.clauseHolder}>
            ORDER BY&nbsp;
            {sortClauses.map((column, idx) => (
              <span
                key={idx}
                className={styles.removeable}
                onClick={() => removeSort(column)}
              >
                {column}
                {idx != sortClauses.length - 1 && ', '}
              </span>
            ))}
          </div>
        </>
      ) : (
        ''
      )
    setFormatedSortByStatment(str)
    setSortSchema(sortClauses)
  }, [sortClauses])

  const removeSort = (column) => {
    const temp = sortClauses.filter((g) => g != column)
    setSortClauses([...temp])
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      table: null,
      column: null,
      order: { value: 'ASC', label: 'ASC' },
    },
    onSubmit: (val) => onSubmitHandler(val),
  })

  const getColumnOptions = (table) => {
    setColumnOptions(
      tableColumns[table].map((t) => ({ label: t, value: `${table}.${t}` }))
    )
  }

  const onSubmitHandler = (val) => {
    const sort = []
    val.column.forEach((v, idx) => {
      if (!sortClauses.includes(`${v.value} ${val.order.value}`))
        sort.push(`${v.value} ${val.order.value}`)
    })

    setSortClauses([...sortClauses, ...sort])
    formik.setFieldValue('table', null)
    formik.setFieldValue('column', null)
  }

  return (
    <div>
      <h5>Order Clause Creator</h5>
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
        {formatedSortByStatment}
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
        <div className={styles.smallSelectContainer}>
          <label htmlFor='column' className={styles.inputLabel}>
            Order
          </label>
          <Select
            name='order'
            id='oder'
            value={formik.values.order}
            isDisabled={!!!formik.values.table}
            styles={selectStyles}
            className={styles.selectInput}
            closeMenuOnSelect={true}
            isSearchable={true}
            options={[
              { value: 'DESC', label: 'DESC' },
              { value: 'ASC', label: 'ASC' },
            ]}
            onChange={(values) => {
              formik.setFieldValue('order', values)
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

export default SortClauseCreator
