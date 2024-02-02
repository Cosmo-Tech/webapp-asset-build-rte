// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, Grid } from '@mui/material';
import { useDatasetOverview } from './DatasetOverviewHook';
import { CategoryAccordion, DatasetOverviewPlaceholder, GraphIndicator } from './components';
import { INGESTION_STATUS } from '../../../../services/config/ApiConstants';

export const DatasetOverview = () => {
  const { categories, graphIndicators, queriesResults, datasetIngestionStatus, datasetName } = useDatasetOverview();

  const graphIndicatorsElements = useMemo(() => {
    return graphIndicators.map((kpi) => {
      const result = queriesResults?.graphIndicators?.find((kpiResult) => kpiResult.id === kpi.id);
      return <GraphIndicator key={kpi.id} id={kpi.id} kpi={result}></GraphIndicator>;
    });
  }, [graphIndicators, queriesResults]);

  return (
    <Card
      elevation={0}
      sx={{ p: 1, width: '100%', height: '100%', overflow: 'auto', backgroundColor: 'transparent' }}
      data-cy="dataset-overview-card"
    >
      <CardHeader data-cy="dataset-name" title={datasetName} sx={{ height: '65px' }}></CardHeader>
      <CardContent sx={{ height: 'calc(100% - 65px)' }}>
        {datasetIngestionStatus === INGESTION_STATUS.SUCCESS ? (
          <Grid container sx={{ flexFlow: 'column wrap', gap: 4 }}>
            <Grid item>
              <Grid container sx={{ flexFlow: 'row wrap', alignItems: 'stretch', justifyContent: 'center', gap: 4 }}>
                {graphIndicatorsElements}
              </Grid>
            </Grid>
            <Grid item>
              {categories.map((category) => (
                <CategoryAccordion key={category.id} category={category} queriesResults={queriesResults} />
              ))}
            </Grid>
          </Grid>
        ) : (
          <DatasetOverviewPlaceholder />
        )}
      </CardContent>
    </Card>
  );
};
