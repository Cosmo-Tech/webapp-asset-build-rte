// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  Card,
  Tabs,
  Tab,
  makeStyles
} from '@material-ui/core';
import { SimplePowerBIReportEmbed } from '@cosmotech/ui';
import { DASHBOARDS_LIST_CONFIG } from '../../configs/App.config';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(theme => ({
  root: {
    margin: 'auto',
    width: '100%',
    height: '100%',
    backgroundColor: theme.palette.background.paper
  },
  dashboard: {
    height: '100%'
  }
}));

function a11yProps (index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`
  };
}

const Dashboards = ({ currentScenario, scenarioList, reports }) => {
  const classes = useStyles();
  const { i18n } = useTranslation();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const dashboardTitle = DASHBOARDS_LIST_CONFIG[value].title[i18n.language];

  return (
    <Grid container className={classes.root} direction="row">
      <Grid item sm={2}>
        {/* TODO: I don't know yet how to make a specific style for this card,
        other than using style attribute. Update this whenever knowledge has been acquired. */}
        <Card style={{ padding: '0px', height: '100%', paddingTop: '8px' }}>
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={value}
            onChange={handleChange}
            aria-label="Dashboards list"
            className={classes.tabs}
          >
            {constructDashboardTabs(i18n)}
          </Tabs>
        </Card>
      </Grid>
      <Grid item sm={10}>
        <Card className={classes.dashboard}>
            {
              <TabPanel
                className={classes.dashboard}
                index={value}
                key={dashboardTitle}
                title={dashboardTitle}
                reports={reports}
                scenario={currentScenario}
                scenarioList={scenarioList.data}
                lang={i18n.language}
              />
            }
        </Card>
      </Grid>
    </Grid>
  );
};

Dashboards.propTypes = {
  classes: PropTypes.any,
  currentScenario: PropTypes.object,
  scenarioList: PropTypes.object.isRequired,
  reports: PropTypes.object.isRequired
};

function TabPanel (props) {
  const {
    children,
    index,
    title,
    reports,
    scenario,
    scenarioList,
    lang,
    ...other
  } = props;

  return (
    <div
      role="tabpanel"
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      <SimplePowerBIReportEmbed
          index={index}
          reports={reports}
          reportConfiguration={DASHBOARDS_LIST_CONFIG}
          scenario={scenario}
          scenarioList={scenarioList}
          lang={lang} />
    </div>
  );
}

const constructDashboardTabs = (i18n) => {
  const tabs = [];
  for (const dashboardConf of DASHBOARDS_LIST_CONFIG) {
    const dashboardTitle = dashboardConf.title[i18n.language];
    tabs.push(<Tab key={dashboardTitle} label={dashboardTitle} {...a11yProps(dashboardConf.id)} />);
  }
  return tabs;
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  title: PropTypes.string.isRequired,
  lang: PropTypes.string.isRequired,
  scenarioList: PropTypes.array.isRequired,
  scenario: PropTypes.object.isRequired,
  reports: PropTypes.object.isRequired
};

export default Dashboards;
