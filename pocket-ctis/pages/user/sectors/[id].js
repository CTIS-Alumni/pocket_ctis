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
import { getTimePeriod } from '../../../helpers/formatHelpers'
import {
  fetchCompaniesInSector,
  fetchPeopleWantingToWorkInSector,
  fetchPeoplWorkingInSector,
} from '../../../helpers/searchHelpers'
import { Easel2Fill } from 'react-bootstrap-icons'
import styles from '../../../styles/sectors.module.scss'

const PeopleList = ({ people }) => {
  return (
    <div>
      {people.map((person) => {
        const workPeriod = getTimePeriod(
          person.start_date,
          person.end_date,
          person.is_current
        )

        return (
          <div className={styles.people_item} key={person.id}>
            <a className={styles.people_link} href={'/user/' + person.id}>
              <div>
                <div
                  className='user_avatar_48'
                  style={{backgroundImage: "url(" + '/profilepictures/' + (person.record_visibility ? (person.pic_visibility ? person.profile_picture : "defaultuser") : "defaultuser") + '.png' + ")"}}
                />
                <div className={styles.people_item_info}>
                  <span className={styles.people_item_name}>{person.first_name} {person.last_name}</span>
                  <span className={styles.people_item_position}>{person.position || 'Developer'}</span>
                  <span className={styles.people_item_department}>{person.department && `${person.department}`}</span>
                  <span className={styles.people_item_work_period}>{workPeriod}</span>
                  <div className={styles.people_item_location}>
                    <span className={styles.people_item_city}>{person.city_name && `${person.city_name}, `}</span>
                    <span className={styles.people_item_country}>{person.country_name}</span>
                  </div>
                </div>
              </div>
              <div className={styles.people_item_badge}>
                {person.user_types.split(',').map((type) => (
                  <span>
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

const PeopleWishingList = ({ peopleWishing }) => {
  return (
      <div>
        {peopleWishing.map((person) => {
          return (
            <div className={styles.people_wishing_item} key={person.id}>
              <a className={styles.people_wishing_link} href={'/user/' + person.id}>
                <div>
                  <div
                    className='user_avatar_48'
                    style={{backgroundImage: "url(" + '/profilepictures/' + (person.record_visibility ? (person.pic_visibility ? person.profile_picture : "defaultuser") : "defaultuser") + '.png' + ")"}}
                  />
                  <div className={styles.people_wishing_item_info}>
                    <span className={styles.people_wishing_item_name}>{person.first_name} {person.last_name}</span>
                  </div>
                </div>
                <div className={styles.people_wishing_item_badge}>
                  {person.user_types.split(',').map((type, index) => (
                    <span key={index}>
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

const CompaniesList = ({ companies }) => {
  return (
    <div>
      {companies.map((company) => {
        return (
          <div className={styles.company_item} key={company.id}>
            <a className={styles.company_link} href={'/user/companies/' + company.id}>
              <div className={styles.company_item_info}>
                <span className={styles.company_item_name}>{company.company_name}</span>
              </div>
              <div className={styles.company_item_badge}>
                {company.is_internship == 1 && (
                  <span>
                    Accepts CTIS Interns
                  </span>
                )}
              </div>
            </a>
          </div>
        )
      })}
    </div>
  )
}

const Sector = ({ sector, companies, work, users }) => {
  return (
    <main>
      <NavigationBar />
      <UserInfoSidebar />
      <div className={styles.main_div}>
        <div className={styles.sector_info}>
          <div className={styles.sector_icon}>
            <Easel2Fill/>
          </div>
          <h4 className={styles.sector_name}>{sector.data[0].sector_name}</h4>
        </div>
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
      </div>
    </main>
  )
}

export async function getServerSideProps(context) {
  const res = await fetch(
    process.env.BACKEND_PATH+"/sectors/" + context.params.id,{
          headers:{
              'x-api-key': process.env.API_KEY
          }
      });
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
