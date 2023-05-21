import { Tab, Tabs } from 'react-bootstrap'
import InternshipsList from '../../../components/InternshipPageComponents/InternshipsList/InternshipsList'
import InternshipCompaniesList from '../../../components/InternshipPageComponents/InternshipCompaniesList/InternshipCompaniesList'

import styles from '../../../styles/internships.module.scss'
import { _getFetcher } from '../../../helpers/fetchHelpers'
import { craftUrl } from '../../../helpers/urlHelper'
import UserPageContainer from '../../../components/UserPageContainer/UserPageContainer'

const InternshipsDashboard = ({ internships, companies }) => {
  return (
    <UserPageContainer>
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
    </UserPageContainer>
  )
}

export async function getServerSideProps(context) {
  const { cookie } = context.req.headers
  const { internships, companies } = await _getFetcher(
    {
      internships: craftUrl(['internships']),
      companies: craftUrl(['companies'], [{ name: 'is_internship', value: 1 }]),
    },
    cookie
  )
  return { props: { internships, companies } }
}
export default InternshipsDashboard
