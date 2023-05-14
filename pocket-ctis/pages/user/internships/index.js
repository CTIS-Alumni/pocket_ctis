import { Tab, Tabs } from 'react-bootstrap'
import NavigationBar from '../../../components/navbar/NavigationBar'
import UserInfoSidebar from '../../../components/UserInfoSidebar/UserInfoSidebar'
import InternshipsList from '../../../components/InternshipPageComponents/InternshipsList/InternshipsList'
import InternshipCompaniesList from '../../../components/InternshipPageComponents/InternshipCompaniesList/InternshipCompaniesList'

import styles from '../../../styles/internships.module.scss'
import {_getFetcher} from "../../../helpers/fetchHelpers";
import {craftUrl} from "../../../helpers/urlHelper";

const InternshipsDashboard = ({ internships, companies }) => {
  return (
    <main>
      <NavigationBar />
      <UserInfoSidebar />
      <section className={styles.internships_wrapper}>
        <h2 className={styles.internships_title}>Internships</h2>
        <Tabs defaultActiveKey='students' className='mb-3'>
          <Tab eventKey='students' title='Students'>
            <InternshipsList internships={internships.data} />
          </Tab>
          <Tab eventKey='companies' title='Companies'>
            <InternshipCompaniesList companies={companies.data} />
          </Tab>
        </Tabs>
      </section>
    </main>
  )
}

export async function getServerSideProps(context) {
  const {cookies} = context.req;
  const token = cookies.AccessJWT;
  const {internships, companies} = await _getFetcher({
    internships: craftUrl("internships"),
    companies: craftUrl("companies", [{name: "is_internship", value: 1}])
  }, token);
  return { props: { internships, companies } }
}
export default InternshipsDashboard
