import { CreateAuthChallengeTriggerHandler } from 'aws-lambda';

export const handler: CreateAuthChallengeTriggerHandler = async event => {
    console.log(event);
    event.response.publicChallengeParameters = { email: event.request.userAttributes.email };
    return event;
};
