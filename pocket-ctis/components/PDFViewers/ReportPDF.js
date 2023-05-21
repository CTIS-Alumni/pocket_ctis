import ReactPDF, {
  PDFViewer,
  Page,
  Document,
  Text,
  View,
  StyleSheet,
  Svg,
  Line,
} from '@react-pdf/renderer'
import { useState, useEffect } from 'react'

// Font.register({family: 'Open Sans', fonts: [
//   { src: 'https://fonts.gstatic.com/s/opensans/v35/memvYaGs126MiZpBA-UvWbX2vVnXBbObj2OVTSGmu1aB.woff2' }, // regular 400
//   { src: 'https://fonts.gstatic.com/s/opensans/v35/memtYaGs126MiZpBA-UFUIcVXSCEkx2cmqvXlWqWt06F15M.woff2', fontStyle: 'italic' }, // italic 400
//   { src: 'https://fonts.gstatic.com/s/opensans/v35/memvYaGs126MiZpBA-UvWbX2vVnXBbObj2OVTSGmu1aB.woff2', fontWeight: 500 }, // regular 500
//   { src: 'https://fonts.gstatic.com/s/opensans/v35/memtYaGs126MiZpBA-UFUIcVXSCEkx2cmqvXlWqWt06F15M.woff2', fontStyle: 'italic', fontWeight: 500 }, // italic 500
//   { src: 'https://fonts.gstatic.com/s/opensans/v35/memvYaGs126MiZpBA-UvWbX2vVnXBbObj2OVTSGmu1aB.woff2', fontWeight: 700 }, // regular 700
//   { src: 'https://fonts.gstatic.com/s/opensans/v35/memtYaGs126MiZpBA-UFUIcVXSCEkx2cmqvXlWqWt06F15M.woff2', fontStyle: 'italic', fontWeight: 700 }, // italic 700
//   { src: 'https://fonts.gstatic.com/s/opensans/v35/memvYaGs126MiZpBA-UvWbX2vVnXBbObj2OVTSGmu1aB.woff2', fontWeight: 900 }, // regular 900
//   { src: 'https://fonts.gstatic.com/s/opensans/v35/memtYaGs126MiZpBA-UFUIcVXSCEkx2cmqvXlWqWt06F15M.woff2', fontStyle: 'italic', fontWeight: 900 }, // italic 900
// ]});

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
    // fontFamily: 'Open Sans',
    fontSize: fontSize,
    paddingHorizontal: 32,
    paddingVertical: 32,
    color: mainColour,
  },
  section: {
    marginBottom: marginXXLarge,
  },
  midSection: {
    marginBottom: marginXLarge,
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

  pageNumber: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: fontSize - 5,
    color: lighterColour,
  },
})

