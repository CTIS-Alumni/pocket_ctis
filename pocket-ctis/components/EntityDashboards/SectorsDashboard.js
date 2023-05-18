import { useState, useEffect } from 'react'
import { Tabs, Tab, Container } from 'react-bootstrap'
import SectorForm from '../EntityForms/SectorForm'
import {_getFetcher, _submitFetcher} from '../../helpers/fetchHelpers'
import { buildCondition, craftUrl } from '../../helpers/urlHelper'
import styles from './CompanyDashboard.module.css'
import DataTable from '../DataTable/DataTable'
import {toast, ToastContainer} from "react-toastify";

const SectorsDashboard = () => {
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
    _getFetcher({ sectors: craftUrl(['sectors'], conditions) })
      .then(({ sectors }) => {
        setTotal(sectors.length)
        setData(sectors.data)
      })
      .finally((_) => setIsLoading(false))
  }

  useEffect(() => {
    console.log(selectedArray)
  }, [selectedArray])

  useEffect(() => {
    getData()
    setColumns(['id', 'sector_name'])
  }, [])

  const onQuery = (queryParams) => {
    const conditions = buildCondition(queryParams)
    getData(conditions)
  }

  const deleteHandler = async (data) => {
    const res = await _submitFetcher("DELETE", craftUrl(["sectors"]), {sectors: [data]});
    if(res?.data[data.id])
      toast.success("Sector deleted successfully!")
    else toast.error(res.data[0].error)
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
                    editHandler(d)
                  }}
                  deleteHandler={(d) => deleteHandler(d)}
                  setSelectedArray={setSelectedArray}
                />
              )}
            </div>
          </Container>
        </Tab>
        <Tab title='Insert' eventKey='insert'>
          <Container style={{ marginTop: 10 }}>
            <SectorForm activeItem={activeItem} />
          </Container>
        </Tab>
      </Tabs>
      <ToastContainer
          position='top-right'
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          draggable
          pauseOnHover
          theme='light'
      />
    </div>
  )
}

export default SectorsDashboard
