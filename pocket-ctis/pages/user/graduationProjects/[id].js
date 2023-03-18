import React from 'react'
import {_getFetcher} from "../../../helpers/fetchHelpers";
import {craftPathUrl} from "../../../helpers/urlHelper";

const GraduationProject = ({ graduationproject }) => {
  console.log('Graduation project: ', graduationproject)
  return <div>GraduationProject</div>
}

export async function getServerSideProps(context) {
  const {cookies} = context.req;
  const token = cookies.AccessJWT;
  const res = await _getFetcher(craftPathUrl(["graduation_project", context.params.id]),token);
  return { props: { graduationproject: res } }
}
export default GraduationProject
