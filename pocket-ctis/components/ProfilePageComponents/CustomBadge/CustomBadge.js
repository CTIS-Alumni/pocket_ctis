const CustomBadge = ({ children }) => {
  return (
    <div
      style={{
        backgroundColor: 'rgba(245,164,37, 0.5)',
        color: 'black',
        fontSize: 16,
        padding: 5,
        borderRadius: 4,
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  )
}

export default CustomBadge
