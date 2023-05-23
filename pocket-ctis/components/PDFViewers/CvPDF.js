import ReactPDF, {
  PDFViewer,
  Page,
  Document,
  Text,
  View,
  StyleSheet,
  Svg,
  Line,
  Font
} from '@react-pdf/renderer'
import { useState, useEffect } from 'react'
import { getTimePeriod } from '../../helpers/formatHelpers';
import { monthNames } from '../../helpers/formatHelpers';

Font.register({family: 'Open Sans', fonts: [
  { src: 'https://fonts.gstatic.com/s/opensans/v35/memvYaGs126MiZpBA-UvWbX2vVnXBbObj2OVTSGmu1aB.woff2' }, // regular 400
  { src: 'https://fonts.gstatic.com/s/opensans/v35/memtYaGs126MiZpBA-UFUIcVXSCEkx2cmqvXlWqWt06F15M.woff2', fontStyle: 'italic' }, // italic 400
  { src: 'https://fonts.gstatic.com/s/opensans/v35/memvYaGs126MiZpBA-UvWbX2vVnXBbObj2OVTSGmu1aB.woff2', fontWeight: 500 }, // regular 500
  { src: 'https://fonts.gstatic.com/s/opensans/v35/memtYaGs126MiZpBA-UFUIcVXSCEkx2cmqvXlWqWt06F15M.woff2', fontStyle: 'italic', fontWeight: 500 }, // italic 500
  { src: 'https://fonts.gstatic.com/s/opensans/v35/memvYaGs126MiZpBA-UvWbX2vVnXBbObj2OVTSGmu1aB.woff2', fontWeight: 700 }, // regular 700
  { src: 'https://fonts.gstatic.com/s/opensans/v35/memtYaGs126MiZpBA-UFUIcVXSCEkx2cmqvXlWqWt06F15M.woff2', fontStyle: 'italic', fontWeight: 700 }, // italic 700
  { src: 'https://fonts.gstatic.com/s/opensans/v35/memvYaGs126MiZpBA-UvWbX2vVnXBbObj2OVTSGmu1aB.woff2', fontWeight: 900 }, // regular 900
  { src: 'https://fonts.gstatic.com/s/opensans/v35/memtYaGs126MiZpBA-UFUIcVXSCEkx2cmqvXlWqWt06F15M.woff2', fontStyle: 'italic', fontWeight: 900 }, // italic 900
]});

// VARIABLES
let fontSize = 14

let marginSmall = 4
let marginMedium = 8
let marginLarge = 10
let marginXLarge = 16
let marginXXLarge = 24

let strokeWidth = 2
let length = 600

let mainColour = 'black'
let accentColour = 'black'
let lighterColour = 'grey'

const styles = StyleSheet.create({
  body: {
    fontFamily: 'Open Sans',
    fontSize: fontSize,
    paddingHorizontal: 32,
    paddingVertical: 32,
    color: mainColour,
  },
  section: {
    marginBottom: 15,
  },
  midSection: {
    // marginBottom: marginXLarge,
  },
  hr: {
    marginHorizontal: 0,
  },

  flex: {
    flexDirection: 'row',
  },
  gapBetween: {
    justifyContent: 'space-between',
  },
  alignCenter: {
    alignItems: 'center',
  },

  midTitle: {
    fontWeight: 500,
  },
  boldTitle: {
    fontSize: fontSize + 2,
    fontWeight: 700,
  },
  subtitle: {
    fontSize: fontSize - 2,
    marginLeft: 10
  },

  nameSurname: {
    fontSize: fontSize + 4,
    fontWeight: 900,
    marginBottom: marginSmall,
  },
  profession: {
    fontSize: fontSize + 4,
    fontWeight: 700,
  },

  emailPhoneAddress: {
    width: '42vw',
  },

  socialMedia: {
    width: '42vw',
  },

  address: {
    width: '75%',
    textAlign: 'right',
  },

  bullet: {
    marginRight: marginMedium,
    marginLeft: marginLarge,
  },

  pageNumber: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: fontSize - 5,
    color: lighterColour,
  },


  header: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  headerSubtitle: {
    fontSize: fontSize - 2,
    display: 'flex',
    alignItems: 'flex-end'
  },
  headerSocmed: {
    fontSize: fontSize - 2,
    display: 'flex'
  },
  location: {
    fontSize: fontSize - 2,
    marginLeft: 10
  }
})

