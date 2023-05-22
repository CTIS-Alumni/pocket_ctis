import { Easel2Fill } from 'react-bootstrap-icons'

import { Tab, Tabs } from 'react-bootstrap'
import UserPageContainer from '../../../components/UserPageContainer/UserPageContainer'
import PeopleList from '../../../components/SectorPageComponents/PeopleList/PeopleList'
import PeopleWishingList from '../../../components/SectorPageComponents/PeopleWishingList/PeopleWIshingList'
import CompaniesList from '../../../components/SectorPageComponents/CompaniesList/CompaniesList'

import styles from '../../../styles/sectors.module.scss'
import { _getFetcher } from '../../../helpers/fetchHelpers'
import { craftUrl } from '../../../helpers/urlHelper'

const Sector = ({ sector, companies, work}) => {
  return (
    <UserPageContainer>
      <div className={styles.main_div}>
        <div className={styles.sector_info}>
          <div className={styles.sector_icon}>
            <Easel2Fill />
          </div>
          <h4 className={styles.sector_name}>{sector?.data?.sector_name}</h4>
        </div>
        <Tabs defaultActiveKey='people' className='mb-3'>
          <Tab eventKey='people' title='People'>
            <PeopleList people={work.data} sector={sector.data}/>
          </Tab>
          <Tab eventKey='people_wishing' title='People Wishing'>
            <PeopleWishingList sector={sector.data} />
          </Tab>
          <Tab eventKey='companies' title='Companies'>
            <CompaniesList sector={sector.data}/>
          </Tab>
        </Tabs>
      </div>
    </UserPageContainer>
  )
}

export async function getServerSideProps(context) {
  const { cookie } = context.req.headers
  // const data = await _getFetcher(
  const { companies, work, sector } = await _getFetcher(
    {
      companies: craftUrl(
        ['companies'],
        [{ name: 'sector_id', value: context.params.id }]
      ),
      work: craftUrl(
        ['workrecords'],
        [{ name: 'sector_id', value: context.params.id }]
      ),
      sector: craftUrl(['sectors', context.params.id]),
    },
    cookie
  )

  return {
    props: {
      sector: sector,
      companies: companies,
      work: work,
    },
  }
}

export default Sector
