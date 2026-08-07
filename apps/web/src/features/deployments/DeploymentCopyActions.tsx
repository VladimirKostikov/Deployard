import { useTranslation } from 'react-i18next';
import type { DeploymentSummary } from '@dpd/shared';
import { CopyButton } from '../../components/ui/CopyButton';
import { usePods } from '../../hooks/kubernetes';
import { buildDeploymentKubectlHint } from './deployment-copy-commands';

interface DeploymentCopyActionsProps {
  deployment: DeploymentSummary;
}

export function DeploymentCopyActions({ deployment }: DeploymentCopyActionsProps) {
  const { t } = useTranslation('deployments');
  const { data: pods } = usePods(deployment.namespace, deployment.name);
  const podName = pods?.[0]?.name ?? '';

  return (
    <div className="flex flex-wrap gap-2">
      <CopyButton
        value={deployment.image}
        label={t('copy.image')}
        copiedLabel={t('copy.copied')}
      />
      <CopyButton
        value={podName}
        label={t('copy.pod')}
        copiedLabel={t('copy.copied')}
        disabled={!podName}
      />
      <CopyButton
        value={buildDeploymentKubectlHint(deployment.namespace, deployment.name)}
        label={t('copy.kubectl')}
        copiedLabel={t('copy.copied')}
      />
    </div>
  );
}
