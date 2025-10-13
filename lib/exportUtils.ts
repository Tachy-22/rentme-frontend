interface WaitlistEntry {
  id: string
  name: string
  email: string
  createdAt: Date | string
  status: string
}

export function exportToCSV(data: WaitlistEntry[], filename: string = 'rentme-waitlist') {
  // CSV headers
  const headers = ['Name', 'Email', 'Status', 'Joined Date']
  
  // Convert data to CSV format
  const csvData = data.map(entry => [
    entry.name,
    entry.email,
    entry.status,
    new Date(entry.createdAt).toLocaleDateString() + ' ' + new Date(entry.createdAt).toLocaleTimeString()
  ])

  // Combine headers and data
  const csvContent = [headers, ...csvData]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n')

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

export function exportToExcel(data: WaitlistEntry[], filename: string = 'rentme-waitlist') {
  // For Excel export, we'll use a more structured CSV format that Excel recognizes better
  const headers = ['Name', 'Email', 'Status', 'Joined Date']
  
  const excelData = data.map(entry => [
    entry.name,
    entry.email,
    entry.status,
    new Date(entry.createdAt).toLocaleDateString() + ' ' + new Date(entry.createdAt).toLocaleTimeString()
  ])

  const csvContent = [headers, ...excelData]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n')

  // Add UTF-8 BOM for proper Excel encoding
  const bom = '\uFEFF'
  const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}.xlsx.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}