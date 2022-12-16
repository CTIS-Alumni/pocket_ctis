import React from 'react'

const University = ({ university }) => {
  console.log('University: ', university)
  return <div>University</div>
}

export async function getServerSideProps(context) {
  const res = await fetch(
    'http://localhost:3000/api/educationinstitutes/' + context.params.id
  )
  const university = await res.json()
  return { props: { university } }
}

export default University
