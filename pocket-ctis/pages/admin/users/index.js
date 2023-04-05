import { useState, useEffect } from 'react'
import NavigationBar from '../../../components/navbar/NavigationBar'
import AdminSidebar from '../../../components/AdminPanelComponents/AdminSidebar/AdminSidebar'
import { _getFetcher } from '../../../helpers/fetchHelpers'
import { craftUrl } from '../../../helpers/urlHelper'
import { Container, ListGroup, ListGroupItem } from 'react-bootstrap'
import Link from 'next/link'
import { getProfilePicturePath } from '../../../helpers/formatHelpers'

const AdminUsersList = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    _getFetcher({ users: craftUrl('users') }).then((res) =>
      setUsers(res.users.data)
    )
  }, [])

  console.log(users)

  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
      }}
    >
      <NavigationBar />
      <div
        style={{
          display: 'flex',
        }}
      >
        <AdminSidebar />
        <Container>
          <ListGroup variant='flush'>
            {users.map((user) => {
              return (
                <ListGroupItem style={{ width: '100%' }}>
                  <Link href='\admin\users'>
                    <div style={{ display: 'flex' }}>
                      <img
                        //   src={getProfilePicturePath(user.profile_picture)}
                        width={80}
                        height={80}
                        style={{ objectFit: 'contain' }}
                        src={getProfilePicturePath(
                          user.pic_visibility,
                          user.profile_picture
                        )}
                      />
                      <div>
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
        </Container>
      </div>
    </div>
  )
}

export default AdminUsersList
