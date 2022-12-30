export const fetchUsers = async (search) => {
  const res = await fetch(`http://localhost:3000/api/users?name=${search}`)
  const { users } = await res.json()
  return users
}

export const fetchHighSchools = async (search) => {
  const res = await fetch(
    `http://localhost:3000/api/highschools?name=${search}`
  )
  const { highschools } = await res.json()
  return highschools
}

export const fetchCompany = async (search) => {
  const res = await fetch(`http://localhost:3000/api/companies?name=${search}`)
  const { companies } = await res.json()
  return companies
}

export const fetchEduinst = async (search) => {
  const res = await fetch(
    `http://localhost:3000/api/educationinstitutes?name=${search}`
  )
  const { educationinstitutes } = await res.json()
  return educationinstitutes
}

export const fetchGraduationproject = async (search) => {
  const res = await fetch(
    `http://localhost:3000/api/graduationprojects?name=${search}`
  )
  const { gradprojects } = await res.json()
  return gradprojects
}

export const fetchPeoplWorkingInSector = async (sectorId) => {
  const resPeople = await fetch(
    'http://localhost:3000/api/workrecords?worksector_id=' + sectorId
  )
  const { work } = await resPeople.json()
  return work
}

export const fetchCompaniesInSector = async (sectorId) => {
  const resCompanies = await fetch(
    'http://localhost:3000/api/companies?sector_id=' + sectorId
  )
  const { companies } = await resCompanies.json()
  return companies
}

export const fetchPeopleWantingToWorkInSector = async (sectorId) => {
  const resPeopleWanting = await fetch(
    'http://localhost:3000/api/users?wantsector_id=' + sectorId
  )
  const { users } = await resPeopleWanting.json()
  return users
}

export const fetchErasmusUniversities = async () => {
  const res = await fetch(
    process.env.BACKEND_PATH + '/educationinstitutes?erasmus=1'
  )
  const { educationinstitutes } = await res.json()
  return educationinstitutes
}
export const fetchInternshipCompanies = async () => {
  const res = await fetch(process.env.BACKEND_PATH + '/companies?internship=1')
  const { companies } = await res.json()
  return companies
}
export const fetchErasmusRecords = async () => {
  const res = await fetch(process.env.BACKEND_PATH + '/erasmus')
  const { data } = await res.json()
  return data
}
export const fetchInternshipRecords = async () => {
  const res = await fetch(process.env.BACKEND_PATH + '/internship')
  const data = await res.json()
  return data
}

export const fetchUserWorkRecords = async (id) => {
  const res = await fetch(
    process.env.BACKEND_PATH + '/users/' + id + '/workrecords'
  )
  const { data } = await res.json()
  return data
}
export const fetchUserEduRecords = async (id) => {
  const res = await fetch(
    process.env.BACKEND_PATH + '/users/' + id + '/educationrecords'
  )
  const { data } = await res.json()
  return data
}
export const fetchUserSocials = async (id) => {
  const res = await fetch(
    process.env.BACKEND_PATH + '/users/' + id + '/usersocialmedia'
  )
  const { data } = await res.json()
  return data
}
export const fetchUserPhone = async (id) => {
  const res = await fetch(
    process.env.BACKEND_PATH + '/users/' + id + '/phonenumbers'
  )
  const { data } = await res.json()
  return data
}
export const fetchUserSkills = async (id) => {
  const res = await fetch(
    process.env.BACKEND_PATH + '/users/' + id + '/userskills'
  )
  const { data } = await res.json()
  return data
}
export const fetchUserCertificates = async (id) => {
  const res = await fetch(
    process.env.BACKEND_PATH + '/users/' + id + '/certificates'
  )
  const { data } = await res.json()
  return data
}
export const fetchUserEmail = async (id) => {
  const res = await fetch(
    process.env.BACKEND_PATH + '/users/' + id + '/emailaddress'
  )
  const { data } = await res.json()
  return data
}
export const fetchUserErasmus = async (id) => {
  const res = await fetch(
    process.env.BACKEND_PATH + '/users/' + id + '/erasmus'
  )
  const { data } = await res.json()
  return data
}
export const fetchUserLocation = async (id) => {
  const res = await fetch(
    process.env.BACKEND_PATH + '/users/' + id + '/location'
  )
  const { data } = await res.json()
  return data
}
export const fetchUserWantSectors = async (id) => {
  const res = await fetch(
    process.env.BACKEND_PATH + '/users/' + id + '/userwantsector'
  )
  const { data } = await res.json()
  return data
}
export const fetchUserSocieties = async (id) => {
  const res = await fetch(
    process.env.BACKEND_PATH + '/users/' + id + '/userstudentsocieties'
  )
  const { data } = await res.json()
  return data
}
export const fetchUserCareerObjectives = async (id) => {
  const res = await fetch(
    process.env.BACKEND_PATH + '/users/' + id + '/careerobjective'
  )
  const { data } = await res.json()
  return data
}
export const fetchProfilePicture = async (id) => {
  const res = await fetch(
    process.env.BACKEND_PATH + '/users/' + id + '/profilepicture'
  )
  const { data } = await res.json()
  return data
}
export const fetchUserInternships = async (id) => {
  const res = await fetch(
    process.env.BACKEND_PATH + '/users/' + id + '/internships'
  )
  const { data } = await res.json()
  return data
}
export const fetchUserHighSchool = async (id) => {
  const res = await fetch(
    process.env.BACKEND_PATH + '/users/' + id + '/highschool'
  )
  const { data } = await res.json()
  return data
}
