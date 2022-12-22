export const fetchUsers = async (search) => {
  const res = await fetch("http://localhost:3000/api"+`/users?name=${search}`+"&key="+process.env.API_KEY)
  const { users } = await res.json()
  return users
}

export const fetchHighSchools = async (search) => {
  const res = await fetch(
    "http://localhost:3000/api"+`/highschools?name=${search}`+"&key="+process.env.API_KEY
  )
  const { highschools } = await res.json()
  return highschools
}

export const fetchCompany = async (search) => {
  const res = await fetch("http://localhost:3000/api"+`/companies?name=${search}`+"&key="+process.env.API_KEY)
  const { companies } = await res.json()
  return companies
}

export const fetchEduinst = async (search) => {
  const res = await fetch(
    "http://localhost:3000/api"+`api/educationinstitutes?name=${search}`+"&key="+process.env.API_KEY
  )
  const { educationinstitutes } = await res.json()
  return educationinstitutes
}

export const fetchGraduationproject = async (search) => {
  const res = await fetch(
    "http://localhost:3000/api"+`/graduationprojects?name=${search}`+"&key="+process.env.API_KEY
  )
  const { gradprojects } = await res.json()
  return gradprojects
}

export const fetchPeoplWorkingInSector = async (sectorId) => {
  const resPeople = await fetch(
    "http://localhost:3000/api"+"/workrecords?worksector_id=" + sectorId+"&key="+process.env.API_KEY
  )
  const { work } = await resPeople.json()
  return work
}

export const fetchCompaniesInSector = async (sectorId) => {
  const resCompanies = await fetch(
    "http://localhost:3000/api"+"/companies?sector_id=" + sectorId+"&key="+process.env.API_KEY
  )
  const { companies } = await resCompanies.json()
  return companies
}

export const fetchPeopleWantingToWorkInSector = async (sectorId) => {
  const resPeopleWanting = await fetch(
    "http://localhost:3000/api"+"/users?wantsector_id=" + sectorId+"&key="+process.env.API_KEY
  )
  const { users } = await resPeopleWanting.json()
  return users
}

export const fetchErasmusUniversities = async () => {
  const res = await fetch(
    "http://localhost:3000/api" + '/educationinstitutes?erasmus=1'+"&key="+process.env.API_KEY
  )
  const { educationinstitutes } = await res.json()
  return educationinstitutes
}
export const fetchInternshipCompanies = async () => {
  const res = await fetch("http://localhost:3000/api" + '/companies?internship=1'+"&key="+process.env.API_KEY)
  const { companies } = await res.json()
  return companies
}
export const fetchErasmusRecords = async () => {
  const res = await fetch("http://localhost:3000/api" + '/erasmus'+"?key="+process.env.API_KEY)
  const { data } = await res.json()
  return data
}
export const fetchInternshipRecords = async () => {
  const res = await fetch("http://localhost:3000/api" + '/internship'+"?key="+process.env.API_KEY)
  const data = await res.json()
  return data
}
