import { useTranslation } from 'react-i18next';
import type { DeploymentSummary } from '@dpd/shared';
import { Badge } from '../../components/ui/Badge';

interface DeploymentProbeBadgesProps {
  deployment: DeploymentSummary;
}

export function DeploymentProbeBadges({ deployment }: DeploymentProbeBadgesProps) {
  const { t } = useTranslation('deployments');
  const probes = [
    deployment.hasLivenessProbe ? t('probes.liveness') : null,
    deployment.hasReadinessProbe ? t('probes.readiness') : null,
    deployment.hasStartupProbe ? t('probes.startup') : null,
  ].filter(Boolean);

  if (probes.length === 0) {
    return <span className="text-xs text-secondary">{t('probes.none')}</span>;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {probes.map((label) => (
        <Badge key={label}>{label}</Badge>
      ))}
    </div>
  );
}
