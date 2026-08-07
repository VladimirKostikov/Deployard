import { Link } from 'react-router-dom';
import type { DeploymentSummary } from '@dpd/shared';
import { DeploymentProbeBadges } from './DeploymentProbeBadges';
import { DeploymentRestartIndicator } from './DeploymentRestartIndicator';
import { DeploymentStatusDialog } from './DeploymentStatusDialog';
import { DeploymentTableActions } from './DeploymentTableActions';
import { useDeploymentRestartStore } from './deployment-restart-store';
import { RevisionLabels } from './RevisionLabels';

interface DeploymentTableRowProps {
  deployment: DeploymentSummary;
  nested?: boolean;
  showNamespace?: boolean;
}

export function DeploymentTableRow({
  deployment,
  nested = false,
  showNamespace = false,
}: DeploymentTableRowProps) {
  const { isRestartPending } = useDeploymentRestartStore();
  const restartPending = isRestartPending(deployment.namespace, deployment.name);

  return (
    <tr
      className={`border-t border-border transition-colors hover:bg-canvas ${
        restartPending ? 'bg-warning-soft/40' : ''
      }`}
    >
      <td className={`py-4 ${nested ? 'pl-11 pr-5' : 'px-5'}`}>
        <Link
          to={`/deployments/${deployment.name}?namespace=${encodeURIComponent(deployment.namespace)}`}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          {deployment.name}
        </Link>
      </td>
      {showNamespace ? (
        <td className="px-5 py-4 text-secondary">{deployment.namespace}</td>
      ) : null}
      <td className="px-5 py-4 text-secondary">
        <div className="max-w-[18rem] truncate" title={deployment.image}>
          {deployment.image}
        </div>
      </td>
      <td className="px-5 py-4">
        <DeploymentProbeBadges deployment={deployment} />
      </td>
      <td className="px-5 py-4 text-secondary">
        {deployment.readyReplicas}/{deployment.replicas}
      </td>
      <td className="px-5 py-4 text-secondary">
        <RevisionLabels revision={deployment.revision} changeCause={deployment.changeCause} />
      </td>
      <td className="px-5 py-4">
        <div className="flex flex-col gap-1">
          <DeploymentRestartIndicator deployment={deployment} restartPending={restartPending} />
          {!restartPending ? (
            <DeploymentStatusDialog deployment={deployment} restartPending={false} />
          ) : null}
          {deployment.latestWarning ? (
            <span className="text-xs text-danger" title={deployment.latestWarning.message}>
              {deployment.latestWarning.reason}
            </span>
          ) : null}
        </div>
      </td>
      <td className="px-5 py-4">
        <DeploymentTableActions
          namespace={deployment.namespace}
          name={deployment.name}
          deployment={deployment}
        />
      </td>
    </tr>
  );
}
