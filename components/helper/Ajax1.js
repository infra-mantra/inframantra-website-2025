import axios from "axios";

const Ajax1 = async (action) => {

    try {
      
        const resp = await axios({
            headers: {
                ...(action.token === true && {
                    Authorization: action.token
                })
            },
            method: action.method || "GET",
            url: process.env.apiUrl1 + action.url,
            ...(action.params && { params: action.params }),
            ...(action.data && { data: action.data })
        });

        return resp;

    } catch (err) {
        console.log("API ERROR:", err);
        return err.response;
    }
};

export default Ajax1;