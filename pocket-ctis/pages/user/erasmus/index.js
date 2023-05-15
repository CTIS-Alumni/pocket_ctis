import { Tab, Tabs } from 'react-bootstrap'
import NavigationBar from '../../../components/navbar/NavigationBar'
import UserInfoSidebar from '../../../components/UserInfoSidebar/UserInfoSidebar'
import ErasmusStudentsList from '../../../components/ErasmusPageComponents/ErasmusStudentsList/ErasmusStudentsList'
import ErasmusUnisList from '../../../components/ErasmusPageComponents/ErasmusUnisList/ErasmusUnisList'
import styles from '../../../styles/erasmus.module.scss'
import {_getFetcher} from "../../../helpers/fetchHelpers";
import {craftUrl} from "../../../helpers/urlHelper";

const ErasmusDashboard = ({ erasmus, eduInsts }) => {
  return (
    <main>
      <NavigationBar />
      <UserInfoSidebar />
      <section className={styles.erasmus_wrapper}>
        <h2 className={styles.erasmus_title}>Erasmus</h2>
        <Tabs defaultActiveKey='students' className='mb-3'>
          <Tab eventKey='students' title='Students'>
            <ErasmusStudentsList erasmus={erasmus.data} />
          </Tab>
          <Tab eventKey='university' title='University'>
            <ErasmusUnisList universities={eduInsts.data} />
          </Tab>
        </Tabs>
      </section>
    </main>
  )
}

export async function getServerSideProps(context) {
  const {cookies} = context.req;
  const token = cookies.AccessJWT;
  const {erasmus, eduInsts} = await _getFetcher({
    erasmus: craftUrl("erasmus"),
    eduInsts: craftUrl("educationinstitutes", [{name: "erasmus", value: 1}])
  }, token);

  return { props: { erasmus, eduInsts } }
}
export default ErasmusDashboard
