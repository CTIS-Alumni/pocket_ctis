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
import { fetchInternshipCompanies } from '../../../helpers/searchHelpers'
import Link from 'next/link'

const InternshipCompaniesList = ({ companies }) => {
  return (
    <Container>
      <ListGroup variant='flush'>
        {companies.map((company) => (
          <ListGroupItem key={company.id}>
            <Link href={`/internship/companies/${company.id}`}>
              <Container>
                <div className='d-flex justify-content-between'>
                  <h5>{company.company_name}</h5>
                  <div>
                    <Badge className='mx-1' bg='primary' pill>
                      Accepts CTIS Interns
                    </Badge>
                  </div>
                </div>
                <Container style={{ fontSize: 14, color: '#999' }}>
                  {company.sector_name}
                </Container>
              </Container>
            </Link>
          </ListGroupItem>
        ))}
      </ListGroup>
    </Container>
  )
}

const InternshipsDashboard = ({ internships, companies }) => {
  return (
    <div style={{ height: '100vh' }}>
      <NavigationBar />
      <div className='d-flex' style={{ height: '100%' }}>
        <UserInfoSidebar />
        <Container>
          <h4>Internships</h4>
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
