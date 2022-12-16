import React from 'react'

const Sector = ({ sector }) => {
  console.log('Sector: ', sector)
  return <div>Sector</div>
}

export async function getServerSideProps(context) {
  const res = await fetch(
    'http://localhost:3000/api/sectors/' + context.params.id
  )
  const sector = await res.json()
  return { props: { sector } }
}

export default Sector
