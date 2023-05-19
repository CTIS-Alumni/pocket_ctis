import { useState, useEffect } from 'react'
import { _getFetcher } from '../../../helpers/fetchHelpers'
import { craftUrl, buildCondition } from '../../../helpers/urlHelper'
import { Container, ListGroup, ListGroupItem, Tabs, Tab } from 'react-bootstrap'
import Link from 'next/link'
import { getProfilePicturePath } from '../../../helpers/formatHelpers'
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
            <DataTable
              data={data}
              columns={columns}
              onQuery={onQuery}
              total={total}
              isLoading={isLoading}
              searchCols=''
              clickable={true}
              clickHandler={handleClick}
            />
            {/* {users.length > 0 && (
              <ListGroup variant='flush'>
                {users.map((user, i) => {
                  return (
                    <ListGroupItem style={{ width: '100%' }} key={i}>
                      <Link href={`/admin/users/${user.id}`}>
                        <div style={{ display: 'flex' }}>
                          <img
                            width={80}
                            height={80}
                            style={{
                              objectFit: 'contain',
                              borderRadius: '50%',
                            }}
                            src={getProfilePicturePath(user.profile_picture)}
                          />
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'center',
                              flexFlow: 'column',
                              paddingLeft: '0.8em',
                            }}
                          >
                            <div>
                              {user.id} - {user.first_name} {user.last_name}
                            </div>
                            <Container>{user.user_types}</Container>
                          </div>
                        </div>
                      </Link>
                    </ListGroupItem>
                  )
                })}
              </ListGroup>
            )} */}
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
    </AdminPageContainer>
  )
}

export default AdminUsersList
