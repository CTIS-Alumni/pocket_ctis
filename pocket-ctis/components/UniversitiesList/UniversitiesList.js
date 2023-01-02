import Link from 'next/link'
import {
  Container,
  ListGroup,
  ListGroupItem,
  Row,
  Badge,
  Col,
  Form,
} from 'react-bootstrap'
import SearchBar from '../SearchBar/SearchBar'
import { FilterSquareFill, Check} from 'react-bootstrap-icons'
import styles from './UniversitiesList.module.scss'

const UniversitiesList = ({ universities }) => {
  return (
    <div className={styles.universities}>
      <h2 className='custom_table_title'>Universities</h2>
      <div className={styles.universities_search_bar}>
        <FilterSquareFill />
        <SearchBar />
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
      <table className='custom_table'>
        <thead>
          <tr>
            <th>University Name</th>
            <th>Offers Erasmus</th>
          </tr>
        </thead>
        <tbody>
          {universities.map((university) => (
            <tr className='hoverable'>
              <td>
                <a
                  href={`/user/universities/${university.id}`}
                  className={`${styles.university_link} link`}
                >
                  {university.inst_name}
                </a>
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
  )
}

export default UniversitiesList
