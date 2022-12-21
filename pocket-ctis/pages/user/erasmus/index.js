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
import NavigationBar from '../../../components/navbar/NavigationBar'
import UserInfoSidebar from '../../../components/UserInfoSidebar/UserInfoSidebar'
import { getSemester, getTimePeriod } from '../../../helpers/dateHelpers'
import {
  fetchErasmusRecords,
  fetchErasmusUniversities,
} from '../../../helpers/searchHelpers'

const ErasmusUnisList = ({ universities }) => {
  return (
    <Container>
      <ListGroup variant='flush'>
        {universities.map((university) => (
          <ListGroupItem key={university.id}>
            <Link href={'/user/universities/' + university.id}>
              <div className='d-flex justify-content-between align-items-start'>
                <div>
                  <h5>{university.inst_name}</h5>
                  <span style={{ color: '#999', fontSize: 14 }}>
                    {university.country_name && `${university.country_name} - `}
                    {university.city_name}
                  </span>
                </div>
                <div>
                  <Badge pill>ERASMUS</Badge>
                </div>
              </div>
            </Link>
          </ListGroupItem>
        ))}
      </ListGroup>
    </Container>
  )
}

const ErasmusStudentsList = ({ erasmus }) => {
  return (
    <Container>
      <ListGroup variant='flush'>
        {erasmus.map((record) => {
          const timePeriod = getTimePeriod(record.start_date, record.end_date)
          const semester = getSemester(record.semester, record.start_date)
          return (
            <ListGroupItem key={record.id}>
              <Link href={'/erasmus/' + record.id}>
                <div className='d-flex justify-content-between align-items-start'>
                  <div>
                    <h5>
                      {`${record.first_name} ${record.last_name} - ${record.inst_name}`}
                    </h5>
                    <p style={{ fontSize: 14, color: '#999' }} className='mb-0'>
                      Semester: {semester}
                    </p>
                    <p style={{ fontSize: 14, color: '#999' }}>{timePeriod}</p>
                  </div>
                  <div>
                    {record.user_types.split(',').map((type, i) => (
                      <Badge key={i} className='mx-1' bg='info' pill>
                        {type.toLocaleUpperCase()}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Link>
            </ListGroupItem>
          )
        })}
      </ListGroup>
    </Container>
  )
}

const ErasmusList = ({ erasmus, eduInsts }) => {
  console.log('Erasmus:', erasmus)
  return (
    <div style={{ height: '100vh' }}>
      <NavigationBar />
      <div className='d-flex' style={{ height: '100%' }}>
        <UserInfoSidebar />
        <Container>
          <h4>Erasmus</h4>
          <Tabs defaultActiveKey='students' className='mb-3'>
            <Tab eventKey='students' title='Students'>
              <ErasmusStudentsList erasmus={erasmus} />
            </Tab>
            <Tab eventKey='university' title='University'>
              <ErasmusUnisList universities={eduInsts} />
            </Tab>
          </Tabs>
        </Container>
      </div>
    </div>
  )
}

export async function getServerSideProps() {
  const [erasmus, eduInsts] = await Promise.all([
    fetchErasmusRecords(),
    fetchErasmusUniversities(),
  ])

  return { props: { erasmus, eduInsts } }
}
export default ErasmusList
