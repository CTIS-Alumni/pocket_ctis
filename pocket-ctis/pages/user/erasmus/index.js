import { Tab, Tabs } from 'react-bootstrap'
import NavigationBar from '../../../components/navbar/NavigationBar'
import UserInfoSidebar from '../../../components/UserInfoSidebar/UserInfoSidebar'
import ErasmusStudentsList from '../../../components/ErasmusPageComponents/ErasmusStudentsList/ErasmusStudentsList'
import ErasmusUnisList from '../../../components/ErasmusPageComponents/ErasmusUnisList/ErasmusUnisList'

import {
  fetchErasmusRecords,
  fetchErasmusUniversities,
} from '../../../helpers/searchHelpers'

import styles from '../../../styles/erasmus.module.scss'

const ErasmusDashboard = ({ erasmus, eduInsts }) => {
  return (
    <main>
      <NavigationBar />
      <UserInfoSidebar />
      <div className={styles.erasmus_wrapper}>
        <h2 className={styles.erasmus_title}>Erasmus</h2>
        <Tabs defaultActiveKey='students' className='mb-3'>
          <Tab eventKey='students' title='Students'>
            <ErasmusStudentsList erasmus={erasmus.data} />
          </Tab>
          <Tab eventKey='university' title='University'>
            <ErasmusUnisList universities={eduInsts.data} />
          </Tab>
        </Tabs>
      </div>
    </main>
  )
}

export async function getServerSideProps() {
  const [erasmus, eduInsts] = await Promise.all([
    fetchErasmusRecords(),
    fetchErasmusUniversities(),
  ])

  return { props: { erasmus, eduInsts } }
}
export default ErasmusDashboard
