import axios from 'axios'

const request = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_WEBCHAT_BASE_URL}`
})

export const post = async (path: string, options = {}) => {
    const response = await request.post(path, options)
    return response.data;
}

export default request; 