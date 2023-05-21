import { Tab, Tabs } from 'react-bootstrap'
import InternshipsList from '../../../components/InternshipPageComponents/InternshipsList/InternshipsList'
import InternshipCompaniesList from '../../../components/InternshipPageComponents/InternshipCompaniesList/InternshipCompaniesList'

import styles from '../../../styles/internships.module.scss'
import { _getFetcher } from '../../../helpers/fetchHelpers'
import { craftUrl, buildCondition } from '../../../helpers/urlHelper'
import UserPageContainer from '../../../components/UserPageContainer/UserPageContainer'
import { useState, useEffect } from 'react'

const InternshipsDashboard = ({ internships, companies }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [internshipStudents, setInternshipStudents] = useState([])
  const [studentsTotal, setStudentsTotal] = useState()
  const [internshipCompanies, setInternshipCompanies] = useState([])
  const [companiesTotal, setCompaniesTotal] = useState()

  useEffect(() => {
    setInternshipStudents(internships.data)
    setStudentsTotal(internships.length)
    setInternshipCompanies(companies.data)
    setCompaniesTotal(companies.length)
  }, [])

  const onQueryStudents = (queryParams) => {
    const conditions = buildCondition(queryParams)
    setIsLoading(true)
    _getFetcher({ internships: craftUrl(['internships'], conditions) })
      .then(({ internships }) => {
        setStudentsTotal(internships.length)
        setInternshipStudents(internships.data)
      })
      .finally((_) => setIsLoading(false))
  }

  const onQueryCompanies = (queryParams) => {
    const conditions = buildCondition(queryParams)
    setIsLoading(true)
    _getFetcher({ companies: craftUrl(['companies'], conditions) })
      .then(({ companies }) => {
        setCompaniesTotal(companies.length)
        setInternshipCompanies(companies.data)
      })
      .finally((_) => setIsLoading(false))
  }

  return (
    <UserPageContainer>
      <section className={styles.internships_wrapper}>
        <h2 className={styles.internships_title}>Internships</h2>
        <Tabs defaultActiveKey='students' className='mb-3'>
          <Tab eventKey='students' title='Students'>
            {internshipStudents.length > 0 && (
              <InternshipsList
                isLoading={isLoading}
                internships={internshipStudents}
                total={studentsTotal}
                onQuery={onQueryStudents}
              />
            )}
          </Tab>
          <Tab eventKey='companies' title='Companies'>
            {internshipCompanies.length > 0 && (
              <InternshipCompaniesList
                companies={internshipCompanies}
                total={companiesTotal}
                isLoading={isLoading}
                onQuery={onQueryCompanies}
              />
            )}
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
