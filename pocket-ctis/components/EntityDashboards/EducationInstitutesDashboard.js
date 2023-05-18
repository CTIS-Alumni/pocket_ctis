import { useState, useEffect } from 'react'
import { Tabs, Tab, Container, Spinner } from 'react-bootstrap'
import { _getFetcher } from '../../helpers/fetchHelpers'
import { buildCondition, craftUrl } from '../../helpers/urlHelper'
import styles from './Dashboard.module.css'
import DataTable from '../DataTable/DataTable'
import EducationalInstitureForm from '../EntityForms/EducationalInstitureForm'
import { toast } from 'react-toastify'

const EducationInstitutesDashboard = () => {
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
      educationInstitutes: craftUrl(['educationinstitutes'], conditions),
    })
      .then(({ educationInstitutes }) => {
        if (educationInstitutes.errors.length > 0) {
          console.log(educationInstitutes.errors)
          educationInstitutes.errors.map((e) => toast.error(e.error))
          return
        }
        setTotal(educationInstitutes.length)
        setData(educationInstitutes.data)
      })
      .finally((_) => setIsLoading(false))
  }

  useEffect(() => {
    getData()
    setColumns([
      'id',
      'edu_inst_name',
      'city_name',
      'country_name',
      'is_erasmus',
    ])
  }, [])

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
                />
              )}
            </div>
          </Container>
        </Tab>
        <Tab title='Insert' eventKey='insert'>
          <Container style={{ marginTop: 10 }}>
            <EducationalInstitureForm activeItem={activeItem} />
          </Container>
        </Tab>
      </Tabs>
    </div>
  )
}

export default EducationInstitutesDashboard
