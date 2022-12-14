import NavigationBar from '../../../components/navbar/NavigationBar'
import UserInfoSidebar from '../../../components/UserInfoSidebar/UserInfoSidebar'
import InternshipsList from '../../../components/InternshipsList/InternshipsList'
import {
  Container,
  Tab,
  Tabs,
  ListGroup,
  ListGroupItem,
  Badge,
} from 'react-bootstrap'
import { BuildingFill } from 'react-bootstrap-icons'
import styles from '../../../styles/internships.module.scss'
import { fetchInternshipCompanies } from '../../../helpers/searchHelpers'
import Link from 'next/link'

const InternshipCompaniesList = ({ companies }) => {
  return (
    <div className={styles.internship_companies}>
        {companies.map((company) => (
          <div className={styles.internship_companies_item} key={company.id}>
            <a className={styles.company_link} href={`companies/${company.id}`}>
              <div className={styles.internship_companies_item_info}>
                <div>
                  <BuildingFill/>
                </div>
                <div>
                  <span className={styles.internship_companies_item_name}>{company.company_name}</span>
                  <span className={styles.internship_companies_item_sector}>{company.sector_name}</span>
                </div>
              </div>
              <div className={styles.internship_companies_item_badge}>
                <span>Accepts CTIS Interns</span>
              </div>
            </a>
          </div>
        ))}
    </div>
  )
}

const InternshipsDashboard = ({ internships, companies }) => {
  return (
    <main>
      <NavigationBar />
      <UserInfoSidebar />
      <div className={styles.internships_wrapper}>
        <h2 className={styles.internships_title}>Internships</h2>
        <Tabs defaultActiveKey='students' className='mb-3'>
          <Tab eventKey='students' title='Students'>
            <InternshipsList internships={internships} />
          </Tab>
          <Tab eventKey='companies' title='Companies'>
            <InternshipCompaniesList companies={companies} />
          </Tab>
        </Tabs>
      </div>
    </main>
  )
}

export async function getServerSideProps() {
  const res = await fetch(process.env.BACKEND_PATH+"/internships", {
    headers:{
      'x-api-key': process.env.API_KEY
    }
  });
  const { data } = await res.json()
  const companies = await fetchInternshipCompanies()
  return { props: { internships: data, companies } }
}
export default InternshipsDashboard
