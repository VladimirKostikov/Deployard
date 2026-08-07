import { describe, expect, it } from 'vitest';
import type { DeploymentSummary } from '@dpd/shared';
import { filterDeployments } from './filter-deployments';

function makeDeployment(overrides: Partial<DeploymentSummary>): DeploymentSummary {
  return {
    name: 'demo-api',
    namespace: 'default',
    replicas: 1,
    readyReplicas: 1,
    availableReplicas: 1,
    updatedReplicas: 1,
    image: 'nginx:1.27',
    revision: 1,
    createdAt: '2026-08-07T00:00:00.000Z',
    disabled: false,
    hasLivenessProbe: false,
    hasReadinessProbe: true,
    hasStartupProbe: false,
    ...overrides,
  };
}

describe('filterDeployments', () => {
  const items = [
    makeDeployment({ name: 'demo-api', image: 'nginx:1.27' }),
    makeDeployment({
      name: 'demo-web',
      image: 'demo-web:local',
      latestWarning: {
        reason: 'CrashLoopBackOff',
        message: 'container crashing',
        count: 2,
        lastTimestamp: '2026-08-07T12:00:00.000Z',
      },
    }),
  ];

  it('returns all items for an empty query', () => {
    expect(filterDeployments(items, '  ')).toHaveLength(2);
  });

  it('filters by name and warning reason', () => {
    expect(filterDeployments(items, 'web').map((item) => item.name)).toEqual(['demo-web']);
    expect(filterDeployments(items, 'crash').map((item) => item.name)).toEqual(['demo-web']);
  });
});
