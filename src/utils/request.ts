import axios from 'axios'

export const request = async (query: any) => {
    return await axios({
        url: process.env.GITHUB_API_ENDPOINT,
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `bearer ${process.env.GITHUB_TOKEN}`
        },
        data: JSON.stringify({ query })
    })
}