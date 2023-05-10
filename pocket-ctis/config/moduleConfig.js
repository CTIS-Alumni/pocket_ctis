const limitPerUser = {
    skills: 3,
    work_records: 3,
    student_societies: 4,
    social_media: 3,
    wanted_sectors: 5,
    projects: 3,
    certificates: 4,
    education_records: 3,
    emails: 2,
    exams: 3,
    phone_numbers: 2,
    internships: 2,
    erasmus: 2,
    graduation_projects: 1,
    junior_projects: 1
}

const modules = {
    graduation_projects: {
        user_visible: true,
    },
    exams: {
        user_visible: true,
        user_add_own: true,
        user_addable: false
    },
    certificates: {
        user_visible: true,
        user_add_own: true
    },
    projects: {
        user_visible: true,
        user_add_own: true
    },
    wanted_sectors: {
        user_visible: true,
        user_add_own: true,
        user_addable: false
    },
    social_media: {
        user_visible: true,
        user_add_own: true
    },
    student_societies: {
        user_visible: true,
        user_add_own: true,
        user_addable: false
    },
    skills: {
        user_visible: true,
        user_add_own: true,
        user_addable: false
    },
    internships: {
        user_visible: true,
        opinions: {
            user_visible: true,
            user_add_own: true
        },
        rating: {
            user_visible: true,
            user_add_own: true
        }
    },
    erasmus: {
        user_visible: true,
        opinions: {
           user_visible: true,
           user_add_own: true
        },
        rating: {
            user_visible: true,
            user_add_own: true
        }
    }
}

module.exports = limitPerUser, modules