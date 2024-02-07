// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button, Grid, Link, Typography } from '@mui/material';
import {
  DATASET_SOURCE_TYPE,
  INGESTION_STATUS,
  TWINCACHE_STATUS,
} from '../../../../../../services/config/ApiConstants';
import { ApiUtils } from '../../../../../../utils';
import { ReuploadFileDatasetButton } from '../../../ReuploadFileDatasetButton';
import { useDatasetOverviewPlaceholder } from './DatasetOverviewPlaceholderHook';

export const DatasetOverviewPlaceholder = () => {
  const { t } = useTranslation();
  const {
    currentDatasetId,
    currentDatasetIngestionStatus,
    currentDatasetTwincacheStatus,
    currentDatasetType,
    refreshDataset,
    rollbackTwingraphData,
  } = useDatasetOverviewPlaceholder();

  const placeholderLabels = useMemo(() => {
    let title = null;
    let subtitle = null;
    let subtitleDataCy = 'dataset-overview-subtitle';
    if (currentDatasetId == null)
      title = t(
        'commoncomponents.datasetmanager.overview.placeholder.noDatasetSelected',
        'No dataset selected. You can select a dataset in the left-side panel.'
      );

    switch (currentDatasetIngestionStatus) {
      case INGESTION_STATUS.SUCCESS:
        title = t('commoncomponents.datasetmanager.overview.placeholder.noKpis.title', 'Your dataset is ready');
        subtitle = t(
          'commoncomponents.datasetmanager.overview.placeholder.noKpis.subtitle',
          'You can use it to create new scenarios'
        );
        break;
      case INGESTION_STATUS.PENDING:
        title = t(
          'commoncomponents.datasetmanager.overview.placeholder.loading',
          'Importing your data, please wait...'
        );
        break;
      case INGESTION_STATUS.NONE:
        subtitleDataCy = 'dataset-overview-api-link';
        title = t('commoncomponents.datasetmanager.overview.placeholder.empty', 'Your dataset is empty');
        subtitle = (
          // This component uses node count to implement a link in the translation string,
          // if the string is modified, need to check that the link is still the node N1
          <Trans i18nKey="commoncomponents.datasetmanager.overview.placeholder.apiLink">
            You can use the
            <Link href={ApiUtils.getDatasetTwingraphSwaggerSection()} color="inherit" target="blank">
              Cosmo Tech API
            </Link>
            to populate it
          </Trans>
        );
        break;
      case INGESTION_STATUS.ERROR:
        title = t(
          'commoncomponents.datasetmanager.overview.placeholder.error',
          'An error occurred during import of your data'
        );
        break;
      case INGESTION_STATUS.UNKNOWN:
      default:
        title = t(
          'commoncomponents.datasetmanager.overview.placeholder.unknown',
          'The dataset has an unknown state, if the problem persists, please, contact your administrator'
        );
    }

    return {
      title: (
        <Typography data-cy="dataset-overview-title" variant="h5" align="center">
          {title}
        </Typography>
      ),
      subtitle: subtitle ? (
        <Typography data-cy={subtitleDataCy} variant="body1" color="appbar.contrastTextSoft">
          {subtitle}
        </Typography>
      ) : null,
    };
  }, [currentDatasetId, currentDatasetIngestionStatus, t]);

  const buttonRow = useMemo(() => {
    if (
      currentDatasetId == null ||
      !currentDatasetIngestionStatus ||
      ![INGESTION_STATUS.ERROR, INGESTION_STATUS.UNKNOWN].includes(currentDatasetIngestionStatus)
    )
      return null;

    return currentDatasetType === DATASET_SOURCE_TYPE.LOCAL_FILE ? (
      <ReuploadFileDatasetButton datasetId={currentDatasetId} iconButton={false} />
    ) : (
      <>
        <Button
          data-cy="dataset-overview-retry-button"
          variant="contained"
          onClick={() => refreshDataset(currentDatasetId)}
        >
          {t('commoncomponents.datasetmanager.overview.placeholder.retryButton', 'Retry')}
        </Button>
        {currentDatasetTwincacheStatus === TWINCACHE_STATUS.FULL && (
          <Button
            data-cy="dataset-overview-rollback-button"
            variant="contained"
            onClick={() => rollbackTwingraphData(currentDatasetId)}
            sx={{ ml: 1 }}
          >
            {t('commoncomponents.datasetmanager.overview.placeholder.rollbackButton', 'Rollback')}
          </Button>
        )}
      </>
    );
  }, [
    currentDatasetId,
    currentDatasetIngestionStatus,
    refreshDataset,
    rollbackTwingraphData,
    currentDatasetTwincacheStatus,
    currentDatasetType,
    t,
  ]);

  return (
    <Grid
      data-cy="dataset-overview-placeholder"
      container
      direction="column"
      sx={{
        justifyContent: 'center',
        alignItems: 'center',
        gap: buttonRow != null ? 4 : 2,
        height: '100%',
        width: 'fill-available',
      }}
    >
      <Grid item>{placeholderLabels.title}</Grid>
      {buttonRow && <Grid item>{buttonRow}</Grid>}
      {placeholderLabels.subtitle && <Grid item>{placeholderLabels.subtitle}</Grid>}
    </Grid>
  );
};
