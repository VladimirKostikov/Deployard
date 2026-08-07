import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { DeploymentSummary } from '@dpd/shared';
import { ALL_NAMESPACES, AppSection } from '@dpd/shared';
import { ChevronDownIcon } from '../../components/icons/ThemeIcons';
import { useSectionAccess } from '../../auth/use-access';
import { Card } from '../../components/ui/Card';
import { TableScroll } from '../../components/ui/TableScroll';
import { StatusIndicator, type StatusVariant } from '../../components/ui/StatusIndicator';
import {
  countHealthyDeployments,
  groupDeploymentsByProject,
  resolveGroupStatusVariant,
  STANDALONE_PROJECT,
} from './deployment-project-groups';
import { DeploymentTableRow } from './DeploymentTableRow';
import { ProjectGroupRestartBanner } from './ProjectGroupRestartBanner';
import { ProjectGroupTableActions } from './ProjectGroupTableActions';
import {
  useDeploymentRestartStore,
  useSyncDeploymentRestartTracks,
} from './deployment-restart-store';
interface DeploymentGroupedTableProps {
  namespace: string;
  deployments: DeploymentSummary[];
}

export function DeploymentGroupedTable({ namespace, deployments }: DeploymentGroupedTableProps) {
  const { t } = useTranslation('deployments');
  const showAllNamespaces = namespace === ALL_NAMESPACES;
  useSyncDeploymentRestartTracks(deployments);
  const columnCount = showAllNamespaces ? 9 : 8;
  const groups = useMemo(
    () =>
      groupDeploymentsByProject(deployments, t('projectGroups.standalone'), {
        includeNamespace: showAllNamespaces,
      }),
    [deployments, t, showAllNamespaces],
  );
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (key: string) => {
    setCollapsedGroups((current) => {
      const next = new Set(current);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  return (
    <Card className="overflow-hidden" data-testid="deployment-list">
      <TableScroll>
        <table className="w-full min-w-[36rem] text-left text-sm">
        <thead className="border-b border-border bg-canvas text-secondary">
          <tr>
            <th className="px-5 py-3 font-medium">{t('table.name')}</th>
            {showAllNamespaces ? (
              <th className="px-5 py-3 font-medium">{t('table.namespace')}</th>
            ) : null}
            <th className="px-5 py-3 font-medium">{t('table.image')}</th>
            <th className="px-5 py-3 font-medium">{t('table.probes')}</th>
            <th className="px-5 py-3 font-medium">{t('table.replicas')}</th>
            <th className="px-5 py-3 font-medium">{t('table.revision')}</th>
            <th className="px-5 py-3 font-medium">{t('table.status')}</th>
            <th className="px-5 py-3 font-medium">{t('actions.label')}</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((group) => {
            const expanded = !collapsedGroups.has(group.key);
            const healthyCount = countHealthyDeployments(group.deployments);
            const groupVariant = resolveGroupStatusVariant(group.deployments);

            return (
              <ProjectGroupSection
                key={group.key}
                namespace={namespace}
                groupKey={group.key}
                partOf={showAllNamespaces ? group.key.split('/').slice(1).join('/') : group.key}
                showAllNamespaces={showAllNamespaces}
                columnCount={columnCount}
                label={group.label}
                serviceCount={group.deployments.length}
                healthyCount={healthyCount}
                groupVariant={groupVariant}
                expanded={expanded}
                onToggle={() => toggleGroup(group.key)}
                deployments={group.deployments}
              />
            );
          })}
        </tbody>
      </table>
      </TableScroll>
    </Card>
  );
}

interface ProjectGroupSectionProps {
  namespace: string;
  groupKey: string;
  partOf: string;
  showAllNamespaces: boolean;
  columnCount: number;
  label: string;
  serviceCount: number;
  healthyCount: number;
  groupVariant: StatusVariant;
  expanded: boolean;
  onToggle: () => void;
  deployments: DeploymentSummary[];
}

function ProjectGroupSection({
  namespace,
  groupKey,
  partOf,
  showAllNamespaces,
  columnCount,
  label,
  serviceCount,
  healthyCount,
  groupVariant,
  expanded,
  onToggle,
  deployments,
}: ProjectGroupSectionProps) {
  const { t } = useTranslation('deployments');
  const { canOperate, canManage } = useSectionAccess(AppSection.DEPLOYMENTS, namespace);
  const { countRestartPending } = useDeploymentRestartStore();
  const canManageGroup =
    !showAllNamespaces && partOf !== STANDALONE_PROJECT && (canOperate || canManage);
  const restartingCount = countRestartPending(deployments);
  const groupRestarting = restartingCount > 0;

  return (
    <>
      <tr className="border-t border-border bg-elevated/60">
        <td className="px-3 py-3">
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={expanded}
            aria-controls={`deployment-group-${groupKey}`}
            className="flex min-w-0 items-center gap-3 text-left"
          >
            <ChevronDownIcon
              className={`h-4 w-4 shrink-0 text-secondary transition-transform ${
                expanded ? 'rotate-0' : '-rotate-90'
              }`}
            />
            <span className="font-medium text-primary">{label}</span>
            <span className="text-xs text-secondary">
              {t('projectGroups.services', { count: serviceCount })}
            </span>
            <StatusIndicator
              variant={groupRestarting ? 'idle' : groupVariant}
              className="text-xs"
              pulse={groupRestarting}
            >
              <span className="tabular-nums text-secondary">
                {groupRestarting
                  ? t('projectGroups.restarting', {
                      count: restartingCount,
                      total: serviceCount,
                    })
                  : t('projectGroups.health', {
                      healthy: healthyCount,
                      total: serviceCount,
                    })}
              </span>
            </StatusIndicator>
          </button>
        </td>
        {showAllNamespaces ? <td className="px-5 py-3" /> : null}
        <td className="px-5 py-3" />
        <td className="px-5 py-3" />
        <td className="px-5 py-3" />
        <td className="px-5 py-3" />
        <td className="px-5 py-3 align-top">
          {canManageGroup ? (
            <ProjectGroupTableActions
              namespace={namespace}
              partOf={partOf}
              label={label}
              serviceCount={serviceCount}
              deploymentNames={deployments.map((deployment) => deployment.name)}
              deployments={deployments}
            />
          ) : null}
        </td>
      </tr>
      {groupRestarting ? (
        <ProjectGroupRestartBanner
          restartingCount={restartingCount}
          total={serviceCount}
          columnCount={columnCount}
        />
      ) : null}
      {expanded &&
        deployments.map((deployment) => (
          <DeploymentTableRow
            key={`${deployment.namespace}/${deployment.name}`}
            deployment={deployment}
            showNamespace={showAllNamespaces}
            nested
          />
        ))}
    </>
  );
}
