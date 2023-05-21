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
import common from '../../styles/common.module.scss'

const SectorsList = ({ sectors, isLoading, onSearch }) => {
  return (
    <section className={styles.sectors}>
      <h2 className='custom_table_title'>Sectors</h2>
      <div className={styles.sectors_search_bar}>
        <SearchBar onSubmit={onSearch} />
      </div>
      <LoadingSpinner isLoading={isLoading} />
      <div className={common.table_wrapper}>
        <table>
          <thead>
            <tr>
              <th>Sector</th>
            </tr>
          </thead>
          <tbody>
            {sectors.map((sector, i) => (
              <tr className={common.hoverable} key={i}>
                <td>
                  <a
                    //className={`${styles.sector_link} link`}
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
    </section>
  )
}

export default SectorsList
