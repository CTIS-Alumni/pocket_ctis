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
    const {cookies} = context.req;
    const token = cookies.AccessJWT;
    const {gradprojects} = await _getFetcher({
        gradprojects: craftUrl("graduationprojects")
    }, token);
    return { props: { gradprojects } }
}

export default GraduationProjectsDashboard
