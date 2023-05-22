import { useState, useEffect } from 'react'
import { _getFetcher } from '../../helpers/fetchHelpers'
import { toast } from 'react-toastify'
import { Spinner } from 'react-bootstrap'
import { craftUrl, buildCondition } from '../../helpers/urlHelper'
import { ListGroupItem, ListGroup, Badge } from 'react-bootstrap'
import Link from 'next/link'
import PaginationFooter from '../PaginationFooter/PaginationFooter'

const SearchPageCompaniesList = ({ search }) => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [total, setTotal] = useState()

  const [limit, setLimit] = useState(15)
  const [currentPage, setCurrentPage] = useState(1)

  const getData = (queryParams = { offset: 0, limit: 15 }) => {
    const conditions = buildCondition(queryParams)
    setIsLoading(true)
    _getFetcher({ companies: craftUrl(['companies'], conditions) })
      .then((res) => {
        if (
          res.companies.data.length == 0 &&
          res.companies.errors?.length > 0
        ) {
          toast.error(res.companies.errors[0].error)
        } else {
          setData(res.companies.data)
          setTotal(res.companies.length)
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
          <h5>Companies</h5>
          <ListGroup variant='flush'>
            {data.map((company, idx) => (
              <ListGroupItem key={idx}>
                <Link
                  href={`/user/companies/${company.id}`}
                  className='d-flex align-items-center justify-content-between'
                >
                  <div>
                    <h5>{company.company_name}</h5>
                    <span style={{ fontSize: 12, color: '#999' }}>
                      {company.sector_name}
                    </span>
                  </div>
                  <div>
                    {company.is_internship == 1 && (
                      <Badge bg='primary'>Accepts CTIS Interns</Badge>
                    )}
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

export default SearchPageCompaniesList
