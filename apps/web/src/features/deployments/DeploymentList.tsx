import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ALL_NAMESPACES } from '@dpd/shared';
import { useDeployments } from '../../hooks/kubernetes';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { DeploymentGroupedTable } from './DeploymentGroupedTable';
import { filterDeployments } from './filter-deployments';

interface DeploymentListProps {
  namespace: string;
}

export function DeploymentList({ namespace }: DeploymentListProps) {
  const { t } = useTranslation('deployments');
  const { data, isLoading, isError } = useDeployments(namespace);
  const [query, setQuery] = useState('');

  const filtered = useMemo(
    () => filterDeployments(data ?? [], query),
    [data, query],
  );

  if (isLoading) {
    return <p className="text-sm text-secondary">{t('loading')}</p>;
  }

  if (isError) {
    return (
      <Card className="border-danger/30 bg-danger-soft p-5 text-sm text-danger">
        {t('error')}
      </Card>
    );
  }

  if (!data?.length) {
    return (
      <Card className="p-8 text-center text-sm text-secondary">
        {namespace === ALL_NAMESPACES ? t('emptyAll') : t('empty')}
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={t('search.placeholder')}
        aria-label={t('search.placeholder')}
        data-testid="deployment-search"
      />

      {!filtered.length ? (
        <Card className="p-8 text-center text-sm text-secondary">{t('search.empty')}</Card>
      ) : (
        <DeploymentGroupedTable namespace={namespace} deployments={filtered} />
      )}
    </div>
  );
}
