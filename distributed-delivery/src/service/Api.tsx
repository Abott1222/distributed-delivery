import React from 'react';
import { Interface } from 'readline';
import {Options, APIBandwidthResp} from "../model/api";
import { resolve } from 'dns';

interface state {

}
interface props {}

const baseURL:string = "http://localhost:3000";
const TODAY = new Date().getTime();

export class Api extends React.Component<props, state> {
    constructor(props:any) {
        super(props);
        
    }

    private async callApi(url: string, requestData?: URLSearchParams):Promise<Response> {
        console.log("in call api");
        url = baseURL + url;

        var myHeaders = new Headers();

        let contentType =  "application/x-www-form-urlencoded";
        myHeaders.append("Content-Type", contentType);

        var requestOptions:Options = {
            method: 'POST',
            headers: myHeaders,
        };
        
        if(requestData) {
            requestOptions.body = requestData;
        }

        return await fetch(url, requestOptions)

    }
    

    async fetchData(to?:string, from?:string): Promise<any> {
        let data: APIBandwidthResp;
        let token:any;
        let urlencoded = new URLSearchParams();
        try {
            token = localStorage.getItem("session_token");
          } catch (e) { 
              console.error(e) 
          }
        if(token) {
            urlencoded.append("session_token", token);
            urlencoded.append("from", "0");
            urlencoded.append("to", TODAY.toString());

            const ApiResponse = await this.callApi("/bandwidth", urlencoded)

            const responseJSON = ApiResponse.json();

            return await responseJSON.then((result:any) => 
                {
                    console.log("results \n\n");
                    console.log(result);
                    data = result;
                    try {
                        localStorage.setItem('data', JSON.stringify(data));
                    } catch (e) { 

                        console.error(e) 
                    }
                    return Promise.resolve(data);
                }
            )
            .catch((error:Error) => {
                console.log('error', error)
                return Promise.reject(error);
            });
        }
    }


    async login():Promise<any> {
        let token:any;
    
    
        try {
          token = localStorage.getItem("session_token");
        } catch (e) { 

            console.error(e) 
        }
        if(token) {
            return await Promise.resolve(token);
        }

        let urlencoded = new URLSearchParams();
        urlencoded.append("identifiant", "urtoob");
        urlencoded.append("password", "ToobRU");
 

        const ApiResponse = await this.callApi("/auth", urlencoded)

        const responseJSON = ApiResponse.json();
            
        return await responseJSON.then((result:any) => 
                {
                    token = result.session_token;
                    try {
                        localStorage.setItem('session_token', token.toString());
                    } catch (e) { 
                        console.error(e) 
                    }
                    return Promise.resolve(token);
                }
            )
            .catch((error:Error) => {
                console.log('error', error)
                return Promise.reject(error);
            });
        
            
    }

    //TODO: Logout
}

