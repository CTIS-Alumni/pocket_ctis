import React from 'react'
import NavigationBar from '../../components/navbar/NavigationBar'
import UserInfoSidebar from '../../components/UserInfoSidebar/UserInfoSidebar'
import UsersInfoPanel from '../../components/UsersInfoPanel/UsersInfoPanel'
import {_getFetcherMulti} from "../../helpers/fetchHelpers";

const UsersRoute = ({ work, edu }) => {
  return (
    <main>
      <NavigationBar />
      <UserInfoSidebar />
      <UsersInfoPanel work={work.data} edu={edu.data} />
    </main>
  )
}

//call API, using getServerSideProps. This will be called before the page is served to the frontend
//the result will be added to props object, which will be added to the corresponding component.
export async function getServerSideProps() {
  const results = await _getFetcherMulti(["workrecords", "educationrecords"]);

  const work = results.workrecords;
  const edu = results.educationrecords;

  return { props: { work, edu } }
}

export default UsersRoute
