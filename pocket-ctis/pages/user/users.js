import { useState, useEffect } from 'react'
import { buildCondition, craftUrl } from '../../helpers/urlHelper'
import { _getFetcher } from '../../helpers/fetchHelpers'
import UserPageContainer from '../../components/UserPageContainer/UserPageContainer'
import styles from '../../styles/usersList.module.css'
import SearchBar from '../../components/SearchBar/SearchBar'
import PaginationFooter from '../../components/PaginationFooter/PaginationFooter'
import { Badge, ListGroup, ListGroupItem, Spinner } from 'react-bootstrap'
import { getProfilePicturePath } from '../../helpers/formatHelpers'
import Link from 'next/link'

const UsersList = () => {
  const [data, setData] = useState([])
  const [total, setTotal] = useState()
  const [isLoading, setIsLoading] = useState(false)

  const [limit, setLimit] = useState(15)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchString, setSearchString] = useState('')

  const getData = (queryParams = { offset: 0, limit: 15 }) => {
    const conditions = buildCondition(queryParams)
    setIsLoading(true)
    _getFetcher({ users: craftUrl(['users'], conditions) })
      .then(({ users }) => {
        setTotal(users.length)
        setData(users.data)
      })
      .finally((_) => setIsLoading(false))
  }

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit)
    setCurrentPage(1)
  }
  const handlePageChange = (newPage) => setCurrentPage(newPage)
  const handleSearch = (search) => {
    search.searchValue = search.searchValue.trim()
    setSearchString(search.searchValue.trim())
    setCurrentPage(1)
  }

  useEffect(() => {
    let queryParams = {}

    queryParams.offset = (currentPage - 1) * limit
    queryParams.limit = limit
    queryParams.name = searchString

    getData(queryParams)
  }, [currentPage, limit, searchString])

  return (
    <UserPageContainer>
      <div className={styles.container}>
        {isLoading && (
          <div className={styles.loading}>
            <Spinner />
          </div>
        )}
        <SearchBar onSubmit={handleSearch} />
        {data.length > 0 ? (
          <ListGroup style={{ margin: '20px 0' }} variant='flush'>
            {data.map((user) => {
              return (
                <ListGroupItem>
                  <Link
                    href={`/user/${user.id}`}
                    className='d-flex align-items-center'
                  >
                    <div className='me-3'>
                      <img
                        src={getProfilePicturePath(user.profile_picture)}
                        style={{ width: 75, height: 75, borderRadius: '50%' }}
                      />
                    </div>
                    <div
                      className='d-flex justify-content-between'
                      style={{ flexGrow: 1 }}
                    >
                      <div>
                        {`${user.first_name}${
                          user.nee ? ` ${user.nee} ` : ' '
                        }${user.last_name}`}
                      </div>
                      <div>
                        {user.user_types?.split(',').map((t) => (
                          <Badge className='me-2'>{t.toUpperCase()}</Badge>
                        ))}
                      </div>
                    </div>
                  </Link>
                </ListGroupItem>
              )
            })}
          </ListGroup>
        ) : (
          <div>No users found</div>
        )}
        <PaginationFooter
          total={total}
          limit={limit}
          changeLimit={handleLimitChange}
          currentPage={currentPage}
          pageChange={handlePageChange}
        />
      </div>
    </UserPageContainer>
  )
}

export default UsersList