const ReportPDF = ({ data }) => {
  return (
    <Document
      title="@Person's CV"
      author='@Person'
      creator='PocketCTIS'
      language='English'
    >
      <Page size='A4' style={styles.body}>
        {/* // TOP SECTION */}
        <View style={styles.section} wrap={false}>
          {/* // name surname profession */}
          <View style={[styles.midSection]}>
            <Text style={styles.nameSurname}>Name Surname</Text>
            <Text style={styles.profession}>Profession</Text>
          </View>
          <View style={[styles.flex, styles.gapBetween]}>
            {/* // email phone address */}
            <View style={[styles.emailPhoneAddress]}>
              {/* // email */}
              <View style={[styles.flex, styles.gapBetween]}>
                <Text style={[styles.midTitle]}>Email: </Text>
                <Text style={[styles.email]}>emailaddress@addresshere.com</Text>
              </View>
              {/* // phone */}
              <View style={[styles.flex, styles.gapBetween]}>
                <Text style={[styles.midTitle]}>Phone Number: </Text>
                <Text style={[styles.phone]}>+000 XX XX XX XXX</Text>
              </View>
              {/* // address */}
              <View style={[styles.flex, styles.gapBetween]}>
                <Text style={[styles.midTitle]}>Address: </Text>
                <Text style={[styles.address]}>
                  abc road abc neighbourhood abc street city countruy
                </Text>
              </View>
            </View>
            {/* // social media */}
            <View style={[styles.socialMedia]}>
              {/* // socmed 1 */}
              <View style={[styles.flex, styles.gapBetween]}>
                <Text style={[styles.midTitle]}>Social Media: </Text>
                <Text style={[styles.socmed]}>www.socialmedia.com/person</Text>
              </View>
              {/* // socmed 2 */}
              <View style={[styles.flex, styles.gapBetween]}>
                <Text style={[styles.midTitle]}>Social Media: </Text>
                <Text style={[styles.socmed]}>www.socialmedia.com/person</Text>
              </View>
              {/* // socmed 3 */}
              <View style={[styles.flex, styles.gapBetween]}>
                <Text style={[styles.midTitle]}>Social Media: </Text>
                <Text style={[styles.socmed]}>www.socialmedia.com/person</Text>
              </View>
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
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </Text>
            </View>
          </View>
        </View>
        {/* // EDUCATION SECTION */}
        <View style={styles.section} wrap={false}>
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
          {/* // edu */}
          <View style={[styles.midSection]}>
            <View style={[styles.flex, styles.gapBetween]}>
              <View style={[styles.flex, styles.alignCenter]}>
                {/* // name of school */}
                <Text style={[styles.midTitle]}>ABC University</Text>
                {/* // cgpa */}
                <View style={[styles.flex, styles.alignCenter]}>
                  <Text>, CGPA: </Text>
                  <Text>3.45</Text>
                </View>
              </View>
              {/* // date */}
              <Text>Month 20XX - Month 20XX</Text>
            </View>

            <View style={[styles.flex, styles.gapBetween]}>
              {/* // department */}
              <Text style={[styles.subtitle]}>Lorem Ipsum Department</Text>
            </View>
          </View>
        </View>
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
          <View style={[styles.flex, styles.gapBetween]}>
            <View style={[styles.flex]}>
              {/* // name of company */}
              <Text style={[styles.midTitle]}>ABC Company</Text>
              {/* // position */}
              <Text>, Very Good Position</Text>
            </View>
            {/* // date */}
            <Text>Month 20XX - Month 20XX</Text>
          </View>
          {/* // department */}
          <Text style={[styles.subtitle, { marginBottom: marginMedium }]}>
            IT Department
          </Text>
          {/* // job description */}
          <View>
            {/* // -------------- */}
            <View style={[styles.flex]}>
              <Text style={[styles.bullet]}>•</Text>
              <Text>Lorem ipsum dolor sit amet.</Text>
            </View>
            {/* // -------------- */}
            <View style={[styles.flex]}>
              <Text style={[styles.bullet]}>•</Text>
              <Text>Lorem ipsum dolor sit amet.</Text>
            </View>
            {/* // -------------- */}
            <View style={[styles.flex]}>
              <Text style={[styles.bullet]}>•</Text>
              <Text>Lorem ipsum dolor sit amet.</Text>
            </View>
            {/* // -------------- */}
            <View style={[styles.flex]}>
              <Text style={[styles.bullet]}>•</Text>
              <Text>Lorem ipsum dolor sit amet.</Text>
            </View>
          </View>
        </View>
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
          {/* // project title */}
          <Text style={[styles.midTitle, { marginBottom: marginSmall }]}>
            {/* Project Title */}
          </Text>
          {/* // project description */}
          <View>
            {/* // -------------- */}
            <View style={[styles.flex]}>
              <Text style={[styles.bullet]}>•</Text>
              <Text>Lorem ipsum dolor sit amet.</Text>
            </View>
            {/* // -------------- */}
            <View style={[styles.flex]}>
              <Text style={[styles.bullet]}>•</Text>
              <Text>Lorem ipsum dolor sit amet.</Text>
            </View>
            {/* // -------------- */}
            <View style={[styles.flex]}>
              <Text style={[styles.bullet]}>•</Text>
              <Text>Lorem ipsum dolor sit amet.</Text>
            </View>
            {/* // -------------- */}
            <View style={[styles.flex]}>
              <Text style={[styles.bullet]}>•</Text>
              <Text>Lorem ipsum dolor sit amet.</Text>
            </View>
          </View>
        </View>
        {/* // SKILLS SECTION */}
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
              <View style={[styles.flex]}>
                <Text style={[styles.bullet]}>•</Text>
                <Text>Lorem ipsum: </Text>
                <Text>4 / 5</Text>
              </View>
              {/* // -------------- */}
              <View style={[styles.flex]}>
                <Text style={[styles.bullet]}>•</Text>
                <Text>Lorem ipsum: </Text>
                <Text>4 / 5</Text>
              </View>
              {/* // -------------- */}
              <View style={[styles.flex]}>
                <Text style={[styles.bullet]}>•</Text>
                <Text>Lorem ipsum: </Text>
                <Text>4 / 5</Text>
              </View>
              {/* // -------------- */}
              <View style={[styles.flex]}>
                <Text style={[styles.bullet]}>•</Text>
                <Text>Lorem ipsum: </Text>
                <Text>4 / 5</Text>
              </View>
            </View>

            <View>
              {/* // -------------- */}
              <View style={[styles.flex]}>
                <Text style={[styles.bullet]}>•</Text>
                <Text>Lorem ipsum: </Text>
                <Text>4 / 5</Text>
              </View>
              {/* // -------------- */}
              <View style={[styles.flex]}>
                <Text style={[styles.bullet]}>•</Text>
                <Text>Lorem ipsum: </Text>
                <Text>4 / 5</Text>
              </View>
              {/* // -------------- */}
              <View style={[styles.flex]}>
                <Text style={[styles.bullet]}>•</Text>
                <Text>Lorem ipsum: </Text>
                <Text>4 / 5</Text>
              </View>
              {/* // -------------- */}
              <View style={[styles.flex]}>
                <Text style={[styles.bullet]}>•</Text>
                <Text>Lorem ipsum: </Text>
                <Text>4 / 5</Text>
              </View>
            </View>
          </View>
        </View>
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
