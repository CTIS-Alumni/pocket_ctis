import Link from 'next/link'
import {
  Container,
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  Form,
} from 'react-bootstrap'
import { FilterSquareFill, Check} from 'react-bootstrap-icons'
import SearchBar from '../SearchBar/SearchBar'
import styles from './HighSchoolsList.module.scss'

const HighSchoolList = ({ highSchools }) => {
  return (
    <div className={styles.highSchools}>
      <h2 className='custom_table_title'>High Schools</h2>
      <div className={styles.highSchools_search_bar}>
        <FilterSquareFill />
        <SearchBar />
      </div>
      <div className={styles.highSchools_filters}>
        <span className={styles.highSchools_filters_title}>Filters:</span>
        <form className={styles.highSchools_filters_form}>
          <input
            type='checkbox'
            className={styles.highSchools_filters_form_check}
            id='chk_turkey'
          />
          <label
            className={styles.highSchools_filters_form_label}
            htmlFor='chk_turkey'
          >
            Turkey
          </label>
        </form>
      </div>
      <table className='custom_table'>
        <thead>
          <tr>
            <th>High School Name</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {highSchools.map((highSchool, i) => (
            <tr className='hoverable' key={i}>
              <td>
                <a
                  className={`${styles.highSchool_link} link`}
                  href={`/user/highSchools/${highSchool.id}`}
                >
                  {highSchool.high_school_name}
                </a>
              </td>
              <td>
                {`${highSchool.city_name} - ${highSchool.country_name}`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default HighSchoolList
