import { useEffect, useState } from 'react'
import table_references from '../../config/table_references'
import Select from 'react-select'
import styles from './JoinCreator.module.css'
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

const JoinCreator = ({ activeTables, setJoinSchema, selectClauseTable }) => {
  const [availableJoins, setAvailableJoins] = useState([])
  const [selectedJoins, setSelectedJoins] = useState([])
  const [formatedJoinStatment, setFormatedJoinStatment] = useState('')
  const [joinedTablesX, setJoinedTablesX] = useState([])

  useEffect(() => {
    setJoinedTablesX([selectClauseTable])
  }, [])

  const getAvailableJoins = () => {
    const availableJoins = []
    activeTables.forEach((table) => {
      if(!joinedTablesX.includes(table)){
        table_references[table].references.forEach((ref) => {
          if (activeTables.includes(ref.table) && joinedTablesX.includes(ref.table)) {
            availableJoins.push({
              label: `${table} ${table} ON ${table}.${ref.column} = ${ref.table}.id`,
              value: {
                referencedTable: ref.table,
                referencedColumn: 'id',
                referencingTable: table,
                referencingColumn: ref.column,
                table: table
              },
            })
          }
        })

        table_references[table].referenced.forEach((ref) => {
          if (activeTables.includes(ref.table) && joinedTablesX.includes(ref.table)) {
            availableJoins.push({
              label: `${table} ${table} ON ${table}.id = ${ref.table}.${ref.column} `,
              value: {
                referencedTable: table,
                referencedColumn: ref.column,
                referencingTable: ref.table,
                referencingColumn: 'id',
                table: table
              },
            })
          }
        })
      }
    })
    formik.setFieldValue('joinStatement', null)
    setAvailableJoins([...availableJoins])
  }

  useEffect(() => {
    getAvailableJoins()
  }, [activeTables, selectClauseTable, joinedTablesX])

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      joinType: {
        label: 'Left Outer Join',
        value: 'LEFT OUTER JOIN',
      },
      joinStatement: null,
    },
    onSubmit: (values) => {
      // addJoin(values)
      onSubmitHandler(values)
    },
  })

  const removeJoin = (join) => {
    const temp = selectedJoins.filter((t) => t.text != join.text)
    const tempTable = joinedTablesX.filter((jt) => jt != join.value.table)
    setSelectedJoins([...temp])
    setJoinedTablesX([...tempTable])
  }

  useEffect(() => {
    const str = (
      <>
        {selectedJoins.map((join) => {
          return (
            <div
              className={`${styles.clauseHolder} ${styles.removeable}`}
              onClick={() => {
                removeJoin(join)
              }}
            >
              {join.text}
            </div>
          )
        })}
      </>
    )
    setFormatedJoinStatment(str)

    const joinedTables = []
    selectedJoins.forEach((datum) => {
      if (!joinedTables.includes(datum.value.referencedTable))
        joinedTables.push(datum.value.referencedTable)
      if (!joinedTables.includes(datum.value.referencingTable))
        joinedTables.push(datum.value.referencingTable)
    })
    setJoinSchema({
      tables: joinedTables,
      joins: selectedJoins.map((s) => s.text),
    })
  }, [selectedJoins, joinedTablesX])

  const onSubmitHandler = (values) => {
    const temp = {
      text: `${values.joinType.value} ${values.joinStatement.label}`,
      type: values.joinType.value,
      value: values.joinStatement.value,
    }

    const newSelected = [...selectedJoins]
    const newJoined = [...joinedTablesX]

    if (!newSelected.find((datum) => datum.text == temp.text)) {
      newSelected.push(temp)
      newJoined.push(temp.value.table);
    }

    setJoinedTablesX(newJoined);
    setSelectedJoins(newSelected)
    formik.setFieldValue('joinStatement', null)
    formik.setFieldValue('joinType', {
      value: 'LEFT OUTER JOIN',
      label: 'Left Outer Join',
    })
  }

  return (
    <div>
      <h5>Create Join Clause</h5>
      <div>
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
          {formatedJoinStatment}
        </div>
      </div>
      <form onSubmit={formik.handleSubmit} className={styles.formContainer}>
        <div className={styles.selectsContainer}>
          <div className={styles.inputContainer}>
            <label className={styles.inputLabel} htmlFor='joinType'>
              Join Type
            </label>
            <Select
              className='mb-2'
              id='joinType'
              name='joinType'
              value={formik.values.joinType}
              options={[
                { label: 'Left Outer Join', value: 'LEFT OUTER JOIN' },
                { label: 'Right Outer Join', value: 'RIGHT OUTER JOIN' },
              ]}
              onChange={(val) => formik.setFieldValue('joinType', val)}
              styles={selectStyles}
            />
          </div>
          <div className={styles.inputContainer}>
            <label className={styles.inputLabel} htmlFor='joinStatement'>
              Join Statement
            </label>
            <Select
              className='mb-2'
              id='joinStatement'
              name='joinStatement'
              value={formik.values.joinStatement}
              options={availableJoins}
              onChange={(val) => {
                formik.setFieldValue('joinStatement', val)
              }}
              styles={selectStyles}
            />
          </div>
        </div>

        <button
          type='submit'
          disabled={!!!formik.values.joinStatement}
          className={styles.submitButton}
        >
          Add
        </button>
      </form>
    </div>
  )
}

export default JoinCreator
