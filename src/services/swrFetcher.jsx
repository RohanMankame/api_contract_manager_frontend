
import api from "./connect";


const fetcher = (url) => api.get(url).then((res) => res.data?.data ?? res.data);

export default fetcher;