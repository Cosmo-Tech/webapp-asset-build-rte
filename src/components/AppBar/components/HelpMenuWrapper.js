// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import { HelpMenu } from '@cosmotech/ui';
import { SUPPORT_URL, DOCUMENTATION_URL } from '../../../config/HelpMenuConfiguration';
import { About } from '../../../services/config/Menu';
import { useTranslation } from 'react-i18next';

export const HelpMenuWrapper = () => {
  const { t } = useTranslation();
  const labels = {
    title: t('genericcomponent.helpmenu.title', 'Help'),
    documentation: t('genericcomponent.helpmenu.documentation', 'Documentation'),
    support: t('genericcomponent.helpmenu.support', 'Contact support'),
    aboutTitle: t('genericcomponent.helpmenu.about', 'About'),
    close: t('genericcomponent.dialog.about.button.close', 'Close'),
  };
  return (
    <HelpMenu
      documentationUrl={DOCUMENTATION_URL}
      supportUrl={SUPPORT_URL}
      about={About ? <About /> : null}
      labels={labels}
    />
  );
};