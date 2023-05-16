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
import common from '../../styles/common.module.scss'
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
  }, [limit, total])
  useEffect(() => {
    setCurPage(currentPage)
  }, [currentPage])

  const lastPage = () => setCurPage(numPages)
  const firstPage = () => setCurPage(1)
  const nextPage = () => setCurPage((curPage % numPages) + 1)
  const prevPage = () => setCurPage(curPage == 1 ? numPages : curPage - 1)

  let pagesNums = []
  let pages = []
  pages.push(
    <span
      key={1}
      className={1 == currentPage ? common.page_active : common.page}
      onClick={() => setCurPage(1)}
    >
      {1}
    </span>
  )

  for (let i = 2; i < numPages; i++) {
    pagesNums.push(<option value={i}>{i}</option>)
    if (Math.abs(currentPage - i) < 2) {
      pages.push(
        <span
          key={i}
          className={i == currentPage ? common.page_active : common.page}
          onClick={() => setCurPage(i)}
        >
          {i}
        </span>
      )
    } else if (currentPage - i == 2) {
      pages.push(
        <>
          <span
            key={i}
            className={styles.ellipsis}
            onClick={() => setCurPage(curPage - 5)}
          >
            <ThreeDots className={styles.ellipsisIcon} />
            <ChevronDoubleLeft className={styles.hide} />
          </span>
        </>
      )
    } else if (currentPage - i == -2) {
      pages.push(
        <span
          key={i}
          className={styles.ellipsis}
          onClick={() => setCurPage(curPage + 5)}
        >
          <ThreeDots className={styles.ellipsisIcon} />
          <ChevronDoubleRight className={styles.hide} />
        </span>
      )
    }
  }

  if (numPages > 1) {
    pages.push(
      <span
        key={numPages}
        className={numPages == currentPage ? common.page_active : common.page}
        onClick={() => setCurPage(numPages)}
      >
        {numPages}
      </span>
    )
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      pageLimit: limit,
    },
  })

  return (
    <div className={common.pagination}>
      <div>
        <label htmlFor='jumpTo'>
          Jump To
        </label>
        <select
          name='jumpTo'
          id='jumpTo'
          onChange={(event) => {
            setCurPage(event.target.value)
          }}
          placeholder='Jump to'
          defaultValue=''
          initialValue=''
        >
          <option value='' selected disabled>
            -
          </option>
          {pagesNums}
        </select>
      </div>
      <div className={common.pagi_pages_wrapper}>
        <div className={common.pagi_pages}>
          <span className={common.pagi_icon} onClick={prevPage}>
            <ChevronLeft />
          </span>
          {pages}
          <span className={common.pagi_icon} onClick={nextPage}>
            <ChevronRight />
          </span>
        </div>
        <form style={{ display: 'inline' }}>
          <select
            name='pageLimit'
            id='pageLimit'
            value={formik.values.pageLimit}
            onChange={(event) => {
              formik.setValues(event.target.value)
              changeLimit(event.target.value)
              // setNumPages(Math.ceil(total / event.target.value))
            }}
          >
            <option value={15}>15 / pages</option>
            <option value={30}>30 / pages</option>
          </select>
        </form>
      </div>
    </div>
  )
}

const CompaniesList = ({ companies, onQuery, isLoading, total }) => {
  const [limit, setLimit] = useState(15)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchString, setSearchString] = useState('')
  const [sorting, setSorting] = useState({ name: '', direction: '' })

  console.log(total)
  const handleSorting = (columnName) => {
    if (sorting.name == columnName) {
      if (sorting.direction == 'asc') {
        setSorting({ name: columnName, direction: 'desc' })
      } else {
        setSorting({ name: '', direction: '' })
      }
    } else {
      setSorting({ name: columnName, direction: 'asc' })
    }
    setCurrentPage(1)
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

    queryParams.column = sorting.name
    queryParams.order = sorting.direction
    queryParams.offset = (currentPage - 1) * limit
    queryParams.limit = limit
    queryParams.searchcol = 'sector_name,company_name'
    queryParams.search = searchString

    onQuery(queryParams)
  }, [sorting, currentPage, limit, searchString])

  return (
    <section className={styles.companies}>
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
      <div className={common.table_wrapper}>
      <table>
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
                    (sorting.direction == 'asc' ? (
                      <CaretDownFill />
                    ) : (
                      <CaretUpFill />
                    ))}
                </span>
              </div>
            </th>
            <th
              onClick={() => handleSorting('sector_name')}
              style={{ cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Sector</span>
                <span style={{ width: 20 }}>
                  {sorting.name == 'sector_name' &&
                    (sorting.direction == 'asc' ? (
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
            <tr className={common.hoverable} key={i}>
              <td>
                <a
                  // className={`${styles.company_link} link`}
                  href={`/user/companies/${company.id}`}
                >
                  {company.company_name}
                </a>
              </td>
              <td>
                <a
                  // className={`${styles.company_link} link`}
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
      </div>

      <PaginationFooter
        total={total}
        limit={limit}
        changeLimit={handleLimitChange}
        currentPage={currentPage}
        pageChange={handlePageChange}
      />
    </section>
  )
}

export default CompaniesList
