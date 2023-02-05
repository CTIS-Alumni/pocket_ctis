import SectionHeading from '../SectionHeading/SectionHeading'
import { Container } from 'react-bootstrap'

const CertificatesSection = ({ certs }) => {
  return (
    <div>
      <SectionHeading title={'Certificates'} />
      <Container>
        {certs.map((cert, i) => (
          <div key={i}>
            {cert.certificate_name}
            <Container style={{ fontSize: 14, color: '#999' }}>
              Issued by: {cert.issuing_authority}
            </Container>
          </div>
        ))}
      </Container>
    </div>
  )
}

export default CertificatesSection
