import { useState, useEffect } from 'react'
import { _getFetcher } from '../../helpers/fetchHelpers'
import { toast } from 'react-toastify'
import { Spinner } from 'react-bootstrap'
import { craftUrl, buildCondition } from '../../helpers/urlHelper'
import { ListGroupItem, ListGroup, Badge } from 'react-bootstrap'
import Link from 'next/link'
import PaginationFooter from '../PaginationFooter/PaginationFooter'

const SearchPageEduInstsList = ({ search }) => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [total, setTotal] = useState()

  const [limit, setLimit] = useState(15)
  const [currentPage, setCurrentPage] = useState(1)

  const getData = (queryParams = { offset: 0, limit: 15 }) => {
    const conditions = buildCondition(queryParams)
    setIsLoading(true)
    _getFetcher({ eduinsts: craftUrl(['educationinstitutes'], conditions) })
      .then((res) => {
        if (res.eduinsts.data.length == 0 && res.eduinsts.errors?.length > 0) {
          toast.error(res.eduinsts.errors[0].error)
        } else {
          setData(res.eduinsts.data)
          setTotal(res.eduinsts.length)
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
          <h5>Education Institutes</h5>
          <ListGroup variant='flush'>
            {data.map((eduInst) => (
              <ListGroupItem key={eduInst.id}>
                <Link
                  href={`/user/universities/${eduInst.id}`}
                  className='d-flex justify-content-between align-items-start'
                >
                  <div>
                    <h5>{eduInst.edu_inst_name}</h5>
                    <span style={{ fontSize: 12, color: '#999' }}>
                      {`${eduInst.country_name || ''} ${
                        eduInst.city_name || ''
                      }`}
                    </span>
                  </div>
                  {eduInst.is_erasmus == 1 && (
                    <Badge bg='primary' pill>
                      Erasmus
                    </Badge>
                  )}
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

export default SearchPageEduInstsList
