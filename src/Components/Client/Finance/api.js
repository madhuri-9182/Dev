import axios from "../../../api/axios";

export const getFinance = async (page)=> {
    const response = await axios.get('/api/client/finance/' , {
        params: {
            limit: 10,
            offset: (page - 1) * 10
        }
    });
    return response.data;
}