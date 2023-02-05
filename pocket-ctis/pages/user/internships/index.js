import {
  fetchAllInternshipRecords,
  fetchInternshipCompanies,
} from '../../../helpers/searchHelpers'

import { Tab, Tabs } from 'react-bootstrap'
import NavigationBar from '../../../components/navbar/NavigationBar'
import UserInfoSidebar from '../../../components/UserInfoSidebar/UserInfoSidebar'
import InternshipsList from '../../../components/InternshipPageComponents/InternshipsList/InternshipsList'
import InternshipCompaniesList from '../../../components/InternshipPageComponents/InternshipCompaniesList/InternshipCompaniesList'

import styles from '../../../styles/internships.module.scss'

const InternshipsDashboard = ({ internships, companies }) => {
  return (
    <main>
      <NavigationBar />
      <UserInfoSidebar />
      <div className={styles.internships_wrapper}>
        <h2 className={styles.internships_title}>Internships</h2>
        <Tabs defaultActiveKey='students' className='mb-3'>
          <Tab eventKey='students' title='Students'>
            <InternshipsList internships={internships.data} />
          </Tab>
          <Tab eventKey='companies' title='Companies'>
            <InternshipCompaniesList companies={companies.data} />
          </Tab>
        </Tabs>
      </div>
    </main>
  )
}

export async function getServerSideProps() {
  const internships = await fetchAllInternshipRecords()
  const companies = await fetchInternshipCompanies()
  return { props: { internships, companies } }
}
export default InternshipsDashboard
