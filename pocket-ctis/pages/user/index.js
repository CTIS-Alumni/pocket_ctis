import React from 'react'
import NavigationBar from '../../components/navbar/NavigationBar'
import UserInfoSidebar from '../../components/UserInfoSidebar/UserInfoSidebar'
import UsersInfoPanel from '../../components/UsersInfoPanel/UsersInfoPanel'
import {_getFetcherMultiple} from "../../helpers/fetchHelpers";
import {craftUrl} from "../../helpers/urlHelper";

const UsersRoute = ({work, edu}) => {
    return (
        <main>
            <NavigationBar/>
            <UserInfoSidebar/>
            <UsersInfoPanel work={work.data} edu={edu.data}/>
        </main>
    )
}

//call API, using getServerSideProps. This will be called before the page is served to the frontend
//the result will be added to props object, which will be added to the corresponding component.
export async function getServerSideProps(context) {
    const {cookies} = context.req;
    const token = cookies.AccessJWT;
    const {work, edu} = await _getFetcherMultiple(
        {
            work: craftUrl("workrecords"),
            edu: craftUrl("educationrecords")
        }, token
    );

    return {props: {work, edu}}
}

export default UsersRoute
