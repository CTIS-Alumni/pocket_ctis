import { FilterSquareFill, Check} from 'react-bootstrap-icons'
import styles from './CompaniesList.module.scss'

const CompaniesList = ({ companies }) => {
  return (
    <div className={styles.companies}>
      <h2 className='custom_table_title'>Companies</h2>
      <div className={styles.companies_search_bar}>
        <FilterSquareFill />
      </div>
      <div className={styles.companies_filters}>
        <span className={styles.companies_filters_title}>Filters:</span>
        <form className={styles.companies_filters_form}>
          <input
            type='checkbox'
            className={styles.companies_filters_form_check}
            id='chk_accepts_internships'
          />
          <label
            className={styles.companies_filters_form_label}
            htmlFor='chk_accepts_internships'
          >
            Accepts Internships
          </label>
        </form>
      </div>
      <table className='custom_table'>
        <thead>
          <tr>
            <th>Company Name</th>
            <th>Sector</th>
            <th>Accepts Internships</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company, i) => (
            <tr className='hoverable' key={i}>
              <td>
                <a
                  className={`${styles.company_link} link`}
                  href={`/user/companies/${company.id}`}
                >
                  {company.company_name}
                </a>
              </td>
              <td>
                <a className={`${styles.company_link} link`}
                href={`/user/sectors/${company.sector_id}`}>{company.sector_name}</a>
              </td>
              <td>
                <span>
                  {company.is_internship == 1 && (
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

export default CompaniesList

