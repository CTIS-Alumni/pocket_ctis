import { useState, useEffect } from 'react'
import styles from './RequestsDashboard.module.css'
import DataTable from '../DataTable/DataTable'
import { _getFetcher } from '../../helpers/fetchHelpers'
import { craftUrl } from '../../helpers/urlHelper'
import { toast, ToastContainer } from 'react-toastify'
import { Modal, Button, Popover, OverlayTrigger } from 'react-bootstrap'

const RequestsDashboard = () => {
  const [data, setData] = useState([])
  const [total, setTotal] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [columns, setColumns] = useState([])
  const [activeItem, setActiveItem] = useState(null)

  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = (data) => {
    let date = null
    if (activeItem?.request_date != null) {
      date = new Date(activeItem.request_date).toUTCString()
    }
    setActiveItem({ ...data, date: date })
    setShow(true)
  }

  const getData = (
    conditions = [
      { name: 'limit', value: 15 },
      { name: 'offset', value: 0 },
    ]
  ) => {
    setIsLoading(true)
    _getFetcher({ requests: craftUrl(['requests'], conditions) })
      .then(({ requests }) => {
        console.log(requests)
        if (requests?.errors?.length > 0) {
          requests?.errors.map((e) => toast.error(e.error))
          return
        }
        setTotal(requests.length)
        setData(requests.data)
      })
      .finally((_) => setIsLoading(false))
  }

  useEffect(() => {
    console.log(activeItem)
  }, [activeItem])

  useEffect(() => {
    getData()
    setColumns([
      'id',
      'first_name',
      'last_name',
      'type',
      'description',
      'request_date',
      'is_closed',
    ])
  }, [])

  const closeRequest = () => {
    console.log('close', activeItem)
  }

  const popover = (
    <Popover id='popover-positioned-left' title='Popover Top'>
      <div className={styles.popoverContainer}>
        <div>Are you sure you would like to resolve this request?</div>
        <button className={styles.confirmBtn} onClick={closeRequest}>
          Confirm
        </button>
      </div>
    </Popover>
  )

  return (
    <>
      <div>
        <h4>Requests</h4>
        <DataTable
          isLoading={isLoading}
          columns={columns}
          data={data}
          onQuery={() => null}
          sortable={false}
          clickable
          clickHandler={handleShow}
          total={total}
        />
      </div>
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        draggable
        pauseOnHover
        theme='light'
      />
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Request</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div>
            <div className={styles.inputContainer}>
              <label className={styles.inputLabel}>Name</label>
              <input
                className={styles.inputField}
                value={`${activeItem?.first_name} ${activeItem?.last_name}`}
              />
            </div>
            <div className={styles.inputContainer}>
              <label className={styles.inputLabel}>Type</label>
              <input
                className={styles.inputField}
                value={`${activeItem?.type}`}
              />
            </div>
            <div className={styles.inputContainer}>
              <label className={styles.inputLabel}>Request date</label>
              <input className={styles.inputField} value={activeItem?.date} />
            </div>
            <div className={styles.inputContainer}>
              <label className={styles.inputLabel}>Description</label>
              <textarea
                className={styles.inputField}
                value={activeItem?.description}
                rows={5}
              />
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            Close
          </Button>
          <OverlayTrigger
            rootClose
            trigger='click'
            placement='top'
            overlay={popover}
          >
            <Button
              variant='primary'
              disabled={activeItem?.is_closed == 0 ? false : true}
              // onClick={resolveRequest}
            >
              {activeItem?.is_closed == 0
                ? 'Close Request'
                : 'Request Resolved'}
            </Button>
          </OverlayTrigger>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default RequestsDashboard
