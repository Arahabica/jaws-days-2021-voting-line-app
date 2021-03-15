import { VerifyAuthChallengeResponseTriggerHandler } from 'aws-lambda';
import axios from 'axios';

const CHANNEL_ID: string = process.env.LINE_CHANNEL_ID || '';
const axiosInstance = axios.create({
    baseURL: 'https://api.line.me',
    responseType: 'json'
});

// 渡されたLINEトークンが正しいものかを検証
const verifyToken = async (accessToken: string, channelId: string): Promise<void> => {
    const params = { access_token: accessToken };
    const response = await axiosInstance.get('/oauth2/v2.1/verify', { params } );
    if (response.status !== 200) {
        console.error(response.data.error_description);
        throw new Error(response.data.error);
    }
    // チャネルIDをチェック
    if (response.data.client_id !== channelId) {
        throw new Error('client_id does not match.');
    }
    //アクセストークンの有効期限
    if (response.data.expires_in < 0) {
        throw new Error('access token is expired.');
    }
};
// アクセストークンを利用してプロフィール取得
const getProfile = async (accessToken: string): Promise<any> => {
    const response = await axiosInstance.get('/v2/profile', {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
        data: {}
    });
    if (response.status !== 200) {
        console.error(response.data.error_description);
        throw new Error(response.data.error);
    }
    return response.data
};

export const handler: VerifyAuthChallengeResponseTriggerHandler = async (event: any) => {
    try {
        console.log(event);
        const accessToken = event.request.challengeAnswer;
        const userId = event.userName;
        // LINEのアクセストークンが正しいか検証
        await verifyToken(accessToken, CHANNEL_ID);
        // アクセストークンを利用してプロフィール取得
        const profile = await getProfile(accessToken);
        console.log(profile, userId);
        event.response.answerCorrect = (profile.userId === userId);
    } catch (e) {
        console.error(e);
        event.response.answerCorrect = false;
    }
    return event;
};
