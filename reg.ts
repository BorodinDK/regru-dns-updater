import qs from "querystring";
import fetch from 'node-fetch';

const auth = {
  username: process.env.REGRU_USERNAME,
  password: process.env.REGRU_PASSWORD,
};

export const reg = async(path = "/", inputData: object = {}) => {
  const query: any = qs.encode({
    input_data: JSON.stringify({
      ...auth,
      ...inputData
    }),
    input_format: "json",
    output_content_type: "plain"
  })
  const result = await fetch('https://api.reg.ru/api/regru2' + path + '?' + query);
  return result.json();
}