import Link from 'next/link'
import { BuildingFill } from 'react-bootstrap-icons'
import styles from './InternshipCompaniesList.module.scss'

const InternshipCompaniesList = ({ companies }) => {
  return (
    <table className='custom_table'>
              <thead>
                <tr>
                <th>Name</th>
                <th>Sector</th>
                <th> </th>
                </tr>
              </thead>
      {companies.map((company) => (
        <tbody>
          <tr>
          <Link
            href={`companies/${company.id}`}
          >
            <td>
              <span>
                  {company.company_name}
                </span>
            </td>
          </Link>
          <td>
              <span>
                  {company.sector_name}
                </span>
          </td>
          <td>
          <div className={styles.internship_companies_item_badge}>
              <span>Accepts CTIS Interns</span>
            </div>
          </td>
          </tr>
        </tbody>
      ))}
    </table>
  )
}

export default InternshipCompaniesList
