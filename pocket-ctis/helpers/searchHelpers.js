export const fetchUsers = async (search) => {
    const res = await fetch(process.env.BACKEND_PATH + `/users?name=${search}` ,{
            headers: {
              'x-api-key':process.env.API_KEY
            }
        });
    const {users} = await res.json();
    return users;
}

export const fetchHighSchools = async (search) => {
    const res = await fetch(
        process.env.BACKEND_PATH + `/highschools?name=${search}`,
        {
            headers: {
              'x-api-key':process.env.API_KEY
            }
        });
    const {highschools} = await res.json();
    return highschools;
}

export const fetchCompany = async (search) => {
    const res = await fetch(process.env.BACKEND_PATH + `/companies?name=${search}` ,{
            headers: {
              'x-api-key':process.env.API_KEY
            }
        });
    const {companies} = await res.json()
    return companies
}

export const fetchEduinst = async (search) => {
    const res = await fetch(
        process.env.BACKEND_PATH + `api/educationinstitutes?name=${search}` ,{
            headers: {
              'x-api-key':process.env.API_KEY
            }
        });
    const {educationinstitutes} = await res.json()
    return educationinstitutes
}

export const fetchGraduationproject = async (search) => {
    const res = await fetch(
        process.env.BACKEND_PATH + `/graduationprojects?name=${search}` ,{
            headers: {
              'x-api-key':process.env.API_KEY
            }
        });
    const {gradprojects} = await res.json()
    return gradprojects
}

export const fetchPeoplWorkingInSector = async (sectorId) => {
    const resPeople = await fetch(
        process.env.BACKEND_PATH + "/workrecords?worksector_id=" + sectorId ,{
            headers: {
              'x-api-key':process.env.API_KEY
            }
        });
    const {work} = await resPeople.json()
    return work
}

export const fetchCompaniesInSector = async (sectorId) => {
    const resCompanies = await fetch(
        process.env.BACKEND_PATH + "/companies?sector_id=" + sectorId ,{
            headers: {
              'x-api-key':process.env.API_KEY
            }
        });
    const {companies} = await resCompanies.json()
    return companies
}

export const fetchPeopleWantingToWorkInSector = async (sectorId) => {
    const resPeopleWanting = await fetch(
        process.env.BACKEND_PATH + "/users?wantsector_id=" + sectorId ,{
            headers: {
              'x-api-key':process.env.API_KEY
            }
        });
    const {users} = await resPeopleWanting.json()
    return users
}

export const fetchErasmusUniversities = async () => {
    const res = await fetch(
        process.env.BACKEND_PATH + '/educationinstitutes?erasmus=1' ,{
            headers: {
              'x-api-key':process.env.API_KEY
            }
        });
    const {educationinstitutes} = await res.json()
    return educationinstitutes
}
export const fetchInternshipCompanies = async () => {
    const res = await fetch(process.env.BACKEND_PATH + '/companies?internship=1' ,{
            headers: {
              'x-api-key':process.env.API_KEY
            }
        });
    const {companies} = await res.json()
    return companies
}
export const fetchErasmusRecords = async () => {
    const res = await fetch(process.env.BACKEND_PATH + '/erasmus', {
        headers: {
            'x-api-key':process.env.API_KEY
        }
    });
    const {data} = await res.json()
    return data
}
export const fetchInternshipRecords = async () => {
    const res = await fetch(process.env.BACKEND_PATH + '/internship', {
        headers: {
            'x-api-key':process.env.API_KEY
        }
    })
    const data = await res.json()
    return data
}
