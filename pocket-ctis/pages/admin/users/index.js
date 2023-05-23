import { useState, useEffect } from 'react'
import {_getFetcher, _submitFetcher} from '../../../helpers/fetchHelpers'
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
  const [activeItem, setActiveItem] = useState(null)
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
    setColumns(['id', 'bilkent_id', 'first_name', 'last_name', 'user_types', 'is_active', 'contact_email'])
  }, [])

  const onQuery = (queryParams) => {
    const conditions = buildCondition(queryParams)
    getData(conditions)
  }

  const handleClick = (user) => {
    router.push(`/admin/users/${user.id}`)
  }

  const deleteSelected = async () => {
    const res = await _submitFetcher('DELETE', craftUrl(['users']), {
      users: selectedArray,
    })
    if (res.errors.length) toast.error(res.errors[0].error)
    else {
      toast.success('Users deleted successfully!')
      setSelectedArray([])
      setShowOptions(false)
      getData()
    }

    setSelectedArray([])
    setShowOptions(false)
    getData()
  }

  const deactivateSelected = async () => {
    const res = await _submitFetcher('PUT', craftUrl(['users'], [{name: "deactivated", value: 1}]), {
      users: selectedArray,
    })
    if (res.errors.length) toast.error(res.errors[0].error)
    else {
      toast.success('Users deactivated successfully!')
      setSelectedArray([])
      setShowOptions(false)
      getData()
    }
  }

  const activateSelected = async () => {
    const res = await _submitFetcher('PUT', craftUrl(['users'], [{name: "activated", value: 1}]), {
      users: selectedArray,
    })
    if (res.errors.length) toast.error(res.errors[0].error)
    else {
      toast.success('Users activated successfully!')
      setSelectedArray([])
      setShowOptions(false)
      getData()
    }
  }

  const sendActivationMailSelected = async () => {
    setIsLoading(true)
    const res = await _submitFetcher('POST', craftUrl(['mail'], [{name: "multiActivationMail", value: 1}]), {
      users: selectedArray
    })
    res.errors.forEach((err)=>{
      toast.error(err.error);
    });
    if(res.data){
      res.data.forEach((msg) => {
        toast.success(msg);
      })
    }
    setSelectedArray([]);
    setIsLoading(false)
  }

  const selectedArrayOptions = [
    {
      label: 'Delete All Selected',
      warning: 'Are you sure you want to delete all selected users?',
      action: deleteSelected,
    },
    {
      label: 'Deactivate All Selected',
      warning: "Are you sure you want to deactivate all selected users? All data belonging to deactivated users will be hidden from other users" +
          " and they won't be able to login to the system until re-activated.",
      action: deactivateSelected
    },
    {
      label: 'Re-Activate All Selected',
      warning: 'Are you sure you want to re-activate all selected users? Re-activated users will be able to login to the system.',
      action: activateSelected
    },
    {
      label: 'Send Activation Mail To Selected',
      warning: "Are you sure you want to send activation mail to selected users? Use this option when users don't receive their account activation" +
          " mails upon creation.",
      action: sendActivationMailSelected
    }
  ]

  const editHandler = (data) => {
    setActiveItem(data)
    setActiveKey('create')
  }

  const deleteHandler = async (data) => {
    const res = await _submitFetcher('DELETE', craftUrl(['users']), {
      users: [data],
    })
    if (res?.data[data.id]) {
      toast.success('User deleted successfully!')
      getData()
    } else toast.error(res.data[0].error)
  }

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
              searchCols='user,bilkent_id,contact_email,type'
              clickable={true}
              editHandler={editHandler}
              deleteHandler={deleteHandler}
              clickHandler={handleClick}
              setSelectedArray={setSelectedArray}
              selectedArray={selectedArray}
            />
          </Tab>
          <Tab eventKey='create' title='create'>
            <CreateUserForm
              activeItem={activeItem}
              goBack={() => {
                setActiveKey('display')
                setActiveItem(null)
              }}
              updateData={getData}
            />
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
