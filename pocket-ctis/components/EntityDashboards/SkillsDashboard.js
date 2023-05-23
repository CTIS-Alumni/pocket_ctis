import { useState, useEffect } from 'react'
import { Tabs, Tab, Container, Modal, Button } from 'react-bootstrap'
import { _getFetcher, _submitFetcher } from '../../helpers/fetchHelpers'
import { buildCondition, craftUrl } from '../../helpers/urlHelper'
import styles from './Dashboard.module.css'
import DataTable from '../DataTable/DataTable'
import SkillsForm from '../EntityForms/SkillsForm'
import { toast } from 'react-toastify'

const SkillsDashboard = () => {
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
    _getFetcher({ skills: craftUrl(['skills'], conditions) })
      .then(({ skills }) => {
        console.log(skills)
        if (skills?.errors?.length > 0) {
          skills?.errors.map((e) => toast.error(e.error))
          return
        }
        setTotal(skills.length)
        setData(skills.data)
      })
      .finally((_) => setIsLoading(false))
  }

  useEffect(() => {
    getData()
    setColumns(['id', 'skill_name', 'skill_type_id', 'skill_type_name'])
  }, [])

  useEffect(() => {
    console.log(selectedArray)
  }, [selectedArray])

  const onQuery = (queryParams) => {
    const conditions = buildCondition(queryParams)
    getData(conditions)
  }

  const deleteHandler = async (data) => {
    const res = await _submitFetcher('DELETE', craftUrl(['skills']), {
      skills: [data],
    })
    if (res?.data[data.id]) {
      toast.success('Skill deleted successfully!')
      getData()
    } else toast.error(res.data[0].error)
  }

  const deleteSelected = async () => {
    const res = await _submitFetcher('DELETE', craftUrl(['skills']), {
      skills: selectedArray,
    })
    if (res.errors.length) toast.error(res.errors[0].error)
    else {
      toast.success('Skills deleted successfully!')
      getData()
    }
  }

  const selectedArrayOptions = [
    {
      label: 'Delete All Selected',
      warning: 'Are you sure you want to delete all selected skills?',
      action: deleteSelected,
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
                  {selectedArrayOptions.map((s, idx) => (
                    <li key={idx} onClick={() => onOpen(s)}>{s.label}</li>
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
                  searchCols='skill_name,skill_type_name'
                />
              )}
            </div>
          </Container>
        </Tab>
        <Tab title='Insert' eventKey='insert'>
          <Container style={{ marginTop: 10 }}>
            <SkillsForm
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

export default SkillsDashboard
