import AdminPageContainer from '../../components/AdminPanelComponents/AdminPageContainer/AdminPageContainer'
import { Card, Tab, Tabs } from 'react-bootstrap'
import Link from 'next/link'
import { useState, useEffect, useContext } from 'react'
import { _submitFetcher } from '../../helpers/fetchHelpers'
import SelectClauseCreator from '../../components/SelectClauseCreator/SelectClauseCreator'
import JoinCreator from '../../components/JoinCreator/JoinCreator'
import WhereClauseCreator from '../../components/WhereClauseCreator/WhereClauseCreator'
import GroupByClauseCreator from '../../components/GroupByClauseCreator/GroupByClauseCreator'
import SortClauseCreator from '../../components/SortClauseCreator/SortClauseCreator'
import InterTableWhereClauseCreator from '../../components/InterTableWhereClauseCreator/InterTableWhereClauseCreator'
import styles from '../../styles/reportGeneration.module.css'
import Select from 'react-select'
import { Tables_Data } from '../../context/tablesContext'
import { craftUrl } from '../../helpers/urlHelper'
import { toast, ToastContainer } from 'react-toastify'
import ReportDataPreviewTable from '../../components/ReportDataPreviewTable/ReportDataPreviewTable'
import ExcelJS from 'exceljs';

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

  const [refreshKey, setRefreshKey] = useState(Math.random().toString(36))
  const [data, setData] = useState([])
  const [columns, setColumns] = useState([])
  const [activeKey, setActiveKey] = useState('generate')

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
    const res = await _submitFetcher('POST', craftUrl(['generateReport']), {
      query: sqlQuery,
    })
    if (!res.data && res.errors) {
      toast.error(res.errors[0].error)
    } else {
      toast.success('Query executed successfully')
      setActiveKey('preview')
      setData(res.data)
      setColumns(Object.keys(res.data[0]))
      console.log(res)
    }
  }

  const clearQuery = () => {
    setRefreshKey(Math.random().toString(36))
    setSqlQuery('')
    setTableForJoin([])
  }

  const exportData = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');


    const headers = Object.keys(data[0]);
    worksheet.addRow(headers);

    data.forEach((row) => {
      const values = Object.values(row);
      worksheet.addRow(values);
    });

    const buffer = await workbook.xlsx.writeBuffer();

    const fileName = 'report.xlsx';
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    const downloadLink = document.createElement('a');

    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = fileName;
    downloadLink.click();
    //the SQL response is saved in data
  }

  return (
    <AdminPageContainer key={refreshKey}>
      <h4>Report Generation</h4>
      <Tabs
        activeKey={activeKey}
        onSelect={(k) => setActiveKey(k)}
        defaultActiveKey='generate'
      >
        <Tab eventKey='generate' title='Query' style={{ marginBottom: 20 }}>
          <>
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
                <button className={styles.closeButton} onClick={clearQuery}>
                  Clear Query
                </button>
              </div>
              <textarea
                style={{
                  resize: 'none',
                  border: '1px solid rgb(245, 164, 37)',
                  borderRadius: 5,
                  marginTop: 15,
                }}
                rows={8}
                value={sqlQuery}
                onChange={(event) => setSqlQuery(event.target.value)}
                name='sqlQuery'
                spellCheck={false}
              />
            </Card>
          </>
        </Tab>
        <Tab eventKey='preview' title='Preview'>
          <div className={styles.tableContainer}>
            {!data ||
              (data.length == 0 && (
                <h5 style={{ color: '#aaa' }}>No data available for preview</h5>
              ))}
            {data.length > 0 && (
              <>
                <button
                  className={styles.submitButton}
                  style={{ float: 'right', marginBottom: 15 }}
                  onClick={exportData}
                >
                  Export Data
                </button>
                <ReportDataPreviewTable data={data} columns={columns} />
              </>
            )}
          </div>
        </Tab>
      </Tabs>
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
