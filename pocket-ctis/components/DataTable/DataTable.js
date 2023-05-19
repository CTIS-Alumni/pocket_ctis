import { useState, useEffect, useMemo } from 'react'
import { Spinner, Popover, OverlayTrigger } from 'react-bootstrap'
import PaginationFooter from '../PaginationFooter/PaginationFooter'
import {
  CaretDown,
  CaretDownFill,
  CaretUp,
  CaretUpFill,
  Pen,
  Search,
  Trash,
} from 'react-bootstrap-icons'
import { useFormik } from 'formik'
import styles from './DataTable.module.css'

const DataTable = ({
  data,
  columns,
  total,
  onQuery,
  searchCols = '',
  isLoading = false,
  editHandler = null,
  deleteHandler = null,
  sortable = true,
  setSelectedArray,
  selectedArray,
  clickable,
  clickHandler,
}) => {
  const [limit, setLimit] = useState(15)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchString, setSearchString] = useState('')
  const [sorting, setSorting] = useState({ name: '', direction: '' })
  const [toDelete, setToDelete] = useState(null)
  const [refreshKey, setRefreshKey] = useState(Math.random().toString(36))

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
  const handleSearch = ({ searchString }) => {
    setSearchString(searchString?.trim())
    setCurrentPage(1)
  }

  useEffect(() => {
    let queryParams = {}

    queryParams.column = sorting.name
    queryParams.order = sorting.direction
    queryParams.offset = (currentPage - 1) * limit
    queryParams.limit = limit
    queryParams.searchcol = searchCols
    queryParams.search = searchString

    onQuery(queryParams)
  }, [sorting, currentPage, limit, searchString])

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { searchString: '' },
    onSubmit: handleSearch,
  })

  const onDelete = (d) => {
    setToDelete(d)
  }

  const deletePopover = (
    <Popover title='Delete?'>
      <div className={styles.popoverBody}>
        Are you sure you want to delete this?
      </div>
      <button
        className={styles.popoverDeleteBtn}
        onClick={() => {
          deleteHandler(toDelete)
          document.body.click()
        }}
      >
        Confirm
      </button>
    </Popover>
  )

  return (
    <div className={styles.tableContainer}>
      {isLoading && (
        <div className={styles.spinner}>
          <Spinner />
        </div>
      )}
      <form onSubmit={formik.handleSubmit}>
        <div className={styles.searchField}>
          <input
            name='searchString'
            id='searchString'
            value={formik.values.searchString}
            onChange={formik.handleChange}
          />
          {!!!!formik.values.searchString && (
            <button
              className={styles.clearBtn}
              type='button'
              onClick={() => {
                formik.setFieldValue('searchString', '')
                handleSearch({ searchString: ' ' })
              }}
            >
              &#xD7;
            </button>
          )}
          <button type='submit' className={styles.searchBtn}>
            <Search />
          </button>
        </div>
      </form>
      <div style={{ overflow: 'scroll', paddingBottom: 10 }}>
        <table className={styles.table}>
          <thead>
            <tr>
              {setSelectedArray && (
                <th style={{ width: 50 }}>
                  <div className={styles.tableHeader}>check</div>
                </th>
              )}
              {columns.map((c) => (
                <th onClick={() => handleSorting(c)}>
                  <div className={styles.tableHeader}>
                    {c}
                    {sortable && (
                      <div className={styles.sortContainer}>
                        {sorting.name == c ? (
                          sorting.direction == 'asc' ? (
                            <CaretDownFill size={15} />
                          ) : (
                            <CaretUpFill size={15} />
                          )
                        ) : (
                          <>
                            <CaretUp size={15} /> <CaretDown size={15} />
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </th>
              ))}
              {(editHandler || deleteHandler) && (
                <th style={{ width: 100 }}>
                  <div className={styles.tableHeader}>Actions</div>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr
                className={`${styles.tableRow} ${
                  clickable ? styles.clickable : ''
                }`}
              >
                {setSelectedArray && (
                  <td
                    className={styles.tableCell}
                    style={{ textAlign: 'center', zIndex: 2 }}
                  >
                    <input
                      checked={
                        selectedArray.find((s) => s.id == d.id) ? true : false
                      }
                      type='checkbox'
                      onChange={(event) => {
                        if (event.target.checked) {
                          setSelectedArray((prev) => [...prev, d])
                        } else {
                          setSelectedArray((prev) => [
                            ...prev.filter((p) => p.id != d.id),
                          ])
                        }
                      }}
                    />
                  </td>
                )}
                {columns.map((c) => (
                  <td
                    className={styles.tableCell}
                    onClick={() => {
                      if (clickable) clickHandler(d)
                    }}
                  >
                    {d[c] != null && d[c] != undefined && d[c]?.length > 75
                      ? `${d[c].slice(0, 50)} ...`
                      : d[c]}
                  </td>
                ))}
                <td
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 10,
                  }}
                >
                  {editHandler && (
                    <button
                      className={styles.editBtn}
                      onClick={() => editHandler(d)}
                    >
                      <Pen />
                    </button>
                  )}
                  {deleteHandler && (
                    <OverlayTrigger
                      trigger='click'
                      placement='top'
                      rootClose
                      overlay={deletePopover}
                    >
                      <button
                        className={styles.deleteBtn}
                        onClick={() => onDelete(d)}
                      >
                        <Trash />
                      </button>
                    </OverlayTrigger>
                  )}
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
    </div>
  )
}

export default DataTable
