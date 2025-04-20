import axios from "../../api/axios"

export const getVideo = async (id)=> {
    const response = await axios.get(`/api/client/feedback-pdf-video/${id}/`);
    return response.data
}