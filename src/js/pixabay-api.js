import axios from "axios";

export async function needPhotos(url, key, params) {
    const  {data} = await axios.get(`${url}?key=${key}&${params}`);
    console.log("await data", data)
    return data;
}
