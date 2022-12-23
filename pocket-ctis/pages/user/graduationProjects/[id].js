import React from 'react'

const GraduationProject = ({ graduationproject }) => {
  console.log('Graduation project: ', graduationproject)
  return <div>GraduationProject</div>
}

export async function getServerSideProps(context) {
  const res = await fetch(
    process.env.BACKEND_PATH+"/graduationprojects/" + context.params.id,{
        headers: {
          'x-api-key': process.env.API_KEY
        }
      });
  const graduationproject = await res.json()
  return { props: { graduationproject } }
}
export default GraduationProject
