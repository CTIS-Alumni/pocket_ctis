import { useEffect, useState } from 'react'
import styles from './ReportDataPreviewTable.module.scss'
import {
  ChevronLeft,
  ChevronRight,
  ChevronDoubleLeft,
  ChevronDoubleRight,
  ThreeDots,
} from 'react-bootstrap-icons'

const ReportDataPreviewTable = ({ columns, data }) => {
  const defaultPageLength = 15
  const [count, setCount] = useState()
  const [visibleData, setVisibleData] = useState([])
  const [pageLength, setPageLength] = useState(defaultPageLength)
  const [curPage, setCurPage] = useState(1)
  const [numPages, setNumPages] = useState(0)

  useEffect(() => {
    setVisibleData(data.slice((curPage - 1) * pageLength, curPage * pageLength))
  }, [columns, data])

  useEffect(() => {
    setCount(data.length)
  }, [data])

  useEffect(() => {
    setNumPages(Math.ceil(count / pageLength))
  }, [count])

  useEffect(() => {
    setVisibleData(data.slice((curPage - 1) * pageLength, curPage * pageLength))
  }, [curPage])

  useEffect(() => {
    setNumPages(Math.ceil(count / pageLength))
    setCurPage(1)
    setVisibleData(data.slice(0 * pageLength, 1 * pageLength))
  }, [pageLength])

  const nextPage = () => setCurPage((curPage % numPages) + 1)
  const prevPage = () => setCurPage(curPage == 1 ? numPages : curPage - 1)

  let pagesNums = []
  let pages = []
  pages.push(
    <span
      key={1}
      className={1 == curPage ? styles.active : ''}
      onClick={() => setCurPage(1)}
    >
      {1}
    </span>
  )

  for (let i = 2; i < numPages; i++) {
    pagesNums.push(<option value={i}>{i}</option>)
    if (Math.abs(curPage - i) < 2) {
      pages.push(
        <span
          key={i}
          className={i == curPage ? styles.active : ''}
          onClick={() => setCurPage(i)}
        >
          {i}
        </span>
      )
    } else if (curPage - i == 2) {
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
    } else if (curPage - i == -2) {
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
        className={numPages == curPage ? styles.active : ''}
        onClick={() => setCurPage(numPages)}
      >
        {numPages}
      </span>
    )
  }

  return (
    <div key={data}>
      <table className={styles.table} key={columns}>
        <thead>
          <tr>
            {columns.map((c, idx) => {
              return (
                <th key={idx}>
                  <div className={styles.tableHeader}>{c}</div>
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {visibleData.map((d, idx) => {
            return (
              <tr key={idx} className={styles.tableRow}>
                {columns.map((c, idx) => {
                  return (
                    <td key={idx} className={styles.tableCell}>
                      {d[c]}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      {count && (
        <>
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
                    name='pageLength'
                    id='pageLength'
                    value={pageLength}
                    onChange={(event) => {
                      setPageLength(event.target.value)
                    }}
                  >
                    <option value={15}>15 / pages</option>
                    <option value={30}>30 / pages</option>
                  </select>
                </form>
              </div>

              <div>{count} records found</div>
              {/* </div> */}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ReportDataPreviewTable
