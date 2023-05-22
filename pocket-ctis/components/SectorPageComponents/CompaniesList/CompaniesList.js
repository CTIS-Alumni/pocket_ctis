import { useState, useEffect } from 'react'
import { _getFetcher } from '../../../helpers/fetchHelpers'
import { Spinner} from 'react-bootstrap'
import { craftUrl, buildCondition } from '../../../helpers/urlHelper'
import Link from 'next/link'
import styles from './CompaniesList.module.scss'
import PaginationFooter from '../../PaginationFooter/PaginationFooter'

const CompaniesList = ({ sector }) => {
  const [companies, setCompanies] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [total, setTotal] = useState()

  const onQuery = (queryParams) => {
    const conditions = buildCondition(queryParams)
    conditions.push({ name: 'sector_id', value: sector.id })
    setIsLoading(true)
    _getFetcher({ companies: craftUrl(['companies'], conditions) })
      .then(({ companies }) => {
        setTotal(companies.length)
        setCompanies(companies.data)
      })
      .finally((_) => setIsLoading(false))
  }

  const [limit, setLimit] = useState(15)
  const [currentPage, setCurrentPage] = useState(1)

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit)
    setCurrentPage(1)
  }
  const handlePageChange = (newPage) => setCurrentPage(newPage)

  useEffect(() => {
    let queryParams = {}

    queryParams.offset = (currentPage - 1) * limit
    queryParams.limit = limit

    onQuery(queryParams)
  }, [currentPage, limit])

  return (
    <>
    <div style={{position: 'relative'}}>
      {isLoading && 
        <div style={{display: 'flex',
            backgroundColor: 'rgba(255,255,255,0.5)',
            justifyContent: 'center',
            zIndex: 9,
            height: '100%',
            width: '100%',
            position: 'absolute',
            }}>
          <Spinner />
        </div>
      }
      {companies?.map((company) => {
        return (
          <div className={styles.company_item} key={company.id}>
            <Link
              className={styles.company_link}
              href={'/user/companies/' + company.id}
            >
              <div className={styles.company_item_info}>
                <span className={styles.company_item_name}>
                  {company.company_name}
                </span>
              </div>
              <div className={styles.company_item_badge}>
                {company.is_internship == 1 && (
                  <span>Accepts CTIS Interns</span>
                )}
              </div>
            </Link>
          </div>
        )
      })}
    </div>
    {companies?.length > 0 && <PaginationFooter
          total={total}
          limit={limit}
          changeLimit={handleLimitChange}
          currentPage={currentPage}
          pageChange={handlePageChange}
        />}   
    </>
  )
}

export default CompaniesList
