import React from 'react';
import { Interface } from 'readline';
import {Options} from "../model/api";
import { resolve } from 'dns';

interface state {

}
interface props {}

const baseURL:string = "http://localhost:3000";

export class Api extends React.Component<props, state> {
    constructor(props:any) {
        super(props);
    }

    private async callApi(url: string, requestData?: URLSearchParams):Promise<Response> {
        console.log("in call api");
        url = baseURL + url;

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var requestOptions:Options = {
            method: 'POST',
            headers: myHeaders,
        };
        
        if(requestData) {
            requestOptions.body = requestData;
        }

        return await fetch(url, requestOptions)
        //.then(response => response.json())

    }


    async login():Promise<any> {
        let token:any;
    
    
        try {
          token = localStorage.getItem("session_token");
        } catch (e) { 
            //alert(JSON.stringify(e));
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
                        //alert(JSON.stringify(e));
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

