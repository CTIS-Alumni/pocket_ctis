import Link from 'next/link'
import { BuildingFill } from 'react-bootstrap-icons'
import styles from './InternshipCompaniesList.module.scss'

const InternshipCompaniesList = ({ companies }) => {
  return (
    <div className={styles.internship_companies}>
      {companies.map((company) => (
        <div className={styles.internship_companies_item} key={company.id}>
          <Link
            className={styles.company_link}
            href={`companies/${company.id}`}
          >
            <div className={styles.internship_companies_item_info}>
              <div>
                <BuildingFill />
              </div>
              <div>
                <span className={styles.internship_companies_item_name}>
                  {company.company_name}
                </span>
                <span className={styles.internship_companies_item_sector}>
                  {company.sector_name}
                </span>
              </div>
            </div>
            <div className={styles.internship_companies_item_badge}>
              <span>Accepts CTIS Interns</span>
            </div>
          </Link>
        </div>
      ))}
    </div>
  )
}

export default InternshipCompaniesList
