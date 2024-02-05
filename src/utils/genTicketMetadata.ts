import axios from 'axios'

export const getTicketMetadata = async (url: string) => {
 return await axios.get(url).then((res) => res.data)
}
