import { useState, useEffect } from 'react'
import { Tabs, Tab, Container, Spinner } from 'react-bootstrap'
import { _getFetcher, _submitFetcher } from '../../helpers/fetchHelpers'
import { buildCondition, craftUrl } from '../../helpers/urlHelper'
import styles from './Dashboard.module.css'
import DataTable from '../DataTable/DataTable'
import SocietiesForm from '../EntityForms/SocietiesForm'
import { toast } from 'react-toastify'

const SocietiesDashboard = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)
  const [columns, setColumns] = useState([])

  const [showOptions, setShowOptions] = useState(false)
  const [selectedArray, setSelectedArray] = useState([])

  const [activeItem, setActiveItem] = useState(null)
  const [activeKey, setActiveKey] = useState('browse')

  const [refreshKey, setRefreshKey] = useState(Math.random().toString(36))

  const getData = (
    conditions = [
      { name: 'limit', value: 15 },
      { name: 'offset', value: 0 },
    ]
  ) => {
    setIsLoading(true)
    _getFetcher({ societies: craftUrl(['studentsocieties'], conditions) })
      .then(({ societies }) => {
        if (societies.errors?.length > 0) {
          societies.errors.map((e) => toast.error(e.error))
          return
        }
        setTotal(societies.length)
        setData(societies.data)
      })
      .finally((_) => setIsLoading(false))
  }

  useEffect(() => {
    getData()
    setColumns(['id', 'society_name', 'description'])
  }, [])

  useEffect(() => {
    console.log(selectedArray)
  }, [selectedArray])

  const onQuery = (queryParams) => {
    const conditions = buildCondition(queryParams)
    getData(conditions)
  }

  const deleteHandler = async (data) => {
    const res = await _submitFetcher('DELETE', craftUrl(['studentsocieties']), {
      societies: [data],
    })
    if (res?.data[data.id])
      toast.success('Student society deleted successfully!')
    else toast.error(res.data[0].error)
  }

  const deleteSelected = async () => {
    const res = await _submitFetcher('DELETE', craftUrl(['studentsocieties']), {
      societies: selectedArray,
    })
    if (res.errors.length) toast.error(res.errors[0].error)
    else toast.success('Student society deleted successfully!')
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
          if (key == 'browse') {
            setActiveItem(null)
            setRefreshKey(Math.random().toString(36))
          }
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
                  searchCols='society_name,description'
                />
              )}
            </div>
          </Container>
        </Tab>
        <Tab title='Insert' eventKey='insert'>
          <Container style={{ marginTop: 10 }}>
            <SocietiesForm activeItem={activeItem} />
          </Container>
        </Tab>
      </Tabs>
    </div>
  )
}

export default SocietiesDashboard
