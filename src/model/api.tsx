// export interface PostParam extends URLSearchParams  {
//     session_token: string,
//     from: number,
//     to:number,
// }
// export interface Options {
//     method: string,
//     headers?: Headers,
//     body?: PostParam
// };

export interface Options {
    method: string,
    headers?: Headers;
    body?: URLSearchParams
};

export interface APIBandwidthResp {
    cdn: number[][]
    p2p: number[][]
}