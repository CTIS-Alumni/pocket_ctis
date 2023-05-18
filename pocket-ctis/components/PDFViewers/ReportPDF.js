import ReactPDF, {
  PDFViewer,
  Page,
  Document,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer'
import { useState, useEffect } from 'react'

Font.register({family: 'Inter', fonts: [
  { src: 'https://fonts.gstatic.com/s/opensans/v35/memvYaGs126MiZpBA-UvWbX2vVnXBbObj2OVTSGmu1aB.woff2' }, // regular 400
  { src: 'https://fonts.gstatic.com/s/opensans/v35/memtYaGs126MiZpBA-UFUIcVXSCEkx2cmqvXlWqWt06F15M.woff2', fontStyle: 'italic' }, // italic 400
  { src: 'https://fonts.gstatic.com/s/opensans/v35/memvYaGs126MiZpBA-UvWbX2vVnXBbObj2OVTSGmu1aB.woff2', fontWeight: 500 }, // regular 500
  { src: 'https://fonts.gstatic.com/s/opensans/v35/memtYaGs126MiZpBA-UFUIcVXSCEkx2cmqvXlWqWt06F15M.woff2', fontStyle: 'italic', fontWeight: 500 }, // italic 500
  { src: 'https://fonts.gstatic.com/s/opensans/v35/memvYaGs126MiZpBA-UvWbX2vVnXBbObj2OVTSGmu1aB.woff2', fontWeight: 700 }, // regular 700
  { src: 'https://fonts.gstatic.com/s/opensans/v35/memtYaGs126MiZpBA-UFUIcVXSCEkx2cmqvXlWqWt06F15M.woff2', fontStyle: 'italic', fontWeight: 700 }, // italic 700
  { src: 'https://fonts.gstatic.com/s/opensans/v35/memvYaGs126MiZpBA-UvWbX2vVnXBbObj2OVTSGmu1aB.woff2', fontWeight: 900 }, // regular 900
  { src: 'https://fonts.gstatic.com/s/opensans/v35/memtYaGs126MiZpBA-UFUIcVXSCEkx2cmqvXlWqWt06F15M.woff2', fontStyle: 'italic', fontWeight: 900 }, // italic 900
]});

const styles = StyleSheet.create({
  body: {
    fontFamily: 'Inter',
    fontSize: 13,
    paddingHorizontal: 32,
    paddingVertical: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTop: {
    marginBottom: 16,
  },
  
  
  flex: {
    flexDirection: 'row',
  },
  gapBetween: {
    justifyContent: 'space-between'
  },
  
  midTitle: {
    fontWeight: 500,
  },
  boldTitle: {
    fontSize: 14,
    fontWeight: 700,
  },
  subtitle: {
    fontSize: 11,
  },
  
  
  nameSurname: {
    fontSize: 20,
    fontWeight: 900,
    marginBottom: 2,
  },
  profession: {
    fontSize: 16,
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
    marginRight: 10,
    marginLeft: 12,
  },
  
  
  pageNumber: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 9,
  },
});

const ReportPDF = ({ data }) => {
  return (
    <Document title="@Person's CV" author='@Person' creator='PocketCTIS' language='English'>
      <Page size='A4' style={styles.body}>
        
        // TOP SECTION
        <View style={styles.section} wrap={false}>
          // name surname profession
          <View style={[styles.sectionTop]}>
            <Text style={styles.nameSurname}>Name Surname</Text>
            <Text style={styles.profession}>Profession</Text>
          </View>

          <View style={[styles.flex, styles.gapBetween]}>
            // email phone address
            <View style={[styles.emailPhoneAddress]}>
              // email
              <View style={[styles.flex, styles.gapBetween]}>
                <Text style={[styles.midTitle]}>Email: </Text>
                <Text style={[styles.email]}>emailaddress@addresshere.com</Text>
              </View>
              // phone
              <View style={[styles.flex, styles.gapBetween]}>
                <Text style={[styles.midTitle]}>Phone Number: </Text>
                <Text style={[styles.phone]}>+000 XX XX XX XXX</Text>
              </View>
              // address
              <View style={[styles.flex, styles.gapBetween]}>
                <Text style={[styles.midTitle]}>Address: </Text>
                <Text style={[styles.address]}>abc road abc neighbourhood abc street city countruy</Text>
              </View>
            </View>

            // social media
            <View style={[styles.socialMedia]}>
              // socmed 1
              <View style={[styles.flex, styles.gapBetween]}>
                <Text style={[styles.midTitle]}>Social Media: </Text>
                <Text style={[styles.socmed]}>www.socialmedia.com/person</Text>
              </View>
              // socmed 2
              <View style={[styles.flex, styles.gapBetween]}>
                <Text style={[styles.midTitle]}>Social Media: </Text>
                <Text style={[styles.socmed]}>www.socialmedia.com/person</Text>
              </View>
              // socmed 3
              <View style={[styles.flex, styles.gapBetween]}>
                <Text style={[styles.midTitle]}>Social Media: </Text>
                <Text style={[styles.socmed]}>www.socialmedia.com/person</Text>
              </View>
            </View>
          </View>
        </View>
        
        // CAREER OBJ SECTION
        <View style={styles.section} wrap={false}>
          <View>
            <Text style={[styles.boldTitle]}>Career Objectives</Text>
            // divider
            <Svg height='2' style={styles.hr}>
              <Line x1='0' y1='0' x2='595' y2='0' strokeWidth={1} stroke='black' />
            </Svg>
            // para
            <Text>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </Text>
          </View>
        </View>
        
        // EDUCATION SECTION
        <View style={styles.section} wrap={false}>
          <View>
            <Text style={[styles.boldTitle]}>Education</Text>
            // divider
            <Svg height='2' style={styles.hr}>
              <Line x1='0' y1='0' x2='595' y2='0' strokeWidth={1} stroke='black' />
            </Svg>
          </View>
          
          // edu 1
            <View style={[styles.sectionTop]}>
              <View style={[styles.flex, styles.gapBetween]}>
                <View style={[styles.flex]}>
                  
                  // name of school
                  <Text style={[styles.midTitle]}>ABC University</Text>
                  
                  // grade or cgpa
                  <View style={[styles.flex]}>
                    <Text style={[styles.subtitle]}>CGPA:</Text>
                    <Text style={[styles.subtitle]}>3.45</Text>
                  </View>
                  
                </View>
                // date
                <Text>May 1988 - Ay 1992</Text>
              </View>

              <View style={[styles.flex, styles.gapBetween]}>
                // department
                <Text>B.Sc. in ABC Department</Text>
                
              </View>
            </View>
            
            // edu 2
            <View style={[styles.sectionTop]}>
              <View style={[styles.flex, styles.gapBetween]}>
                // name of school
                <Text style={[styles.midTitle]}>ABC High School</Text>
                // date
                <Text>May 1988 - Ay 1992</Text>
              </View>

              <View style={[styles.flex, styles.gapBetween]}>
                // department
                <Text>B.Sc. in ABC Department</Text>
                // grade or cgpa
                <Text>CGPA: 3.54</Text>
              </View>
            </View>
            
            // edu 3
            <View style={[styles.sectionTop]}>
              <View style={[styles.flex, styles.gapBetween]}>
                // name of school
                <Text style={[styles.midTitle]}>ABC High School</Text>
                // date
                <Text>May 1988 - Ay 1992</Text>
              </View>

              <View>
                // grade or cgpa
                <Text style={[styles.subtitle]}>CGPA: 3.54</Text>
                // department
                <Text>B.Sc. in ABC Department</Text>
              </View>
            </View>
        </View>
        
        
        // CAREER SECTION
        <View style={styles.section} wrap={false}>
          <View>
            <Text style={[styles.boldTitle]}>Experience</Text>
            // divider
            <Svg height='2' style={styles.hr}>
              <Line x1='0' y1='0' x2='595' y2='0' strokeWidth={1} stroke='black' />
            </Svg>
          </View>
          
          <View style={[styles.flex, styles.gapBetween]}>
            <View style={[styles.flex]}>
              // name of company
              <Text style={[styles.midTitle]}>ABC Company</Text>
              // position
              <Text>, Very Good Position</Text>
            </View>
            
            // date
            <Text>May 1988 - Ay 1992</Text>
          </View>
          
          // department
          <Text style={[styles.subtitle, {marginBottom: 8}]}>IT Department</Text>
          

          // job description
          <View>
            // --------------
            <View style={[styles.flex]}>
              <Text style={[styles.bullet]}>•</Text>
              <Text>Lorem ipsum dolor sit amet.</Text>
            </View>
            // --------------
            <View style={[styles.flex]}>
              <Text style={[styles.bullet]}>•</Text>
              <Text>Lorem ipsum dolor sit amet.</Text>
            </View>
            // --------------
            <View style={[styles.flex]}>
              <Text style={[styles.bullet]}>•</Text>
              <Text>Lorem ipsum dolor sit amet.</Text>
            </View>
            // --------------
            <View style={[styles.flex]}>
              <Text style={[styles.bullet]}>•</Text>
              <Text>Lorem ipsum dolor sit amet.</Text>
            </View>
          </View>
          
        </View>
        
        
        // PROJECTS SECTION
        <View style={styles.section} wrap={false}>
          <View>
            <Text style={[styles.boldTitle]}>Projects</Text>
            // divider
            <Svg height='2' style={styles.hr}>
              <Line x1='0' y1='0' x2='595' y2='0' strokeWidth={1} stroke='black' />
            </Svg>
          </View>
          
        </View>
        
        
        // SKILLS SECTION
        <View style={styles.section} wrap={false}>
          <View>
            <Text style={[styles.boldTitle]}>Skills</Text>
            // divider
            <Svg height='2' style={styles.hr}>
              <Line x1='0' y1='0' x2='595' y2='0' strokeWidth={1} stroke='black' />
            </Svg>
          </View>
          
          <View style={[styles.flex, styles.gapBetween, {paddingHorizontal: 40}]}>
            <View>
              // --------------
              <View style={[styles.flex]}>
                <Text style={[styles.bullet]}>•</Text>
                <Text>Lorem ipsum: </Text>
                <Text>4 / 5</Text>
              </View>
              // --------------
              <View style={[styles.flex]}>
                <Text style={[styles.bullet]}>•</Text>
                <Text>Lorem ipsum: </Text>
                <Text>4 / 5</Text>
              </View>
              // --------------
              <View style={[styles.flex]}>
                <Text style={[styles.bullet]}>•</Text>
                <Text>Lorem ipsum: </Text>
                <Text>4 / 5</Text>
              </View>
              // --------------
              <View style={[styles.flex]}>
                <Text style={[styles.bullet]}>•</Text>
                <Text>Lorem ipsum: </Text>
                <Text>4 / 5</Text>
              </View>
            </View>
            
            <View>
              // --------------
              <View style={[styles.flex]}>
                <Text style={[styles.bullet]}>•</Text>
                <Text>Lorem ipsum: </Text>
                <Text>4 / 5</Text>
              </View>
              // --------------
              <View style={[styles.flex]}>
                <Text style={[styles.bullet]}>•</Text>
                <Text>Lorem ipsum: </Text>
                <Text>4 / 5</Text>
              </View>
              // --------------
              <View style={[styles.flex]}>
                <Text style={[styles.bullet]}>•</Text>
                <Text>Lorem ipsum: </Text>
                <Text>4 / 5</Text>
              </View>
              // --------------
              <View style={[styles.flex]}>
                <Text style={[styles.bullet]}>•</Text>
                <Text>Lorem ipsum: </Text>
                <Text>4 / 5</Text>
              </View>
            </View>
          </View>
          
        </View>
        
        // PAGE NUMBER
        <Text style={styles.pageNumber} render={({ pageNumber }) => (
          `${pageNumber}`
        )} fixed />
        
      </Page>
    </Document>
  )
}

const ReportPDFView = ({ data }) => {
  const [client, setClient] = useState(false)

  useEffect(() => {
    setClient(true)
  }, [])

  return (
    <PDFViewer style={{ height: '100vh', width: '100%' }}>
      <ReportPDF data={data} />
    </PDFViewer>
  )
}

export default ReportPDFView
