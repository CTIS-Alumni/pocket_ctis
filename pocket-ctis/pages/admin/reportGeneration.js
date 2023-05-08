import AdminPageContainer from '../../components/AdminPanelComponents/AdminPageContainer/AdminPageContainer'
import { Card } from 'react-bootstrap'
import Link from 'next/link'

const ReportGeneration = () => {
  return (
    <AdminPageContainer>
      <h4>Report Generation</h4>
      <Card border='light' style={{ padding: 20 }}>
        <Link href='/admin/pdfView' target='blank'>
          Create PDF
        </Link>
      </Card>
    </AdminPageContainer>
  )
}

export default ReportGeneration
