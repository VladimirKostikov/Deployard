import type { DeploymentSummary } from '@dpd/shared';

export function filterDeployments(
  deployments: DeploymentSummary[],
  query: string,
): DeploymentSummary[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return deployments;
  }

  return deployments.filter((deployment) => {
    const haystack = [
      deployment.name,
      deployment.namespace,
      deployment.image,
      deployment.partOf ?? '',
      deployment.latestWarning?.reason ?? '',
      deployment.latestWarning?.message ?? '',
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(normalized);
  });
}
