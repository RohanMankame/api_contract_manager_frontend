// SWR configuration

import api from "./connect";

const fetcher = (url) => api.get(url);

export default fetcher;