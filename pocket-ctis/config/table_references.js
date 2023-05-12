const table_references = {
    accounttype: {
        references: [],
        referenced: [{table: "useraccounttype", column: "type_id"},]
    },
    city: {
        references: [{table: "country", column: "country_id"}],
        referenced: [
            {table: "educationinstitute", column: "city_id"},
            {table: "highschool", column: "city_id"},
            {table: "userlocation", column: "city_id"},
            {table: "workrecord", column: "city_id"}
        ]
    },
    country: {
        references: [],
        referenced: [
            {table: "workrecord", column: "country_id"},
            {table: "userlocation", column: "country_id"},
            {table: "city", column: "country_id"},
        ]
    },
    company: {
        references: [{table: "sector", column: "sector_id"}],
        referenced: [
            {table: "workrecord", column: "company_id"},
            {table: "internshiprecord", column: "company_id"},
            {table: "graduationproject", column: "company_id"},
        ]
    },
    degreetype: {
        references: [],
        referenced: [{table: "educationrecord", column: "degree_type_id"}]
    },
    educationinstitute: {
        references: [{table: "city", column: "city_id"}],
        referenced: [
            {table: "educationrecord", column: "edu_inst_id"},
            {table: "erasmusrecord", column: "edu_inst_id"},
        ]
    },
    educationrecord: {
        references: [
            {table: "users", column: "user_id"},
            {table: "educationinstitute", column: "edu_inst_id"},
            {table: "degreetype", column: "degree_type_id"},
        ],
        referenced: []
    },
    erasmusrecord: {
        references: [
            {table: "users", column: "user_id"},
            {table: "educationinstitute", column: "edu_inst_id"},
        ],
        referenced: []
    },
    exam: {
        references: [],
        referenced: [{table: "userexam", column: "exam_id"}]
    },
    graduationproject: {
        references: [
            {table: "users", column: "advisor_id"},
            {table: "company", column: "company_id"},
        ],
        referenced: [
            {table: "usergraduationproject", column: "graduation_project_id"},
        ]
    },
    highschool: {
        references: [{table: "city", column: "city_id"}],
        referenced: [
            {table: "userhighschool", column: "high_school_id"},
        ]
    },
    internshiprecord: {
        references: [
            {table: "users", column: "user_id"},
            {table: "company", column: "company_id"},
        ],
        referenced: []
    },
    request: {
        references: [{table: "users", column: "user_id"}],
        referenced: []
    },
    sector: {
        references: [],
        referenced: [
            {table: "company", column: "sector_id"},
            {table: "userwantsector", column: "sector_id"},
        ]
    },
    skill: {
        references: [
            {table: "skilltype", column: "skill_type_id"},
        ],
        referenced: [{table: "userskill", column: "skill_id"},]
    },
    skilltype: {
        references: [],
        referenced: [{table: "skill", column: "skill_type_id"}]
    },
    socialmedia: {
        references: [],
        referenced: [{table: "usersocialmedia", column: "social_media_id"}]
    },
    studentsociety: {
        references: [],
        referenced: [{table: "userstudentsociety", column: "society_id"}]
    },
    useraccounttype: {
        references: [
            {table: "users", column: "user_id"},
            {table: "accounttype", column: "type_id"}
        ],
        referenced: [],
    },
    usercareerobjective: {
        references: [{table: "users", column: "user_id"}],
        referenced: [],
    },
    usercertificate: {
        references: [{table: "users", column: "user_id"}],
        referenced: [],
    },
    useremail: {
        references: [{table: "users", column: "user_id"}],
        referenced: [],
    },
    userexam: {
        references: [
            {table: "users", column: "user_id"},
            {table: "exam", column: "exam_id"},
        ],
        referenced: [],
    },
    usergraduationproject: {
        references: [
            {table: "users", column: "user_id"},
            {table: "graduationproject", column: "graduation_project_id"}],
        referenced: [],
    },
    userhighschool: {
        references: [
            {table: "users", column: "user_id"},
            {table: "highschool", column: "high_school_id"}
        ],
        referenced: [],
    },
    userlocation: {
        references: [
            {table: "users", column: "user_id"},
            {table: "city", column: "city_id"},
            {table: "country", column: "country_id"}
        ],
        referenced: [],
    },
    userlog: {
        references: [{table: "users", column: "user_id"},],
        referenced: [],
    },
    userphone: {
        references: [{table: "users", column: "user_id"}],
        referenced: [],
    },
    userprofilepicture: {
        references: [{table: "users", column: "user_id"}],
        referenced: [],
    },
    userproject: {
        references: [{table: "users", column: "user_id"}],
        referenced: [],
    },
    users: {
        references: [],
        referenced: [
            {table: "workrecord", column: "user_id"},
            {table: "educationrecord", column: "user_id"},
            {table: "internshiprecord", column: "user_id"},
            {table: "erasmusrecord", column: "user_id"},
            {table: "request", column: "user_id"},
            {table: "graduationproject", column: "advisor_id"},
            {table: "useraccounttype", column: "user_id"},
            {table: "usercareerobjective", column: "user_id"},
            {table: "usercertificate", column: "user_id"},
            {table: "useremail", column: "user_id"},
            {table: "userexam", column: "user_id"},
            {table: "usergraduationproject", column: "user_id"},
            {table: "userhighschool", column: "user_id"},
            {table: "userlocation", column: "user_id"},
            {table: "userphone", column: "user_id"},
            {table: "userprofilepicture", column: "user_id"},
            {table: "userproject", column: "user_id"},
            {table: "userskill", column: "user_id"},
            {table: "usersocialmedia", column: "user_id"},
            {table: "userskill", column: "user_id"},
            {table: "userstudentsociety", column: "user_id"},
            {table: "userwantsector", column: "user_id"},
        ]
    },
    userskill: {
        references: [
            {table: "users", column: "user_id"},
            {table: "skill", column: "skill_id"},
        ],
        referenced: [],
    },
    usersocialmedia: {
        references: [
            {table: "users", column: "user_id"},
            {table: "socialmedia", column: "social_media_id"},
        ],
        referenced: [],
    },
    userstudentsociety: {
        references: [
            {table: "users", column: "user_id"},
            {table: "studentsociety", column: "society_id"},
        ],
        referenced: [],
    },
    userwantsector: {
        references: [
            {table: "users", column: "user_id"},
            {table: "sector", column: "sector_id"},
        ],
        referenced: [],
    },
    workrecord: {
        references: [
            {table: "users", column: "user_id"},
            {table: "company", column: "company_id"},
            {table: "city", column: "city_id"},
            {table: "country", column: "country_id"},
            {table: "worktype", column: "work_type_id"},
        ],
        referenced: []
    },
    worktype: {
        references: [],
        referenced: [{table: "workrecord", column: "work_type_id"}]
    }
}

module.exports = table_references