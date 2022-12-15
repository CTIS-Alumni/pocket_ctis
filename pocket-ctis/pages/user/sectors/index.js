const SectorsList = ({ sectors }) => {
  console.log('sectors:', sectors)
  return <div>SectorsList</div>
}

export async function getStaticProps() {
  const res = await fetch('http://localhost:3000/api/sectors')
  const sectors = await res.json()
  return { props: { sectors } }
}

export default SectorsList
