import { useState, useEffect } from 'react'
import { Tabs, Tab, Container, Modal, Button } from 'react-bootstrap'
import { _getFetcher, _submitFetcher } from '../../helpers/fetchHelpers'
import { buildCondition, craftUrl } from '../../helpers/urlHelper'
import styles from './Dashboard.module.css'
import DataTable from '../DataTable/DataTable'
import EducationalInstituteForm from '../EntityForms/EducationalInstituteForm'
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

  const [refreshKey, setRefreshKey] = useState(Math.random().toString(36))

  const [show, setShow] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  const onClose = () => setShow(false)
  const onOpen = (opt) => {
    setSelectedOption(opt)
    setShow(true)
  }

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
        if (educationInstitutes?.errors?.length > 0) {
          educationInstitutes?.errors.map((e) => toast.error(e.error))
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

  const deleteHandler = async (data) => {
    const res = await _submitFetcher(
      'DELETE',
      craftUrl(['educationinstitutes']),
      { educationinstitutes: [data] }
    )
    if (res?.data[data.id]) {
      toast.success('Education institute deleted successfully!')
      getData()
    } else toast.error(res.data[0].error)
  }

  const deleteSelected = async () => {
    const res = await _submitFetcher(
      'DELETE',
      craftUrl(['educationinstitutes']),
      { educationinstitutes: selectedArray }
    )
    if (res.errors.length) toast.error(res.errors[0].error)
    else {
      toast.success('Education institutes deleted successfully!')
      getData()
    }
  }

  const setIsErasmus = async () => {
    const newArr = selectedArray.map((s) => ({ ...s, is_erasmus: 1 }))
    const res = await _submitFetcher('PUT', craftUrl(['educationinstitutes']), {
      educationinstitutes: newArr,
    })
    if (res.errors.length) toast.error(res.errors[0].error)
    else {
      toast.success('Education institutes saved successfully!')
      getData()
    }
  }

  const selectedArrayOptions = [
    {
      label: 'Delete All Selected',
      warning:
        'Are you sure you want to delete all selected education institutes?',
      action: deleteSelected,
    },
    {
      label: 'Set Erasmus University',
      warning:
        'Are you sure you want to set all selected education institutes as Erasmus?',
      action: setIsErasmus,
    },
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
                    <li onClick={() => onOpen(s)}>{s.label}</li>
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
                  searchCols='edu_inst_name,city_name,country_name'
                />
              )}
            </div>
          </Container>
        </Tab>
        <Tab title='Insert' eventKey='insert'>
          <Container style={{ marginTop: 10 }}>
            <EducationalInstituteForm
              key={refreshKey}
              activeItem={activeItem}
              updateData={getData}
            />
          </Container>
        </Tab>
      </Tabs>
      <Modal show={show} onHide={onClose}>
        <Modal.Header>{selectedOption?.label}</Modal.Header>
        <Modal.Body>
          {selectedOption?.warning}
          {selectedArray.length > 0 && (
            <div style={{ overflow: 'scroll' }}>
              <table className={styles.modalTable}>
                <thead>
                  <tr>
                    {Object.keys(selectedArray[0]).map((h, idx) => (
                      <th key={idx}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {selectedArray.map((datum, idx) => (
                    <tr key={idx}>
                      {Object.keys(selectedArray[0]).map((h, idx) => (
                        <td key={idx}>{datum[h]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={onClose}>
            Close
          </Button>
          <Button
            variant='primary'
            onClick={() => {
              onClose()
              selectedOption?.action()
            }}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default EducationInstitutesDashboard
