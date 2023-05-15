import AdminPageContainer from '../../components/AdminPanelComponents/AdminPageContainer/AdminPageContainer'
import { Card } from 'react-bootstrap'
import Link from 'next/link'
import { useState, useEffect, useContext } from 'react'
import {_submitFetcher} from '../../helpers/fetchHelpers'
import SelectClauseCreator from '../../components/SelectClauseCreator/SelectClauseCreator'
import JoinCreator from '../../components/JoinCreator/JoinCreator'
import WhereClauseCreator from '../../components/WhereClauseCreator/WhereClauseCreator'
import GroupByClauseCreator from '../../components/GroupByClauseCreator/GroupByClauseCreator'
import SortClauseCreator from '../../components/SortClauseCreator/SortClauseCreator'
import InterTableWhereClauseCreator from '../../components/InterTableWhereClauseCreator/InterTableWhereClauseCreator'
import styles from '../../styles/reportGeneration.module.css'
import Select from 'react-select'
import { Tables_Data } from '../../context/tablesContext'
import {craftUrl} from "../../helpers/urlHelper";
import {toast, ToastContainer} from "react-toastify";

const transformTableData = (data) => {
  const optionsModel = Object.keys(data).map((table) => ({
    value: table,
    label: table,
  }))
  return optionsModel
}

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

const ReportGeneration = () => {
  const [sqlQuery, setSqlQuery] = useState('')
  const [selectSchema, setSelectSchema] = useState({ tables: [], columns: [] })
  const [joinSchema, setJoinSchema] = useState({ tables: [], joins: [] })
  const [sortSchema, setSortSchema] = useState([])
  const [groupSchema, setGroupSchema] = useState([])
  const [interWhereSchema, setInterWhereSchema] = useState([])
  const [intraWhereSchema, setIntraWhereSchema] = useState([])

  const [tableForJoin, setTableForJoin] = useState([])
  const [tableOptions, setTableOptions] = useState([])

  const { tableColumns } = useContext(Tables_Data)
  useEffect(() => {
    setTableOptions(transformTableData(tableColumns))
  }, [tableColumns])

  useEffect(() => {
    if (selectSchema.columns.length > 0) {
      var sql = 'SELECT '
      sql += selectSchema.columns.join(', ')
      sql += '\nFROM '
      sql += `${selectSchema.tables[0]} ${selectSchema.tables[0]}`
    }
    if (joinSchema.joins.length > 0) {
      sql += '\n'
      sql += joinSchema.joins.join('\n')
    }
    if (interWhereSchema.length > 0 || intraWhereSchema.length > 0) {
      sql += '\nWHERE '
      var temp = interWhereSchema.map((s) => {
        var str = ''
        str += `(${s.column1} ${s.operator} ${s.column2})`
        return str
      })
      sql += [...intraWhereSchema, ...temp].join(' AND ')
    }
    if (groupSchema.length > 0) {
      sql += '\nGROUP BY '
      sql += groupSchema.join(', ')
    }

    if (sortSchema.length > 0) {
      sql += '\nORDER BY '
      sql += sortSchema.join(', ')
    }

    setSqlQuery(sql)
  }, [
    selectSchema,
    joinSchema,
    sortSchema,
    groupSchema,
    interWhereSchema,
    intraWhereSchema,
  ])

  const sendSqlQuery = async () => {
    const res = await _submitFetcher('POST',craftUrl(['generateReport']), {query: sqlQuery});
    if(!res.data && res.errors){
        toast.error(res.errors[0].error);
    }
    else {
        toast.success("Query executed successfully")
        console.log(res);
    }
  }

  return (
    <AdminPageContainer>
      <h4>Report Generation</h4>
      <div className={styles.selectContainer}>
        <label htmlFor='tablesInUse' className={styles.inputLabel}>
          Select Tables to be Used
        </label>
        <Select
          name='tablesInUse'
          id='tablesInUse'
          className={styles.selectInput}
          isSearchable={true}
          options={tableOptions}
          styles={selectStyles}
          closeMenuOnSelect={false}
          isMulti
          onChange={(value) => {
            setTableForJoin(value.map((v) => v.value))
          }}
        />
      </div>
      <Card border='light' style={{ padding: 20 }} className='mb-2'>
        <SelectClauseCreator
          setSelectSchema={setSelectSchema}
          tableOptions={tableForJoin.map((t) => ({ value: t, label: t }))}
        />
      </Card>
      <Card border='light' style={{ padding: 20 }} className='mb-2'>
        <JoinCreator
          activeTables={tableForJoin}
          setJoinSchema={setJoinSchema}
          selectClauseTable={selectSchema.tables[0]}
        />
      </Card>
      <Card border='light' style={{ padding: 20 }} className='mb-2'>
        <WhereClauseCreator
          setIntraWhereSchema={setIntraWhereSchema}
          activeTables={[...selectSchema.tables, ...joinSchema.tables]}
        />
      </Card>
      <Card border='light' style={{ padding: 20 }} className='mb-2'>
        <InterTableWhereClauseCreator
          setInterWhereSchema={setInterWhereSchema}
          activeTables={[...selectSchema.tables, ...joinSchema.tables]}
        />
      </Card>
      <Card border='light' style={{ padding: 20 }} className='mb-2'>
        <GroupByClauseCreator
          setGroupSchema={setGroupSchema}
          activeTables={[...selectSchema.tables, ...joinSchema.tables]}
        />
      </Card>
      <Card border='light' style={{ padding: 20 }} className='mb-2'>
        <SortClauseCreator
          setSortSchema={setSortSchema}
          activeTables={[...selectSchema.tables, ...joinSchema.tables]}
        />
      </Card>
      <Card border='light' style={{ padding: 20 }} className='mb-2'>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h5>SQL Query</h5>
          <button onClick={sendSqlQuery} className={styles.submitButton}>
            Preview Data
          </button>
        </div>
        <textarea
          style={{
            resize: 'none',
            border: '1px solid rgb(245, 164, 37)',
            borderRadius: 5,
          }}
          rows={8}
          value={sqlQuery}
          onChange={(event) => setSqlQuery(event.target.value)}
          name='sqlQuery'
          spellCheck={false}
        />
      </Card>
      <Card border='light' style={{ padding: 20 }}>
        <Link href='/admin/pdfView' target='blank'>
          Create PDF
        </Link>
      </Card>
        <ToastContainer
            position='top-right'
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            draggable
            pauseOnHover
            theme='light'
        />
    </AdminPageContainer>
  )
}

export default ReportGeneration
