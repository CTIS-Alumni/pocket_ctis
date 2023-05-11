import AdminPageContainer from '../../components/AdminPanelComponents/AdminPageContainer/AdminPageContainer'
import { Card } from 'react-bootstrap'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { _getFetcher } from '../../helpers/fetchHelpers'
import SelectClauseCreator from '../../components/SelectClauseCreator/SelectClauseCreator'
import JoinCreator from '../../components/JoinCreator/JoinCreator'
import WhereClauseCreator from '../../components/WhereClauseCreator/WhereClauseCreator'

const ReportGeneration = () => {
  const [selectQuery, setSelectQuery] = useState('')
  const [joinQueries, setJoinQueries] = useState([])
  const [whereClauses, setWhereClauses] = useState('')
  const [sqlQuery, setSqlQuery] = useState('')
  const [fromTables, setFromTables] = useState([])

  useEffect(() => {
    setSqlQuery(`${selectQuery}\n${joinQueries.join('\n')}\nWHERE`)
  }, [selectQuery, joinQueries, whereClauses])

  useEffect(() => {
    setSqlQuery((sqlQuery) => sqlQuery + ' ' + whereClauses)
  }, [whereClauses])

  const handleAddWhereClause = (clause) => {
    // setWhereClauses((whereClauses) => {
    //   whereClauses + clause
    // })
    setWhereClauses(clause)
  }

  const sendSqlQuery = () => {
    console.log(sqlQuery + ';')
  }

  return (
    <AdminPageContainer>
      <h4>Report Generation</h4>
      <Card border='light' style={{ padding: 20 }} className='mb-2'>
        <SelectClauseCreator
          selectQuery={selectQuery}
          setSelectQuery={setSelectQuery}
          setFromTables={setFromTables}
        />
      </Card>
      <Card border='light' style={{ padding: 20 }} className='mb-2'>
        <JoinCreator
          fromTables={fromTables}
          joinQueries={joinQueries}
          setJoinQueries={setJoinQueries}
        />
      </Card>
      <Card border='light' style={{ padding: 20 }} className='mb-2'>
        <WhereClauseCreator addWhereClauses={handleAddWhereClause} />
      </Card>
      <Card border='light' style={{ padding: 20 }} className='mb-2'>
        SQL Query
        <textarea
          style={{ resize: 'none' }}
          rows={5}
          value={sqlQuery}
          onChange={(event) => setSqlQuery(event.target.value)}
          name='sqlQuery'
          spellCheck={false}
        />
        <button onClick={sendSqlQuery} className='mt-2'>
          Preview Data
        </button>
      </Card>
      <Card border='light' style={{ padding: 20 }}>
        <Link href='/admin/pdfView' target='blank'>
          Create PDF
        </Link>
      </Card>
    </AdminPageContainer>
  )
}

export default ReportGeneration
