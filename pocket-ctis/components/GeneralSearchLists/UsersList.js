import { useState, useEffect } from 'react'
import { _getFetcher } from '../../helpers/fetchHelpers'
import { toast } from 'react-toastify'
import { Spinner } from 'react-bootstrap'
import { craftUrl, buildCondition } from '../../helpers/urlHelper'
import { ListGroupItem, ListGroup, Badge } from 'react-bootstrap'
import Link from 'next/link'
import { getProfilePicturePath } from '../../helpers/formatHelpers'
import PaginationFooter from '../PaginationFooter/PaginationFooter'

const SearchPageUsersList = ({ search }) => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [total, setTotal] = useState()

  const [limit, setLimit] = useState(15)
  const [currentPage, setCurrentPage] = useState(1)

  const getData = (queryParams = { offset: 0, limit: 15 }) => {
    const conditions = buildCondition(queryParams)
    setIsLoading(true)
    _getFetcher({ users: craftUrl(['users'], conditions) })
      .then((res) => {
        if (res.users.data.length == 0 && res.users.errors?.length > 0) {
          toast.error(res.users.errors[0].error)
        } else {
          setData(res.users.data)
          setTotal(res.users.length)
        }
      })
      .catch((err) => console.log(err))
      .finally((_) => setIsLoading(false))
  }

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit)
    setCurrentPage(1)
  }
  const handlePageChange = (newPage) => setCurrentPage(newPage)

  useEffect(() => {
    console.log('change', search)
    let queryParams = {}

    queryParams.offset = (currentPage - 1) * limit
    queryParams.limit = limit
    queryParams.name = search

    getData(queryParams)
  }, [currentPage, limit, search])

  return (
    <div style={{ position: 'relative' }}>
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            display: 'flex',
            backgroundColor: 'rgba(255,255,255,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1,
            height: '100%',
            width: '100%',
          }}
        >
          <Spinner />
        </div>
      )}
      {data?.length > 0 && (
        <div>
          <h5>Users</h5>
          <ListGroup variant='flush'>
            {data.map((user, idx) => (
              <ListGroupItem key={idx}>
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
                      {`${user.first_name}${user.nee ? ` ${user.nee} ` : ' '}${
                        user.last_name
                      }`}
                    </div>
                    <div>
                      {user.user_types?.split(',').map((t) => (
                        <Badge className='me-2'>{t.toUpperCase()}</Badge>
                      ))}
                    </div>
                  </div>
                </Link>
              </ListGroupItem>
            ))}
          </ListGroup>
          <PaginationFooter
            total={total}
            limit={limit}
            changeLimit={handleLimitChange}
            currentPage={currentPage}
            pageChange={handlePageChange}
          />
          <hr style={{ width: '80%' }} className='mx-auto' />
        </div>
      )}
    </div>
  )
}

export default SearchPageUsersList
