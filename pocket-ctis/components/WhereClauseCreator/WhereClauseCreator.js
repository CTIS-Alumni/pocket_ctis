import { useContext, useState, useEffect } from 'react'
import { QueryBuilder, formatQuery } from 'react-querybuilder'
import { QueryBuilderBootstrap } from '@react-querybuilder/bootstrap'
import 'react-querybuilder/dist/query-builder.css'
import Select from 'react-select'
import { Tables_Data } from '../../context/tablesContext'
import { useFormik } from 'formik'
import styles from './WhereClauseCreator.module.css'

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

const getTableFields = (selectedTable, tables) => {
  const columns = tables[selectedTable.value]
  /*model: {
    name: field,
    label: field,
    inputType: fieldType
  }
  */

  const getColumnType = (dataType) => {
    switch (dataType) {
      case 'varchar':
        return { inputType: 'text' }
        break
      case 'int':
        return { inputType: 'number' }
        break
      case 'float':
        return { inputType: 'number' }
        break
      case 'tinyint':
        return { inputType: 'number' }
        break
      case 'date':
        return { inputType: 'date' }
        break
      case 'datetime':
        return { inputType: 'datetime-local' }
        break
      case 'mediumtext':
        return { valueEditorType: 'textarea' }
        break
      default:
        return 'text'
        break
    }
  }

  return columns.map((column) => {
    const inputType = getColumnType(column.DATA_TYPE)
    return {
      name: `${selectedTable.label}.${column.COLUMN_NAME}`,
      label: column.COLUMN_NAME,
      ...inputType,
    }
  })
}

const initialQuery = {
  combinator: 'and',
  rules: [],
}

const WhereClauseCreator = ({ activeTables, setIntraWhereSchema }) => {
  const [isTableSelected, setIsTableSelected] = useState(false)
  const [tableOptions, setTableOptions] = useState([])
  const [fields, setFields] = useState([])

  const [whereArray, setWhereArray] = useState([])
  const [formatedWhereClause, setFormatedWhereClause] = useState([])

  const { tablesColumnTypeData } = useContext(Tables_Data)

  useEffect(() => {
    const tables = []
    activeTables.forEach((d) => {
      if (!tables.includes(d)) tables.push(d)
    })

    setTableOptions(tables.map((t) => ({ value: t, label: t })))
  }, [tablesColumnTypeData, activeTables])

  useEffect(() => {
    const len = whereArray.length
    var str =
      len > 0 ? (
        <div>
          WHERE
          <div style={{ paddingLeft: 10 }}>
            <div className={styles.clauseHolder}>
              {whereArray.map((w, idx) => (
                <span key={idx}>
                  <span
                    onClick={() => removeWhere(idx)}
                    className={styles.removeable}
                  >
                    {w}
                  </span>
                  {len - 1 != idx && ' AND '}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        ''
      )

    setFormatedWhereClause(str)
    setIntraWhereSchema(whereArray)
  }, [whereArray])

  const removeWhere = (index) => {
    const temp = [...whereArray]
    temp.splice(index, 1)
    formik.setFieldValue('sqlQuery', temp)
    setWhereArray([...temp])
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      table: null,
      queryObject: null,
      sqlQuery: [],
    },
    onSubmit: (values) => {
      setWhereArray(values.sqlQuery)
      const temp = formatQuery(formik.values.queryObject, 'sql')
      const newWhere = [...whereArray]
      newWhere.push(temp)
      setWhereArray([...newWhere])
      formik.setFieldValue('queryObject', initialQuery)
    },
  })

  return (
    <>
      <h5>Intra Table Where Clause Creator</h5>
      <div
        className='mb-2'
        style={{
          position: 'relative',
        }}
      >
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
          {formatedWhereClause}
        </div>
      </div>
      <form onSubmit={formik.handleSubmit} className={styles.formContainer}>
        <div style={{ width: '90%' }}>
          <div className={styles.selectContainer}>
            <label htmlFor='table' className={styles.inputLabel}>
              Table
            </label>
            <Select
              styles={selectStyles}
              options={tableOptions}
              className='mb-2'
              isClearable
              value={formik.values.table}
              onChange={(value) => {
                if (value) {
                  formik.setFieldValue('table', value)
                  setFields(getTableFields(value, tablesColumnTypeData))
                  setIsTableSelected(true)
                } else {
                  setIsTableSelected(false)
                  formik.setFieldValue('table', null)
                }
              }}
            />
          </div>
          <QueryBuilderBootstrap>
            <QueryBuilder
              disabled={!!!formik.values.table}
              query={formik.values.queryObject}
              fields={fields}
              onQueryChange={(q) => {
                formik.setFieldValue('queryObject', q)
              }}
              controlClassnames={{ queryBuilder: 'queryBuilder-branches' }}
            />
          </QueryBuilderBootstrap>
        </div>
        <button
          type='submit'
          disabled={!isTableSelected}
          className={styles.submitButton}
        >
          Add
        </button>
      </form>
    </>
  )
}

export default WhereClauseCreator
