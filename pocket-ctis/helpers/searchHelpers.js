import { _getFetcher } from './fetchHelper'

export const fetchUsers = async (search) => {
  const res = await _getFetcher(
    `http://localhost:3000/api/users?name=${search}`
  )
  return res
}

export const fetchSectors = async (search) => {
  const res = await _getFetcher(
    `http://localhost:3000/api/sectors?name=${search}`
  )
  return res
}

export const fetchHighSchools = async (search) => {
  const res = await _getFetcher(
    `http://localhost:3000/api/highschools?name=${search}`
  )
  return res
}

export const fetchHighSchoolById = async (highSchoolId) => {
  const res = await _getFetcher(
    `http://localhost:3000/api/highschools/${highSchoolId}`
  )
  return res.data[0]
}

export const fetchUsersInHighShool = async (highSchoolId) => {
  const res = await _getFetcher(
    `http://localhost:3000/api/users?highschool_id=${highSchoolId}`
  )
  return res
}

export const fetchCompany = async (search) => {
  const res = await _getFetcher(
    `http://localhost:3000/api/companies?name=${search}`
  )
  return res
}

export const fetchEducationInstitutes = async (search) => {
  const res = await _getFetcher(
    `http://localhost:3000/api/educationinstitutes?name=${search}`
  )
  return res
}

export const fetchGraduationproject = async (search) => {
  const res = await _getFetcher(
    `http://localhost:3000/api/graduationprojects?name=${search}`
  )
  return res
}

export const fetchPeoplWorkingInSector = async (sectorId) => {
  const res = await _getFetcher(
    'http://localhost:3000/api/workrecords?worksector_id=' + sectorId
  )
  return res
}

export const fetchCompaniesInSector = async (sectorId) => {
  const res = await _getFetcher(
    'http://localhost:3000/api/companies?sector_id=' + sectorId
  )
  return res
}

export const fetchUsersInCompany = async (companyId) => {
  const res = await _getFetcher(
    'http://localhost:3000/api/workrecords?company_id=' + companyId
  )
  return res
}

export const fetchCompanyById = async (companyId) => {
  const res = await _getFetcher(
    'http://localhost:3000/api/companies/' + companyId
  )
  return res.data[0]
}

export const fetchEducationInstituteById = async (eduInstId) => {
  const res = await _getFetcher(
    'http://localhost:3000/api/educationinstitutes/' + eduInstId
  )
  return res.data[0]
}

export const fetchEducationalRecordsByInstitute = async (eduInstId) => {
  const res = await _getFetcher(
    'http://localhost:3000/api/educationrecords?edu_inst_id=' + eduInstId
  )
  return res
}

export const fetchSector = async (sectorId) => {
  const res = await _getFetcher('http://localhost:3000/api/sectors/' + sectorId)
  return res
}

export const fetchAllCompanies = async () => {
  const res = await _getFetcher('http://localhost:3000/api/companies')
  return res
}

export const fetchAllInternshipRecords = async () => {
  const res = await _getFetcher('http://localhost:3000/api/internships')
  return res
}

export const fetchAllEducationInstitutes = async () => {
  const res = await _getFetcher('http://localhost:3000/api/educationinstitutes')
  return res
}

export const fetchAllCountries = async () => {
  const res = await _getFetcher('http://localhost:3000/api/countries')
  return res
}
export const fetchCitiesOfACountry = async (countryId) => {
  const res = await _getFetcher(
    'http://localhost:3000/api/countries/' + countryId + '/cities'
  )
  return res
}

export const fetchAllCities = async () => {
  const res = await _getFetcher('http://localhost:3000/api/cities')
  return res
}

export const fetchAllSkillTypes = async () => {
  const res = await _getFetcher('http://localhost:3000/api/skilltypes')
  return res
}

export const fetchAllWorkTypes = async () => {
  const res = await _getFetcher('http://localhost:3000/api/worktypes')
  return res
}

export const fetchAllSectors = async () => {
  const res = await _getFetcher('http://localhost:3000/api/sectors')
  return res
}

export const fetchAllHighSchool = async () => {
  const res = await _getFetcher('http://localhost:3000/api/highschools')
  return res
}

export const fetchAllDegreeTypes = async () => {
  const res = await _getFetcher('http://localhost:3000/api/degreetypes')
  return res
}

export const fetchAllSocieties = async () => {
  const res = await _getFetcher('http://localhost:3000/api/studentsocieties')
  return res
}

export const fetchAllGraduationProjects = async () => {
  const res = await _getFetcher('http://localhost:3000/api/graduationprojects')
  return res
}

export const fetchPeopleWantingToWorkInSector = async (sectorId) => {
  const res = await _getFetcher(
    'http://localhost:3000/api/users?wantsector_id=' + sectorId
  )
  return res
}

export const fetchErasmusUniversities = async () => {
  const res = await _getFetcher(
    'http://localhost:3000/api/educationinstitutes?erasmus=1'
  )
  return res
}

export const fetchInternshipCompanies = async () => {
  const res = await _getFetcher(
    'http://localhost:3000/api/companies?internship=1'
  )
  return res
}

export const fetchErasmusRecords = async () => {
  const res = await _getFetcher('http://localhost:3000/api/erasmus')
  return res
}

export const fetchProfile = async (id) => {
  const res = await fetch(
    'http://localhost:3000/api/users/' + id + '/profile',
    {
      headers: {
        'x-api-key': 'SOMESECRETKEYWENEEDTOPUTHERE',
      },
    }
  )
  const { data, errors } = await res.json()
  return { data, errors }
}

export const getWorkUpdates = async () => {
  const res = await _getFetcher('http://localhost:3000/api/users/workrecords')
  return res
}

export const getEducationUpdates = async () => {
  const res = await fetch('http://localhost:3000/api/users/educationrecords')
  console.log(res)
  return res
}
