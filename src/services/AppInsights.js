// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { APPLICATION_INSIGHTS_CONFIG } from './config/ApplicationInsights';

class AppInsightsSingleton {
  constructor () {
    if (AppInsightsSingleton._instance) {
      return AppInsightsSingleton._instance;
    }
    AppInsightsSingleton._instance = this;

    this.appInsights = new ApplicationInsights(APPLICATION_INSIGHTS_CONFIG);
    this.appInsights.loadAppInsights();
    this.appInsights.trackPageView();
  }
}

function getInstance () {
  return (new AppInsightsSingleton()).appInsights;
}

export const AppInsights = {
  getInstance: getInstance
};
