import { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import styles from './PaginationFooter.module.scss'
import {
  ThreeDots,
  ChevronLeft,
  ChevronDoubleLeft,
  ChevronRight,
  ChevronDoubleRight,
} from 'react-bootstrap-icons'

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
      className={1 == currentPage ? styles.active : ''}
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
          className={i == currentPage ? styles.active : ''}
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
            onClick={() => {
              if (curPage - 5 < 1) setCurPage(numPages)
              else setCurPage(curPage - 5)
            }}
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
          onClick={() => {
            if (curPage + 5 > numPages) setCurPage(1)
            else setCurPage(curPage + 5)
          }}
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
        className={numPages == currentPage ? styles.active : ''}
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
    <div className={styles.pagination}>
      <div>
        <label htmlFor='jumpTo' style={{ marginRight: 10 }}>
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
            Jump to
          </option>
          {pagesNums}
        </select>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'end',
        }}
      >
        {/* <div> */}
        <div>
          <span onClick={prevPage}>
            <ChevronLeft />
          </span>
          {pages}
          <span onClick={nextPage}>
            <ChevronRight />
          </span>
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

        <div>{total} records found</div>
        {/* </div> */}
      </div>
    </div>
  )
}

export default PaginationFooter
