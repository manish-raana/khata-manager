import { format } from 'date-fns'

export const formatDate = (timestamp: string) => {
  const date = new Date(timestamp)

  const formattedDate = format(date, 'dd MMM yyyy hh:mm a')

  return formattedDate
}
