import NavigationBar from '../../../components/navbar/NavigationBar'
import UserInfoSidebar from '../../../components/UserInfoSidebar/UserInfoSidebar'
import GraduationProjectsList from '../../../components/GraduationProjectsList/GraduationProjectsList'
import {_getFetcher} from "../../../helpers/fetchHelpers";
import {craftUrl} from "../../../helpers/urlHelper";

const GraduationProjectsDashboard = ({ gradprojects }) => {
  return (
    <main>
      <NavigationBar />
      <UserInfoSidebar />
      <GraduationProjectsList graduationProjects={gradprojects.data} />
    </main>
  )
}

export async function getServerSideProps(context) {
    const {cookie} = context.req.headers
    const {gradprojects} = await _getFetcher({
        gradprojects: craftUrl(["graduationprojects"])
    }, cookie);
    return { props: { gradprojects } }
}

export default GraduationProjectsDashboard
