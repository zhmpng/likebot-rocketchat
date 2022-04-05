import {
    IHttp,
    IModify,
    IRead,
    IPersistence,
    IHttpRequest,
} from "@rocket.chat/apps-engine/definition/accessors";
import { App } from "@rocket.chat/apps-engine/definition/App";
import { ILike,IModalContext,IRocketEmail,IRocketUser,IRocketUserList,IToken, ILikeRequest
} from '../lib/definition.js';

export async function getRocketUserList(http: IHttp) {

    const requestOptions: IHttpRequest = {};
    requestOptions.headers = {
        'X-Auth-Token': 'CNI4C7HAoadCMI5121uZSMe3bTQEWZkyvo_IMIspmvB',
        'X-User-Id': '2GzhYjroTkMCqTJY7'
      };
    const response = http.get('https://127.0.0.1/api/v1/users.list', requestOptions);

    return (await response.finally()).data as IRocketUserList;
}

export async function getTokenLikeServer(http: IHttp) {

    const authUser = {
        username: 'user',
        password: 'passwd'
    }

    const requestOptions: IHttpRequest = {};
    requestOptions.headers = {
        'Content-Type': 'application/json',
      };
    requestOptions.content = JSON.stringify(authUser);
    const response = http.post('https://127.0.0.1/rocket/token/', requestOptions);

    return (await response.finally()).data as IToken;
}

export async function getReasonLikeServer(http: IHttp, token: string) {

    const requestOptions: IHttpRequest = {};
    requestOptions.headers = {
        'Authorization': `Bearer ${token}`
      };
    const response = http.get('https://127.0.0.1/rocket/api/likes/reasons', requestOptions);

    return (await response.finally()).data as { [key: number] : string; };
}

export async function takeLikeServer(http: IHttp, token: string, like: ILikeRequest) {

    const requestOptions: IHttpRequest = {};
    requestOptions.headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

    requestOptions.content = JSON.stringify(like);
    const response = http.post('https://127.0.0.1/rocket/api/likes/like/', requestOptions);

    return (await response.finally()).data as { [key: string] : string; };
}

export async function getLogLikeServer(http: IHttp, token: string, userId: string) {

    const requestOptions: IHttpRequest = {};
    requestOptions.headers = {
      'Authorization': `Bearer ${token}`
      };
    const response = http.get(`https://127.0.0.1/rocket/api/likes/like_log/?user_id=${userId}`, requestOptions);

    return (await response.finally()).data as { [key: string] : string; };
}

export async function getRemainingLikeServer(http: IHttp, token: string, userId: string) {

    const requestOptions: IHttpRequest = {};
    requestOptions.headers = {
      'Authorization': `Bearer ${token}`
      };
    const response = http.get(`https://127.0.0.1/rocket/api/likes/like_remaining/?user_id=${userId}`, requestOptions);

    return (await response.finally()).data as { [key: string] : string; };
}
