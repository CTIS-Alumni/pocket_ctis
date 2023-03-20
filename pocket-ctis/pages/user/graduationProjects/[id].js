import React from 'react'
import {craftPathUrl} from "../../../helpers/urlHelper";
import {_getFetcher} from "../../../helpers/fetchHelpers";

const GraduationProject = ({ graduationproject }) => {
  console.log('Graduation project: ', graduationproject)
  return <div>GraduationProject</div>
}

export async function getServerSideProps(context) {
  const {cookies} = context.req;
  const token = cookies.AccessJWT;
  const {graduationproject} = await _getFetcher({graduationproject: craftPathUrl(["graduation_project", context.params.id])},token);
  return { props: graduationproject  }
}
export default GraduationProject
