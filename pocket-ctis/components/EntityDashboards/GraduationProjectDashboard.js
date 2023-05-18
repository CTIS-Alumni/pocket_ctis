import { useState, useEffect } from 'react'
import { Tabs, Tab, Container } from 'react-bootstrap'
import { _getFetcher } from '../../helpers/fetchHelpers'
import { buildCondition, craftUrl } from '../../helpers/urlHelper'
import styles from './Dashboard.module.css'
import DataTable from '../DataTable/DataTable'
import GraduationProjectForm from '../EntityForms/GraduationProjectForm'
import {toast} from "react-toastify";

const GraduationProjectDashboard = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)
  const [columns, setColumns] = useState([])

  const [showOptions, setShowOptions] = useState(false)
  const [selectedArray, setSelectedArray] = useState([])

  const [activeItem, setActiveItem] = useState(null)
  const [activeKey, setActiveKey] = useState('browse')

  const getData = (
    conditions = [
      { name: 'limit', value: 15 },
      { name: 'offset', value: 0 },
    ]
  ) => {
    setIsLoading(true)
    _getFetcher({
      graduationprojects: craftUrl(['graduationprojects'], conditions),
    })
      .then(({ graduationprojects }) => {
        if (graduationprojects?.errors?.length > 0) {
          graduationprojects?.errors.map((e) => toast.error(e.error))
          return
        }
        setTotal(graduationprojects.length)
        setData(graduationprojects.data)
      })
      .finally((_) => setIsLoading(false))
  }

  useEffect(() => {
    getData()
    setColumns([
      'advisor',
      'company_id',
      'company_name',
      'graduation_project_name',
      'id',
      'project_type',
      'project_year',
      'semester',
      'team_number',
    ])
  }, [])

  useEffect(() => {
    console.log(selectedArray)
  }, [selectedArray])

  const onQuery = (queryParams) => {
    const conditions = buildCondition(queryParams)
    getData(conditions)
  }

  const deleteHandler = (data) => {
    console.log('delete this', data)
    //for single delete
  }

  const deleteSelected = () => {
    console.log('delete following', selectedArray)
    //for multi delete
  }

  const selectedArrayOptions = [
    { label: 'Delete All Selected', action: deleteSelected },
  ]

  return (
    <div>
      <Tabs
        defaultActiveKey='browse'
        activeKey={activeKey}
        onSelect={(key) => {
          setActiveKey(key)
          if (key == 'browse') setActiveItem(null)
        }}
      >
        <Tab title='Browse' eventKey='browse'>
          <Container style={{ marginTop: 10 }}>
            <div className={styles.optionsDropdownContainer}>
              <button
                className={styles.optionsBtn}
                onClick={() => setShowOptions(!showOptions)}
              >
                Options
              </button>
              <div
                className={`${styles.optionsDropdown} ${
                  showOptions ? styles.show : styles.hide
                }`}
              >
                <ul className={styles.optionsList}>
                  {selectedArrayOptions.map((s) => (
                    <li onClick={s.action}>{s.label}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              {columns.length > 0 && (
                <DataTable
                  data={data}
                  columns={columns}
                  onQuery={onQuery}
                  total={total}
                  isLoading={isLoading}
                  editHandler={(d) => {
                    setActiveItem(d)
                    setActiveKey('insert')
                  }}
                  deleteHandler={(d) => deleteHandler(d)}
                  setSelectedArray={setSelectedArray}
                  selectedArray={selectedArray}
                  searchCols=''
                />
              )}
            </div>
          </Container>
        </Tab>
        <Tab title='Insert' eventKey='insert'>
          <Container style={{ marginTop: 10 }}>
            <GraduationProjectForm activeItem={activeItem} />
          </Container>
        </Tab>
      </Tabs>
    </div>
  )
}

export default GraduationProjectDashboard
