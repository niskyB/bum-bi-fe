import axios from "axios";
import { envVariables } from "main/constants/envVariables";

import * as qs from "qs";

const bumbiServiceClient = axios.create({
  baseURL: `${envVariables.BUMBI_SERVICE_BASE_URL}`,
  withCredentials: true,
  paramsSerializer: {
    serialize: (params) => {
      return qs.stringify(params, { arrayFormat: "repeat", encode: false });
    },
  },
});

export default bumbiServiceClient;