const CvPDF = ({data}) => {
  const skillValues=['Beginner', 'Advanced', 'Competent', 'Proficient', 'Expert']

  const classifySkills = (skills) => {
    const classifiedSkill = {}
    skills.forEach((skill) => {
      const skillType = skill.skill_type_name
      if (skillType in classifiedSkill) {
        classifiedSkill[skillType].push(skill)
      } else {
        classifiedSkill[skillType] = [skill]
      }
    })
    return classifiedSkill
  }

  const classifiedSkill = classifySkills(data?.skills || [])
  console.log(data)

  const turkishToEnglish = (value) => {
    return value?.replace('Ğ','G')
        .replace('Ü','U')
        .replace('Ş','S')
        .replace('I','I')
        .replace('İ','I')
        .replace('Ö','O')
        .replace('Ç','C')
        .replace('ğ','g')
 		    .replace('ü','u')
        .replace('ş','s')
        .replace('ı','i')
        .replace('ö','o')
        .replace('ç','c');
  }

  return (
    <Document
      title="@Person's CV"
      author='@Person'
      creator='PocketCTIS'
    >
      <Page size='A4' style={styles.body}>
        {/* // TOP SECTION */}
        <View style={styles.section} wrap={false}>
          {/* // name surname profession */}
          <View style={[styles.header]}>
            <View style={[styles.midSection]}>
              <Text style={styles.nameSurname}>
                {turkishToEnglish(data?.basic_info[0]?.first_name)} {turkishToEnglish(data?.basic_info[0]?.last_name)}
              </Text>
              <View style={[styles.headerSocmed]}>
                  {data?.socials?.length > 0 &&
                    <>
                    {data?.socials?.map((s,idx) => (
                      <View key={idx}>
                        <Text>{s.link}</Text>
                      </View>
                    ))}
                    </>
                  }
              </View>
            </View>
            <View style={[styles.headerSubtitle]}>
              <Text style={[styles.email]}>{data?.emails[0]?.email_address}</Text>
              {
                data?.phone_numbers?.length > 0 && (
                  <Text style={[styles.phone]}>{data?.phone_numbers.map(p => p.phone_number).join(', ')}</Text>
                )
              }
              <Text>
                {data?.location[0]?.city_name && `${data?.location[0]?.city_name} - ` }{data?.location[0]?.country_name}
              </Text>
            </View>
          </View>
        </View>
        {/* // CAREER OBJ SECTION */}
        <View style={styles.section} wrap={false}>
          <View>
            <Text style={[styles.boldTitle]}>Career Objectives</Text>
            {/* // divider */}
            <Svg height='2' style={styles.hr}>
              <Line
                x1='0'
                y1='0'
                x2={`${length}`}
                y2='0'
                strokeWidth={`${strokeWidth}`}
                stroke={`${lighterColour}`}
              />
            </Svg>
            <View style={[styles.midSection]}>
              {/* // para */}
              <Text>
                {turkishToEnglish(data?.career_objective[0]?.career_objective)}
              </Text>
            </View>
          </View>
        </View>
        {/* // EDUCATION SECTION */}
        { data?.edu_records?.length > 0 && <View style={styles.section} wrap={false}>
          <View>
            <Text style={[styles.boldTitle]}>Education</Text>
            {/* // divider */}
            <Svg height='2' style={styles.hr}>
              <Line
                x1='0'
                y1='0'
                x2={`${length}`}
                y2='0'
                strokeWidth={`${strokeWidth}`}
                stroke={`${lighterColour}`}
              />
            </Svg>
          </View>

          {data?.edu_records?.map((edu, idx) => {
            var dates = ''
            
            const sDate = new Date(edu.start_date)
            const eDate = new Date(edu.end_date)
            if (edu.start_date && edu.is_current == 1){
              dates = '' + edu.start_date + ' - present'
            }else if (edu.start_date && edu.end_date){
              dates = '' + monthNames[sDate.getUTCMonth()] + ' ' + sDate.getFullYear() + ' - ' + monthNames[eDate.getUTCMonth()] + ' ' + eDate.getFullYear()
            }else if (edu.start_date){
              dates = 'Started in ' + monthNames[sDate.getUTCMonth()] + ' ' + sDate.getFullYear()
            }else if (edu.end_date){
              dates = 'Ended in ' + monthNames[eDate.getUTCMonth()] + ' ' + eDate.getFullYear()
            }

            return(
              <View style={[styles.midSection, {marginBottom: 7}]}>
                <View style={[styles.flex, styles.gapBetween]}>
                  <View style={[styles.flex, styles.alignCenter]}>
                    {/* // name of school */}
                    <Text style={[styles.midTitle]}>{turkishToEnglish(edu.edu_inst_name)}</Text>
                    {/* // cgpa */}
                    {edu.gpa && <View style={[styles.flex, styles.alignCenter]}>
                      <Text>, CGPA: </Text>
                      <Text>{Math.round(edu.gpa*100)/100}</Text>
                    </View>}
                  </View>
                  <Text>{dates}</Text>
                </View>

                {edu.country_name && <View style={[styles.location]}>
                  <Text>{edu?.city_name && `${edu?.city_name} - `}{edu?.country_name}</Text>
                </View>}

                <View style={[styles.location]}>
                  <Text>{edu?.degree_type_name} {turkishToEnglish(edu?.name_of_program)}</Text>
                </View>
    
                <View style={[styles.location]}>
                  {edu?.education_description && <Text style={[styles.subtitle]}>{turkishToEnglish(edu?.education_description)}</Text>}
                </View>
              </View>
            )
          })}

          {data?.high_school.length > 0 && (
            <View>
              <Text>High School: {data?.high_school[0]?.high_school_name}</Text>
            </View>
          )}
        </View>}
        {/* // CAREER SECTION */}
        <View style={styles.section} wrap={false}>
          <View>
            <Text style={[styles.boldTitle]}>Experience</Text>
            {/* // divider */}
            <Svg height='2' style={styles.hr}>
              <Line
                x1='0'
                y1='0'
                x2={`${length}`}
                y2='0'
                strokeWidth={`${strokeWidth}`}
                stroke={`${lighterColour}`}
              />
            </Svg>
          </View>
          { data?.work_records?.length > 0 && 
            <>
              {data?.work_records.map((w, idx) => {
                var dates = ''
                            
                const sDate = new Date(w.start_date)
                const eDate = new Date(w.end_date)
                if (w.start_date && w.is_current == 1){
                  dates = '' + w.start_date + ' - present'
                }else if (w.start_date && w.end_date){
                  dates = '' + monthNames[sDate.getUTCMonth()] + ' ' + sDate.getFullYear() + ' - ' + monthNames[eDate.getUTCMonth()] + ' ' + eDate.getFullYear()
                }else if (w.start_date){
                  dates = 'Started in ' + monthNames[sDate.getUTCMonth()] + ' ' + sDate.getFullYear()
                }else if (w.end_date){
                  dates = 'Ended in ' + monthNames[eDate.getUTCMonth()] + ' ' + eDate.getFullYear()
                }

                return (
                  <View key={idx} style={[{marginBottom: 7}]}>
                    <View style={[styles.flex, styles.gapBetween]}>
                      <View style={[styles.flex]}>
                        {/* // name of company */}
                        <Text style={[]}>{turkishToEnglish(w.company_name)}</Text>
                        {/* // position */}
                        <Text>{w.position ? `, ${turkishToEnglish(w.position)}` : ''}</Text>
                      </View>
                      {/* // date */}
                      <Text>{dates}</Text>
                    </View>

                    {/* // department */}
                    {w.department && <Text style={[styles.subtitle]}>
                      {turkishToEnglish(w.department)} Department
                    </Text>}
                    {w.country_name && <View style={[styles.location]}>
                      <Text>{w?.city_name && `${w?.city_name} - `}{w?.country_name}</Text>
                    </View>}
                    {/* // job description */}
                    {/* // -------------- */}
                    <View style={[styles.location]}>
                      <Text>
                        {turkishToEnglish(w?.work_description)}
                      </Text>
                    </View>
                  </View>
                )
              })}
            </>
          }
        </View>
        {/* // Internship SECTION */}
        { data?.internships?.length > 0 && 
          <View style={styles.section} wrap={false}>
            <View>
              <Text style={[styles.boldTitle]}>Internships</Text>
              {/* // divider */}
              <Svg height='2' style={styles.hr}>
                <Line
                  x1='0'
                  y1='0'
                  x2={`${length}`}
                  y2='0'
                  strokeWidth={`${strokeWidth}`}
                  stroke={`${lighterColour}`}
                />
              </Svg>
            </View>
            <View>
              {data?.internships?.map((i, idx) => {
                var dates = ''
                            
                const sDate = new Date(i.start_date)
                const eDate = new Date(i.end_date)
                if (i.start_date && i.is_current == 1){
                  dates = '' + i.start_date + ' - present'
                }else if (i.start_date && i.end_date){
                  dates = '' + monthNames[sDate.getUTCMonth()] + ' ' + sDate.getFullYear() + ' - ' + monthNames[eDate.getUTCMonth()] + ' ' + eDate.getFullYear()
                }else if (i.start_date){
                  dates = 'Started in ' + monthNames[sDate.getUTCMonth()] + ' ' + sDate.getFullYear()
                }else if (i.end_date){
                  dates = 'Ended in ' + monthNames[eDate.getUTCMonth()] + ' ' + eDate.getFullYear()
                }

                return (
                  <View key={idx} style={[{marginBottom: 7}]}>
                    <View style={[styles.flex, styles.gapBetween]}>
                      <View style={[styles.flex]}>
                        <Text style={[]}>{turkishToEnglish(i.company_name)}</Text>
                        <Text>{i?.department ? `, ${turkishToEnglish(i?.department)}` : ''}</Text>
                      </View>
                      <Text>{dates}</Text>
                    </View>
                    <View style={[styles.location]}>
                      <Text>
                        {turkishToEnglish(i?.opinion)}
                      </Text>
                    </View>
                  </View>
                )
              })}
            </View>
          </View>
        }
        {/* // PROJECTS SECTION */}
        <View style={styles.section} wrap={false}>
          <View>
            <Text style={[styles.boldTitle]}>Projects</Text>
            {/* // divider */}
            <Svg height='2' style={styles.hr}>
              <Line
                x1='0'
                y1='0'
                x2={`${length}`}
                y2='0'
                strokeWidth={`${strokeWidth}`}
                stroke={`${lighterColour}`}
              />
            </Svg>
          </View>
          <View>
            {/* // -------------- */}
            { data?.graduation_project.length > 0 && (
              <View style={[{marginBottom: 7}]}>
                <View>
                  <Text>
                    {turkishToEnglish(data?.graduation_project[0].product_name)}
                  </Text>
                </View>
                <View style={[styles.location]}>
                  <Text>
                    {turkishToEnglish(data?.graduation_project[0].project_description)}
                  </Text>
                </View> 
              </View>
            ) }

             {data?.projects.length > 0 && (
              <View>
                {data?.projects.map((p, idx) => {
                  return (
                    <>
                      <View style={[{marginBottom: 7}]} >
                        <Text>{turkishToEnglish(p?.project_name)}</Text>
                        { p?.project_description && <Text style={[styles.location]}>{turkishToEnglish(p?.project_description)}</Text>}
                      </View>
                    </>
                  )
                })}
              </View>
            )} 
          </View>
        </View>
        {/* // SKILLS SECTION */}
        {data?.skills.length > 0 && 
          <View style={styles.section} wrap={false}>
            <View>
              <Text style={[styles.boldTitle]}>Skills</Text>
              {/* // divider */}
              <Svg height='2' style={styles.hr}>
                <Line
                  x1='0'
                  y1='0'
                  x2={`${length}`}
                  y2='0'
                  strokeWidth={`${strokeWidth}`}
                  stroke={`${lighterColour}`}
                />
              </Svg>
            </View>

            <View
              style={[styles.flex, styles.gapBetween, { paddingHorizontal: 40 }]}
            >
              <View>
                {/* // -------------- */}
                {Object.keys(classifiedSkill).map((t, idx) => {
                  return (<Text key={idx}>
                    {t}: 
                    {classifiedSkill[t].map((s, idx)=> `${s.skill_name} (${skillValues[s.skill_level-1]})`
                    ).join(', ')}
                  </Text>)
                })}
              </View>
            </View>
          </View>
        }
        {/* EXAMS */}
        {data?.exams.length > 0 && (
          <View style={styles.section}>
            <View>
              <Text style={[styles.boldTitle]}>Exams</Text>
              {/* // divider */}
              <Svg height='2' style={styles.hr}>
                <Line
                  x1='0'
                  y1='0'
                  x2={`${length}`}
                  y2='0'
                  strokeWidth={`${strokeWidth}`}
                  stroke={`${lighterColour}`}
                />
              </Svg>
            </View>
            <View>
              {data?.exams.map((e, idx) => {
                const date = new Date(e.exam_date)
                return (
                  <View style={{marginBottom: 7}} key={idx}>
                    <Text>
                      {turkishToEnglish(e.exam_name)} {e.exam_date && `- ${date.getUTCDate()}`}
                    </Text>
                    <Text style={{marginLeft: 10}}>
                      Score: {e.grade}
                    </Text>
                  </View>
                )
              })}  
            </View>
          </View>
        )}
        {/* Certificates */}
        {data?.certificates?.length > 0 && (
          <View style={styles.section}>
          <View>
            <Text style={[styles.boldTitle]}>Certificates</Text>
            {/* // divider */}
            <Svg height='2' style={styles.hr}>
              <Line
                x1='0'
                y1='0'
                x2={`${length}`}
                y2='0'
                strokeWidth={`${strokeWidth}`}
                stroke={`${lighterColour}`}
              />
            </Svg>
          </View>
          <View>
            {data?.certificates?.map((c, idx) => {
              return (
                <View style={{marginBottom: 7}} key={idx}>
                  <Text>
                    {turkishToEnglish(c.certificate_name)} {c.issuing_authority && `- ${turkishToEnglish(c.issuing_authority)}`}
                  </Text>
                </View>
              )
            })}  
          </View>
        </View>
        )
        }
        {/* // PAGE NUMBER */}
        <Text
          style={styles.pageNumber}
          render={({ pageNumber }) => `${pageNumber}`}
          fixed
        />
      </Page>
    </Document>
  )
}

const CvPDFView = ({ data }) => {
  const [client, setClient] = useState(false)
  useEffect(() => {
    setClient(true)
  }, [])

  return (
    <PDFViewer style={{ height: '100vh', width: '100%' }}>
      <CvPDF data={data} />
    </PDFViewer>
  ) 
}

export default CvPDFView
