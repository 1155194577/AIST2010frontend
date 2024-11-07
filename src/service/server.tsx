import axios from 'axios';
const post = async <TpostData, Tresponse>(
    api: string,
    postData: TpostData
  ) => {
    const apiHost = "http://ec2-18-234-78-89.compute-1.amazonaws.com:5000";
    const res: any = await axios.post(`${apiHost}/${api}`, postData);
    return res as Tresponse;
  };

  export const getQueryResult = async (data) => {
    // example usage : 
    // const data = {
    //     "values": [
    //         1, 2, 3, 4, 5, 6
    //     ],
    //     "top_k": 5,
    //     "include_metadata": true,
    //     "include_values": false
    // };
    const res = await post<any, any>('api/v1/vector/aist2010/embedding/search', data);
    return res;
};