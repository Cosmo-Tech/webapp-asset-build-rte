// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { call, delay, put, select, takeEvery } from 'redux-saga/effects';
import { t } from 'i18next';
import { Api } from '../../../../services/config/Api';
import { DATASET_ACTIONS_KEY, DATASET_TWINGRAPH_QUERIES_RESULTS_ACTIONS } from '../../../commons/DatasetConstants';
import { INGESTION_STATUS, TWINCACHE_STATUS } from '../../../../services/config/ApiConstants';
import { TWINGRAPH_STATUS_POLLING_DELAY } from '../../../../services/config/FunctionalConstants';
import { dispatchSetApplicationErrorMessage } from '../../../dispatchers/app/ApplicationDispatcher';

const getWorkspace = (state) => state.workspace.current?.data;

export function* pollTwingraphStatus(action) {
  let twingraphStatus = INGESTION_STATUS.PENDING;
  const datasetId = action.datasetId;
  const organizationId = action.organizationId;

  try {
    do {
      const { data: newStatus } = yield call(Api.Datasets.getDatasetTwingraphStatus, organizationId, datasetId);
      if ([INGESTION_STATUS.SUCCESS, INGESTION_STATUS.ERROR, INGESTION_STATUS.UNKNOWN].includes(newStatus)) {
        twingraphStatus = newStatus;
        const datasetData = { ingestionStatus: newStatus };
        if (newStatus === INGESTION_STATUS.SUCCESS) datasetData.twincacheStatus = TWINCACHE_STATUS.FULL;
        yield put({
          type: DATASET_ACTIONS_KEY.UPDATE_DATASET,
          datasetId,
          datasetData,
        });

        if (newStatus === INGESTION_STATUS.SUCCESS) {
          const workspace = yield select(getWorkspace);
          yield put({
            type: DATASET_TWINGRAPH_QUERIES_RESULTS_ACTIONS.RESET,
            payload: { datasetId, workspace },
          });
        }
      } else {
        yield delay(TWINGRAPH_STATUS_POLLING_DELAY);
      }
    } while (![INGESTION_STATUS.SUCCESS, INGESTION_STATUS.ERROR, INGESTION_STATUS.UNKNOWN].includes(twingraphStatus));
  } catch (error) {
    console.error(error);
    yield put(
      dispatchSetApplicationErrorMessage(
        error,
        t('commoncomponents.banner.twingraphNotCreated', 'A problem occurred during twingraph creation')
      )
    );
  }
}

function* pollTwingraphStatusSaga() {
  yield takeEvery(DATASET_ACTIONS_KEY.TRIGGER_SAGA_START_TWINGRAPH_STATUS_POLLING, pollTwingraphStatus);
}

export default pollTwingraphStatusSaga;
