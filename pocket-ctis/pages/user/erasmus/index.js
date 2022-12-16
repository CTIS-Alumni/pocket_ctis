import React from 'react'

const ErasmusList = ({ erasmus }) => {
  console.log('Erasmus:', erasmus)
  return <div>ErasmusList</div>
}

export async function getServerSideProps() {
  const res = await fetch('http://localhost:3000/api/erasmus')
  const erasmus = await res.json()
  return { props: { erasmus } }
}
export default ErasmusList
