import Link from 'next/link'
import {
  Tab,
  Tabs,
  Container,
  ListGroup,
  ListGroupItem,
  Badge,
} from 'react-bootstrap'
import NavigationBar from '../../../components/navbar/NavigationBar'
import UserInfoSidebar from '../../../components/UserInfoSidebar/UserInfoSidebar'
import { getWorkTimePeriod } from '../../../helpers/dateHelpers'
import {
  fetchCompaniesInSector,
  fetchPeopleWantingToWorkInSector,
  fetchPeoplWorkingInSector,
} from '../../../helpers/searchHelpers'

const PeopleList = ({ people }) => {
  return (
    <Container>
      <ListGroup variant='flush'>
        {people.map((person) => {
          const workPeriod = getWorkTimePeriod(
            person.start_date,
            person.end_date,
            person.is_current
          )
          return (
            <ListGroupItem key={person.id}>
              <Link href={'/user/' + person.id}>
                <div className='d-flex justify-content-between align-items'>
                  <h5>
                    {person.first_name} {person.last_name}
                  </h5>
                  <div>
                    {person.user_types.split(',').map((type) => (
                      <Badge className='mx-1' bg='info' pill>
                        {type.toLocaleUpperCase()}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Container style={{ fontSize: 14 }}>
                  <p
                    className='my-0'
                    style={{ fontSize: 16, fontWeight: 'bold' }}
                  >
                    {person.position || 'Developer'}
                    {person.department && ` - ${person.department}`}
                  </p>
                  <p className='my-0'>{person.type_name}</p>
                  <p style={{ color: '#999' }} className='my-0'>
                    {workPeriod}
                  </p>
                  <p style={{ color: '#999' }}>
                    {person.city_name && `${person.city_name} - `}
                    {person.country_name}
                  </p>
                </Container>
              </Link>
            </ListGroupItem>
          )
        })}
      </ListGroup>
    </Container>
  )
}
const PeopleWishingList = ({ peopleWishing }) => {
  return (
    <Container>
      <ListGroup variant='flush'>
        {peopleWishing.map((person) => {
          return (
            <ListGroupItem key={person.id}>
              <Link href={'/user/' + person.id}>
                <div className='d-flex justify-content-between align-items'>
                  <h5>
                    {person.first_name} {person.last_name}
                  </h5>
                  <div>
                    {person.user_types.split(',').map((type, index) => (
                      <Badge key={index} className='mx-1' bg='info' pill>
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
const CompaniesList = ({ companies }) => {
  return (
    <Container>
      <ListGroup variant='flush'>
        {companies.map((company) => {
          return (
            <ListGroupItem key={company.id}>
              <Link href={'/user/companies/' + company.id}>
                <div className='d-flex justify-content-between align-items'>
                  <h5>{company.company_name}</h5>
                  <div>
                    {company.is_internship == 1 && (
                      <Badge className='mx-1' bg='info' pill>
                        Accepts CTIS Interns
                      </Badge>
                    )}
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

const Sector = ({ sector, companies, work, users }) => {
  return (
    <div style={{ height: '100vh' }}>
      <NavigationBar />
      <div className='d-flex' style={{ height: '100%' }}>
        <UserInfoSidebar />
        <Container>
          <h4>{sector.data[0].sector_name}</h4>
          <Tabs defaultActiveKey='people' className='mb-3'>
            <Tab eventKey='people' title='People'>
              <PeopleList people={work} />
            </Tab>
            <Tab eventKey='people_wishing' title='People Wishing'>
              <PeopleWishingList peopleWishing={users} />
            </Tab>
            <Tab eventKey='companies' title='Companies'>
              <CompaniesList companies={companies} />
            </Tab>
          </Tabs>
        </Container>
      </div>
    </div>
  )
}

export async function getServerSideProps(context) {
  const res = await fetch(
    'http://localhost:3000/api/sectors/' + context.params.id
  )
  const sector = await res.json()

  const data = await Promise.all([
    fetchCompaniesInSector(context.params.id),
    fetchPeoplWorkingInSector(context.params.id),
    fetchPeopleWantingToWorkInSector(context.params.id),
  ])

  const [companies, work, users] = data

  return { props: { sector, companies, work, users } }
}

export default Sector
