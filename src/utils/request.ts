import axios from 'axios'

const accessToken = localStorage.getItem('accessToken') || null

const request = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_WEBCHAT_BASE_URL}`
})

export const post = async (path: string, data = {}, config = {}) => {
    const response = await request.post(path, data, config);
    return response.data;
};

export const get = async (
    path: string,
    config = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    }
) => {
    const response = await request.get(path, config)
    return response.data
}

export default request; 