import Link from 'next/link'
import {
  Badge,
  Container,
  ListGroup,
  ListGroupItem,
  Tab,
  TabPane,
  Tabs,
} from 'react-bootstrap'
import { MortarboardFill } from 'react-bootstrap-icons'
import styles from '../../../styles/erasmus.module.scss'
import NavigationBar from '../../../components/navbar/NavigationBar'
import UserInfoSidebar from '../../../components/UserInfoSidebar/UserInfoSidebar'
import { getSemester, getTimePeriod } from '../../../helpers/formatHelpers'
import {
  fetchErasmusRecords,
  fetchErasmusUniversities,
} from '../../../helpers/searchHelpers'

const ErasmusUnisList = ({ universities }) => {
  return (
    <div className={styles.erasmus_universities}>
        {universities.map((university) => (
          <div className={styles.erasmus_universities_item} key={university.id}>
            <a className={styles.university_link} href={'/user/universities/' + university.id}>
              <div className={styles.erasmus_universities_item_info}>
                <div><MortarboardFill/></div>
                <div>
                  <span className={styles.erasmus_universities_item_name}>{university.inst_name}</span>
                  <span className={styles.erasmus_universities_item_location}>
                    {university.country_name && `${university.country_name} - `}
                    {university.city_name}
                  </span>
                </div>
              </div>
              <div className={styles.erasmus_universities_item_badge}>
                <span>ERASMUS</span>
              </div>
            </a>
          </div>
        ))}
    </div>
  )
}

const ErasmusStudentsList = ({ erasmus }) => {
  return (
    <div className={styles.erasmus_students}>
        {erasmus.map((record) => {
          const timePeriod = getTimePeriod(record.start_date, record.end_date)
          const semester = getSemester(record.semester, record.start_date)

          return (
            <div className={styles.erasmus_students_item} key={record.id}>
              <a className={styles.student_link} href={'/erasmus/' + record.id}>
                <div className={styles.erasmus_students_item_info}>
                  <div
                    className='user_avatar_48'
                    style={{backgroundImage: "url(" + '/profilepictures/' + (record.record_visibility ? (record.pic_visibility ? record.profile_picture : "defaultuser") : "defaultuser") + '.png' + ")"}}
                  />
                  <div>
                    <span className={styles.erasmus_students_item_name}>
                      {`${record.first_name} ${record.last_name}`}
                    </span>
                    <span className={styles.erasmus_students_item_university}>
                      {record.inst_name}
                    </span>
                    <span className={styles.erasmus_students_item_semester}>
                      Semester: {semester}
                    </span>
                    <span className={styles.erasmus_students_item_time_period}>
                      {timePeriod}
                    </span>
                  </div>
                </div>
                <div className={styles.erasmus_students_item_badge}>
                  {record.user_types.split(',').map((type, i) => (
                    <span key={i}>
                      {type.toLocaleUpperCase()}
                    </span>
                  ))}
                </div>
              </a>
            </div>
          )
        })}
    </div>
  )
}

const ErasmusDashboard = ({ erasmus, eduInsts }) => {
  return (
    <main>
      <NavigationBar />
      <UserInfoSidebar />
      <div>
        <h2 className='custom_table_title'>Erasmus</h2>
        <Tabs defaultActiveKey='students' className='mb-3'>
          <Tab eventKey='students' title='Students'>
            <ErasmusStudentsList erasmus={erasmus} />
          </Tab>
          <Tab eventKey='university' title='University'>
            <ErasmusUnisList universities={eduInsts} />
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
