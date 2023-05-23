import departmentConfig from '../config/departmentConfig'
export const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
]

export const getTimePeriod = (start_date, end_date, is_current = false) => {
    const rawStartDate = new Date(start_date)
    const rawEndDate = new Date(end_date)
    const startDate =
        monthNames[rawStartDate.getUTCMonth()] + ' ' + rawStartDate.getFullYear()
    const endDate =
        monthNames[rawEndDate.getUTCMonth()] + ' ' + rawEndDate.getFullYear()

    let months, years

    if (is_current == 1) {
        if (start_date) {
            const now = new Date()
            months = now.getMonth() - rawStartDate.getMonth()
            years = now.getFullYear() - rawStartDate.getFullYear()

            if (months < 0) {
                months += 12
                years -= 1
            }
            if (years < 0) {
                return `Invalid date range`
            }

            return `${startDate} - Present | ${
                years > 0 ? `${years} ${years == 1 ? 'year' : 'yrs'}` : ''
            } ${months == 0 ? '' : months + (months == 1 ? ' month' : ' months')}`
        } else {
            return `Present`
        }
    } else if (start_date && end_date) {
        months = rawEndDate.getMonth() - rawStartDate.getMonth() + 1
        years = rawEndDate.getFullYear() - rawStartDate.getFullYear()

        if (months < 0) {
            months += 12
            years -= 1
        }
        if (years < 0) {
            return `Invalid date range`
        }

        return `${startDate} - ${endDate} | ${
            years > 0 ? ` ${years} ${years == 1 ? 'year' : 'yrs'}` : ''
        } ${months == 0 ? '' : months + (months == 1 ? ' month' : ' months')}`
    } else if (start_date) {
        return `Started at: ${startDate}`
    } else if (end_date) {
        return `Ended at: ${endDate}`
    } else {
        return null
    }
}

export const getSemester = (semester, start_date) => {
    const rawStartDate = new Date(start_date)
    if (start_date) {
        const startYear = rawStartDate.getFullYear()
        return `${semester} - ${startYear}`
    } else {
        return `${semester}`
    }
}

export const getProfilePicturePath = (fileName = null) => {
    if (fileName) {
        return process.env.NEXT_PUBLIC_IMAGES_PATH + "/profilepictures/" + fileName + '.png'
    } else {
        return process.env.NEXT_PUBLIC_IMAGES_PATH + "/profilepictures/defaultuser.png"
    }
}

export const getAppLogoPath = () => {
    if(departmentConfig.app_logo !== "")
        return process.env.NEXT_PUBLIC_IMAGES_PATH + "/departmentpictures/app_logo/" + departmentConfig.app_logo;
    else return false;
}

export const getGraduationProjectPicturePath = (filename = null, teamOrPoster = "team") => {
        if(filename)
            return process.env.NEXT_PUBLIC_IMAGES_PATH + "/graduationprojects/" + teamOrPoster + "/" + filename + '.png';
        else return process.env.NEXT_PUBLIC_IMAGES_PATH + "/graduationprojects/" + teamOrPoster + '/default' +teamOrPoster+'.png';
}


export const getDateString = (date) => {
    if (date) {
        const rawDate = new Date(date)
        let dateString = `${rawDate.getDate()} ${
            monthNames[rawDate.getMonth()]
        } ${rawDate.getFullYear()}`
        return dateString
    } else return null
}

export const reFormatDate = (data) => {
    if(data && data.trim() === "")
        data = null;

    if(data && data.includes("/")){
        const temp = data.split("/");
        if(temp[0].length === 2 && temp[1]?.length === 2 && temp[2]?.length === 4)
            data = temp[2] + "-" + temp[1] + "-" + temp[0]
    }

    return data;
}
