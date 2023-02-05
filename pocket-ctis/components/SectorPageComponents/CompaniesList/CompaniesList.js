import Link from 'next/link'
import styles from './CompaniesList.module.scss'

const CompaniesList = ({ companies }) => {
  return (
    <div>
      {companies.map((company) => {
        return (
          <div className={styles.company_item} key={company.id}>
            <Link
              className={styles.company_link}
              href={'/user/companies/' + company.id}
            >
              <div className={styles.company_item_info}>
                <span className={styles.company_item_name}>
                  {company.company_name}
                </span>
              </div>
              <div className={styles.company_item_badge}>
                {company.is_internship == 1 && (
                  <span>Accepts CTIS Interns</span>
                )}
              </div>
            </Link>
          </div>
        )
      })}
    </div>
  )
}

export default CompaniesList
