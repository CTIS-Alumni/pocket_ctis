import Link from 'next/link'
import SearchBar from '../SearchBar/SearchBar'
import { FilterSquareFill, Check } from 'react-bootstrap-icons'
import styles from './UniversitiesList.module.scss'
import common from '../../styles/common.module.scss'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'

const UniversitiesList = ({ universities, isLoading, onSearch }) => {
  return (
    <section className={styles.universities}>
      <h2 className='custom_table_title'>Universities</h2>
      <div className={styles.universities_search_bar}>
        <FilterSquareFill />
        <SearchBar onSubmit={onSearch} />
      </div>
      <div className={styles.universities_filters}>
        <span className={styles.universities_filters_title}>Filters:</span>
        <form className={styles.universities_filters_form}>
          <input
            type='checkbox'
            className={styles.universities_filters_form_check}
            id='chk_turkey'
          />
          <label
            className={styles.universities_filters_form_label}
            htmlFor='chk_turkey'
          >
            Turkey
          </label>
        </form>
      </div>
      <LoadingSpinner isLoading={isLoading} />
      <div className={common.table_wrapper}>
      <table>
        <thead>
          <tr>
            <th>University Name</th>
            <th>Offers Erasmus</th>
          </tr>
        </thead>
        <tbody>
          {universities.map((university, i) => (
            <tr className={common.hoverable} key={i}>
              <td>
                <Link
                  href={`/user/universities/${university.id}`}
                  // className={`${styles.university_link} link`}
                >
                  {university.edu_inst_name}
                </Link>
              </td>
              <td>
                <span>
                  {university.is_erasmus == 1 && (
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
    </section>
  )
}

export default UniversitiesList
