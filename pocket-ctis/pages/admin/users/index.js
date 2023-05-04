import { useState, useEffect } from 'react'
import { _getFetcher } from '../../../helpers/fetchHelpers'
import { craftUrl } from '../../../helpers/urlHelper'
import { Container, ListGroup, ListGroupItem } from 'react-bootstrap'
import Link from 'next/link'
import { getProfilePicturePath } from '../../../helpers/formatHelpers'
import AdminPageContainer from '../../../components/AdminPanelComponents/AdminPageContainer/AdminPageContainer'

const AdminUsersList = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    _getFetcher({ users: craftUrl('users') }).then((res) =>
      setUsers(res.users.data)
    )
  }, [])

  console.log(users)

  return (
    <AdminPageContainer>
      <Container>
        <ListGroup variant='flush'>
          {users.map((user) => {
            return (
              <ListGroupItem style={{ width: '100%' }}>
                <Link href={`/admin/users/${user.id}`}>
                  <div style={{ display: 'flex' }}>
                    <img
                      //   src={getProfilePicturePath(user.profile_picture)}
                      width={80}
                      height={80}
                      style={{ objectFit: 'contain', borderRadius: '50%' }}
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
      </Container>
    </AdminPageContainer>
  )
}

export default AdminUsersList
