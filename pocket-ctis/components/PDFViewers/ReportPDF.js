import ReactPDF, {
  PDFViewer,
  Page,
  Document,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer'
import { useState, useEffect } from 'react'

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#999',
  },
})

const ReportPDF = ({ data }) => {
  return (
    <Document>
      <Page size='A4' style={styles.page}>
        <View>
          <Text>{data}</Text>
        </View>
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
