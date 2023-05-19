import { useState, useEffect } from 'react'
import { _getFetcher } from '../../../helpers/fetchHelpers'
import { craftUrl, buildCondition } from '../../../helpers/urlHelper'
import { Container, Tabs, Tab, Modal, Button } from 'react-bootstrap'
import { toast, ToastContainer } from 'react-toastify'
import AdminPageContainer from '../../../components/AdminPanelComponents/AdminPageContainer/AdminPageContainer'
import styles from '../../../styles/adminUsersList.module.css'
import CreateUserForm from '../../../components/AdminPanelComponents/CreateUserForm/CreateUserForm'
import DataTable from '../../../components/DataTable/DataTable'
import { useRouter } from 'next/router'

const AdminUsersList = () => {
  const [activeKey, setActiveKey] = useState('display')
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState([])
  const [columns, setColumns] = useState([])
  const [total, setTotal] = useState()

  const [selectedArray, setSelectedArray] = useState([])

  const [showOptions, setShowOptions] = useState(false)
  const [show, setShow] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)

  const onClose = () => setShow(false)
  const onOpen = (opt) => {
    setSelectedOption(opt)
    setShow(true)
  }

  const router = useRouter()

  const getData = (
    conditions = [
      { name: 'limit', value: 15 },
      { name: 'offset', value: 0 },
    ]
  ) => {
    setIsLoading(true)
    _getFetcher({ users: craftUrl(['users'], conditions) })
      .then(({ users }) => {
        if (users?.errors?.length > 0) {
          users?.errors.map((e) => toast.error(e.error))
          return
        }
        setTotal(users.length)
        setData(users.data)
      })
      .finally((_) => setIsLoading(false))
  }

  useEffect(() => {
    getData()
    setColumns(['id', 'first_name', 'last_name', 'user_types'])
  }, [])

  const onQuery = (queryParams) => {
    const conditions = buildCondition(queryParams)
    getData(conditions)
  }

  const handleClick = (user) => {
    router.push(`/admin/users/${user.id}`)
  }

  const deleteSelected = () => {
    console.log('delete selected')

    setSelectedArray([])
    setShowOptions(false)
    getData()
  }

  const selectedArrayOptions = [
    {
      label: 'Delete All Selected',
      warning: 'Are you sure you want to delete all selected sectors?',
      action: deleteSelected,
    },
  ]

  return (
    <AdminPageContainer>
      <Container>
        <Tabs style={{ display: 'none' }} activeKey={activeKey}>
          <Tab eventKey='display' title='display'>
            <div className='d-flex justify-content-between align-items-center'>
              <h4>Users</h4>
              <button
                className={styles.createUserButton}
                onClick={() => setActiveKey('create')}
              >
                Create User
              </button>
            </div>
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
            <DataTable
              data={data}
              columns={columns}
              onQuery={onQuery}
              total={total}
              isLoading={isLoading}
              searchCols=''
              clickable={true}
              clickHandler={handleClick}
              setSelectedArray={setSelectedArray}
              selectedArray={selectedArray}
            />
          </Tab>
          <Tab eventKey='create' title='create'>
            <CreateUserForm goBack={() => setActiveKey('display')} />
          </Tab>
        </Tabs>
      </Container>
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
    </AdminPageContainer>
  )
}

export default AdminUsersList
