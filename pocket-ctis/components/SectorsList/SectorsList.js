import Link from 'next/link'
import {
  Container,
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  Form,
} from 'react-bootstrap'
import { FilterSquareFill, Check } from 'react-bootstrap-icons'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import SearchBar from '../SearchBar/SearchBar'
import styles from './SectorsList.module.scss'

const SectorsList = ({ sectors, isLoading, onSearch }) => {
  return (
    <div className={styles.sectors}>
      <h2 className='custom_table_title'>Sectors</h2>
      <div className={styles.sectors_search_bar}>
        <FilterSquareFill />
        <SearchBar onSubmit={onSearch} />
      </div>
      <div className={styles.sectors_filters}>
        <span className={styles.sectors_filters_title}>Filters:</span>
        <form className={styles.sectors_filters_form}>
          <input
            type='checkbox'
            className={styles.sectors_filters_form_check}
            id='chk_turkey'
          />
          <label
            className={styles.sectors_filters_form_label}
            htmlFor='chk_turkey'
          >
            Turkey
          </label>
        </form>
      </div>
      <LoadingSpinner isLoading={isLoading} />
      <table className='custom_table'>
        <thead>
          <tr>
            <th>Sector</th>
          </tr>
        </thead>
        <tbody>
          {sectors.map((sector, i) => (
            <tr className='hoverable' key={i}>
              <td>
                <a
                  className={`${styles.sector_link} link`}
                  href={`/user/sectors/${sector.id}`}
                >
                  {sector.sector_name}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default SectorsList
