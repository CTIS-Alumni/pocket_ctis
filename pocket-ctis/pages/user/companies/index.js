import CompaniesList from '../../../components/CompaniesList/CompaniesList'
import NavigationBar from '../../../components/navbar/NavigationBar'
import UserInfoSidebar from '../../../components/UserInfoSidebar/UserInfoSidebar'
import {fetchResults, fetchCount} from "../../../helpers/searchHelpers";

const CompaniesDashboard = ({ companies ,count }) => {
  return (
    <main>
        <NavigationBar />
        <UserInfoSidebar />
        <div>
            <CompaniesList companies={companies} count={count} />
        </div>

    </main>
  )
}

export async function getServerSideProps() {
    const [companies, count] = await Promise.all([
        fetchResults(15, 1, "companies", "company_name", "asc"),
        fetchCount("companies")
    ]);
  return { props: { companies:companies, count: count}}
}

export default CompaniesDashboard
