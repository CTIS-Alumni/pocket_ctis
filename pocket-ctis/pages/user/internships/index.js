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
            <a className={styles.company_link} href={`/internship/companies/${company.id}`}>
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
    <div style={{ height: '100vh' }}>
      <NavigationBar />
      <div className='d-flex' style={{ height: '100%' }}>
        <UserInfoSidebar />
        <Container>
          <h2 className='custom_table_title'>Internships</h2>
          <Tabs defaultActiveKey='students' className='mb-3'>
            <Tab eventKey='students' title='Students'>
              <InternshipsList internships={internships} />
            </Tab>
            <Tab eventKey='companies' title='Companies'>
              <InternshipCompaniesList companies={companies} />
            </Tab>
          </Tabs>
        </Container>
      </div>
    </div>
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
