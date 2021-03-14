// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { CreateAuthChallengeTriggerHandler } from 'aws-lambda';

export const handler: CreateAuthChallengeTriggerHandler = async event => {
    console.log(event);
    event.response.publicChallengeParameters = { email: event.request.userAttributes.email };
    return event;
};
