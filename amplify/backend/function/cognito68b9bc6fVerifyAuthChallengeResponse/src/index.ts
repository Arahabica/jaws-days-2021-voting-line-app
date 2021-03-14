// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { VerifyAuthChallengeResponseTriggerHandler } from 'aws-lambda';

export const handler: VerifyAuthChallengeResponseTriggerHandler = async event => {
    // const expectedAnswer = event.request.privateChallengeParameters!.secretLoginCode;
    console.log(event.request.challengeAnswer);
    event.response.answerCorrect = true;
    /*
    if (event.request.challengeAnswer === expectedAnswer) {
        event.response.answerCorrect = true;
    } else {
        event.response.answerCorrect = false;
    }
     */
    return event;
};