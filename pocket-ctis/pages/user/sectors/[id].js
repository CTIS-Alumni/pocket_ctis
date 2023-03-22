import { Easel2Fill } from 'react-bootstrap-icons'

import { Tab, Tabs } from 'react-bootstrap'
import NavigationBar from '../../../components/navbar/NavigationBar'
import UserInfoSidebar from '../../../components/UserInfoSidebar/UserInfoSidebar'
import PeopleList from '../../../components/SectorPageComponents/PeopleList/PeopleList'
import PeopleWishingList from '../../../components/SectorPageComponents/PeopleWishingList/PeopleWIshingList'
import CompaniesList from '../../../components/SectorPageComponents/CompaniesList/CompaniesList'

import styles from '../../../styles/sectors.module.scss'
import {_getFetcher} from "../../../helpers/fetchHelpers";
import {craftPathUrl, craftUrl} from "../../../helpers/urlHelper";

const Sector = ({ sector, companies, work, users }) => {
  return (
    <main>
      <NavigationBar />
      <UserInfoSidebar />
      <div className={styles.main_div}>
        <div className={styles.sector_info}>
          <div className={styles.sector_icon}>
            <Easel2Fill />
          </div>
          <h4 className={styles.sector_name}>{sector.data.sector_name}</h4>
        </div>
        <Tabs defaultActiveKey='people' className='mb-3'>
          <Tab eventKey='people' title='People'>
            <PeopleList people={work.data} />
          </Tab>
          <Tab eventKey='people_wishing' title='People Wishing'>
            <PeopleWishingList peopleWishing={users.data} />
          </Tab>
          <Tab eventKey='companies' title='Companies'>
            <CompaniesList companies={companies.data} />
          </Tab>
        </Tabs>
      </div>
    </main>
  )
}

export async function getServerSideProps(context) {
  const {cookies} = context.req;
  const token = cookies.AccessJWT;
  const {companies, work, users, sector} = await _getFetcher({
    companies: craftUrl("companies", [{name: "sector_id", value: context.params.id}]),
    work: craftUrl("workrecords", [{name: "sector_id", value: context.params.id}]),
    users: craftUrl("users", [{name: "wantsector_id", value: context.params.id}]),
    sector: craftPathUrl(["sectors", context.params.id])
  }, token);

  return {
    props: {
      sector: sector,
      companies: companies,
      work: work,
      users: users,
    },
  }
}

export default Sector
