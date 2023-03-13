import {
  FilterSquareFill,
  Check,
  CaretDownFill,
  CaretUpFill,
  ThreeDots,
  ChevronLeft,
  ChevronDoubleLeft,
  ChevronDoubleRight,
  ChevronRight,
} from 'react-bootstrap-icons'
import SearchBar from '../SearchBar/SearchBar'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import styles from './CompaniesList.module.scss'
import { useEffect, useState } from 'react'
import { useFormik } from 'formik'

const PaginationFooter = ({
  total,
  limit,
  changeLimit,
  currentPage,
  pageChange,
}) => {
  const [numPages, setNumPages] = useState(Math.ceil(total / limit))
  const [curPage, setCurPage] = useState(currentPage)

  useEffect(() => {
    setNumPages(Math.ceil(total / limit))
    formik.setValues('pageLimit', limit)
  }, [])

  useEffect(() => {
    pageChange(curPage)
  }, [curPage])

  //for initialization
  useEffect(() => {
    setNumPages(Math.ceil(total / limit))
  }, [limit])
  useEffect(() => {
    setCurPage(currentPage)
  }, [currentPage])

  const lastPage = () => setCurPage(numPages)
  const firstPage = () => setCurPage(1)
  const nextPage = () => setCurPage((curPage % numPages) + 1)
  const prevPage = () => setCurPage(curPage == 1 ? numPages : curPage - 1)

  let pages = []
  for (let i = 1; i <= numPages; i++) {
    if (Math.abs(currentPage - i) < 2) {
      pages.push(
        <span
          key={i}
          className={i == currentPage ? styles.active : ''}
          onClick={() => setCurPage(i)}
        >
          {i}
        </span>
      )
    }
    if (Math.abs(currentPage - i) == 2) {
      pages.push(
        <span key={i} className={styles.ellipsis}>
          <ThreeDots />
        </span>
      )
    }
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      pageLimit: limit,
    },
  })

  return (
    <div className={styles.pagination}>
      <span onClick={firstPage}>
        <ChevronDoubleLeft />
      </span>
      <span onClick={prevPage}>
        <ChevronLeft />
      </span>
      {pages}
      <span onClick={nextPage}>
        <ChevronRight />
      </span>
      <span onClick={lastPage}>
        <ChevronDoubleRight />
      </span>
      <form>
        <select
          name='pageLimit'
          id='pageLimit'
          value={formik.values.pageLimit}
          onChange={(event) => {
            formik.setValues(event.target.value)
            changeLimit(event.target.value)
            setNumPages(Math.ceil(total / event.target.value))
          }}
        >
          <option value={15}>15 / pages</option>
          <option value={30}>30 / pages</option>
        </select>
      </form>
    </div>
  )
}

const CompaniesList = ({ companies, onSearch, onQuery, isLoading }) => {
  const [limit, setLimit] = useState(15)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchString, setSearchString] = useState('')
  const [sorting, setSorting] = useState({ name: '', direction: '' })

  const handleSorting = (columnName) => {
    if (sorting.name == columnName) {
      if (sorting.direction == 'desc') {
        setSorting({ name: columnName, direction: 'asc' })
      } else {
        setSorting({ name: '', direction: '' })
      }
    } else {
      setSorting({ name: columnName, direction: 'desc' })
    }
    setCurrentPage(1)
  }

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit)
    setCurrentPage(1)
  }
  const handlePageChange = (newPage) => setCurrentPage(newPage)
  const handleSearch = (search) => {
    setSearchString(search.searchValue)
    setCurrentPage(1)
  }

  useEffect(() => {
    let queryParams = {}

    queryParams.column = sorting.name
    queryParams.order = sorting.direction
    queryParams.offset = (currentPage - 1) * limit
    queryParams.limit = limit
    queryParams.searchString = searchString

    onQuery(queryParams)
  }, [sorting, currentPage, limit, searchString])

  return (
    <div className={styles.companies}>
      <h2 className='custom_table_title'>Companies</h2>
      <div className={styles.companies_search_bar}>
        <FilterSquareFill />
        <SearchBar onSubmit={handleSearch} />
      </div>
      <div className={styles.companies_filters}>
        <span className={styles.companies_filters_title}>Filters:</span>
        <form className={styles.companies_filters_form}>
          <input
            type='checkbox'
            className={styles.companies_filters_form_check}
            id='chk_accepts_internships'
          />
          <label
            className={styles.companies_filters_form_label}
            htmlFor='chk_accepts_internships'
          >
            Accepts Internships
          </label>
        </form>
      </div>
      <LoadingSpinner isLoading={isLoading} />
      <table className='custom_table'>
        <thead>
          <tr>
            <th
              onClick={() => handleSorting('company_name')}
              style={{ cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Company Name</span>
                <span style={{ width: 20 }}>
                  {sorting.name == 'company_name' &&
                    (sorting.direction == 'desc' ? (
                      <CaretDownFill />
                    ) : (
                      <CaretUpFill />
                    ))}
                </span>
              </div>
            </th>
            <th
              onClick={() => handleSorting('company_sector')}
              style={{ cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Sector</span>
                <span style={{ width: 20 }}>
                  {sorting.name == 'company_sector' &&
                    (sorting.direction == 'desc' ? (
                      <CaretDownFill />
                    ) : (
                      <CaretUpFill />
                    ))}
                </span>
              </div>
            </th>
            <th>Accepts Internships</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company, i) => (
            <tr className='hoverable' key={i}>
              <td>
                <a
                  className={`${styles.company_link} link`}
                  href={`/user/companies/${company.id}`}
                >
                  {company.company_name}
                </a>
              </td>
              <td>
                <a
                  className={`${styles.company_link} link`}
                  href={`/user/sectors/${company.sector_id}`}
                >
                  {company.sector_name}
                </a>
              </td>
              <td>
                <span>
                  {company.is_internship == 1 && (
                    <div className={styles.internship_badge}>
                      <Check />
                    </div>
                  )}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <PaginationFooter
        total={100}
        limit={limit}
        changeLimit={handleLimitChange}
        currentPage={currentPage}
        pageChange={handlePageChange}
      />
    </div>
  )
}

export default CompaniesList
