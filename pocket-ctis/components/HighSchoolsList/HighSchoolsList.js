import Link from 'next/link'
import { FilterSquareFill } from 'react-bootstrap-icons'
import SearchBar from '../SearchBar/SearchBar'
import styles from './HighSchoolsList.module.scss'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'

const HighSchoolList = ({ highSchools, onSearch, isLoading }) => {
  return (
    <div className={styles.highSchools}>
      <h2 className='custom_table_title'>High Schools</h2>
      <div className={styles.highSchools_search_bar}>
        <FilterSquareFill />
        <SearchBar onSubmit={onSearch} />
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
      <LoadingSpinner isLoading={isLoading} />
      <table className='custom_table'>
        <thead>
          <tr>
            <th>High School Name</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {highSchools?.map((highSchool, i) => (
            <tr className='hoverable' key={i}>
              <td>
                <Link
                  className={`${styles.highSchool_link} link`}
                  href={`/user/highSchools/${highSchool.id}`}
                >
                  {highSchool.high_school_name}
                </Link>
              </td>
              <td>{highSchool.city_name ? `${highSchool.city_name} - ${highSchool.country_name}` : ``}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default HighSchoolList
