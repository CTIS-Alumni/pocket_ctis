import React from 'react'
import {_getFetcher} from "../../../helpers/fetchHelpers";

const GraduationProject = ({ graduationproject }) => {
  return <div>GraduationProject</div>
}

export async function getServerSideProps(context) {
  const {cookies} = context.req;
  const token = cookies.AccessJWT;
  const {graduationproject} = await _getFetcher({graduationproject: craftUrl(["graduation_project", context.params.id])},token);
  return { props: graduationproject  }
}
export default GraduationProject
