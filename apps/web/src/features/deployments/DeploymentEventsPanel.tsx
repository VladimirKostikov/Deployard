import { useTranslation } from 'react-i18next';
import { useDeploymentEvents } from '../../hooks/kubernetes/useDeploymentEvents';
import { Card } from '../../components/ui/Card';

interface DeploymentEventsPanelProps {
  namespace: string;
  name: string;
}

export function DeploymentEventsPanel({ namespace, name }: DeploymentEventsPanelProps) {
  const { t } = useTranslation('deployments');
  const { data, isLoading, isError } = useDeploymentEvents(namespace, name);

  return (
    <Card className="space-y-3 p-4" data-testid="deployment-events">
      <h2 className="text-sm font-medium text-primary">{t('events.title')}</h2>

      {isLoading ? <p className="text-sm text-secondary">{t('events.loading')}</p> : null}
      {isError ? <p className="text-sm text-danger">{t('events.error')}</p> : null}

      {!isLoading && !isError && !data?.length ? (
        <p className="text-sm text-secondary">{t('events.empty')}</p>
      ) : null}

      {data?.length ? (
        <ul className="space-y-2">
          {data.map((event) => (
            <li
              key={`${event.involvedKind}-${event.involvedName}-${event.reason}-${event.lastTimestamp}`}
              className="border border-border bg-canvas px-3 py-2"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span
                  className={
                    event.type === 'Warning' ? 'font-medium text-warning' : 'text-secondary'
                  }
                >
                  {event.type === 'Warning' ? t('events.warning') : event.type}
                </span>
                <span className="font-medium text-primary">{event.reason}</span>
                <span className="text-secondary">
                  {event.involvedKind}/{event.involvedName}
                </span>
                {event.count > 1 ? (
                  <span className="text-secondary">×{event.count}</span>
                ) : null}
              </div>
              <p className="mt-1 text-sm text-secondary">{event.message}</p>
            </li>
          ))}
        </ul>
      ) : null}
    </Card>
  );
}
