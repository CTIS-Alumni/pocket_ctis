import { useState, useEffect } from 'react'
import { _getFetcher } from '../../../helpers/fetchHelpers'
import { craftUrl } from '../../../helpers/urlHelper'
import { Container, ListGroup, ListGroupItem, Tabs, Tab } from 'react-bootstrap'
import Link from 'next/link'
import { getProfilePicturePath } from '../../../helpers/formatHelpers'
import AdminPageContainer from '../../../components/AdminPanelComponents/AdminPageContainer/AdminPageContainer'
import styles from '../../../styles/adminUsersList.module.css'
import { ArrowLeft } from 'react-bootstrap-icons'
import CreateUserForm from '../../../components/AdminPanelComponents/CreateUserForm/CreateUserForm'

const AdminUsersList = () => {
  const [activeKey, setActiveKey] = useState('display')
  const [users, setUsers] = useState([])

  useEffect(() => {
    _getFetcher({ users: craftUrl(['users']) })
      .then((res) => setUsers(res.users.data))
      .catch((err) => console.log(err))
  }, [])

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
            {users.length > 0 && (
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
                            src={getProfilePicturePath(
                              user.pic_visibility,
                              user.profile_picture
                            )}
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
            )}
          </Tab>
          <Tab eventKey='create' title='create'>
            <CreateUserForm goBack={() => setActiveKey('display')} />
          </Tab>
        </Tabs>
      </Container>
    </AdminPageContainer>
  )
}

export default AdminUsersList
