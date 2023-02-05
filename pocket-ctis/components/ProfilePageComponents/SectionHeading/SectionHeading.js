const SectionHeading = ({ title }) => {
  return (
    <div
      className='d-flex align-items-center my-2'
      style={{ fontSize: 20, color: '#1F272B' }}
    >
      {title}
      <div
        style={{
          background: 'rgba(245,164,37)',
          background:
            'linear-gradient(90deg, rgba(141,39,41,1) 50%, rgba(255,255,255,1) 100%)',
          display: 'inline',
          height: 4,
          borderRadius: 2,
          overflow: 'hidden',
          width: '100%',
          marginLeft: 10,
        }}
      />
    </div>
  )
}

export default SectionHeading
