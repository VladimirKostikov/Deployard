import { describe, expect, it } from 'vitest';
import * as k8s from '@kubernetes/client-node';
import { DeploymentMapper } from './deployment.mapper';

describe('DeploymentMapper', () => {
  const mapper = new DeploymentMapper();

  it('maps deployment summary from V1Deployment', () => {
    const deployment: k8s.V1Deployment = {
      metadata: {
        name: 'demo-api',
        namespace: 'default',
        creationTimestamp: new Date('2026-06-23T12:00:00.000Z'),
        labels: {
          'app.kubernetes.io/part-of': 'demo-shop',
        },
        annotations: {
          'deployment.kubernetes.io/revision': '3',
        },
      },
      spec: {
        replicas: 2,
        template: {
          spec: {
            containers: [{ name: 'api', image: 'nginx:1.27-alpine' }],
          },
        },
      },
      status: {
        readyReplicas: 2,
        availableReplicas: 2,
        updatedReplicas: 2,
      },
    };

    const summary = mapper.toSummary(deployment);

    expect(summary).toEqual({
      name: 'demo-api',
      namespace: 'default',
      replicas: 2,
      readyReplicas: 2,
      availableReplicas: 2,
      updatedReplicas: 2,
      image: 'nginx:1.27-alpine',
      revision: 3,
      createdAt: '2026-06-23T12:00:00.000Z',
      partOf: 'demo-shop',
      changeCause: undefined,
      disabled: false,
      previousReplicas: undefined,
      disabledWithErrors: false,
      hasLivenessProbe: false,
      hasReadinessProbe: false,
      hasStartupProbe: false,
    });
  });

  it('maps probe flags from the primary container', () => {
    const deployment: k8s.V1Deployment = {
      metadata: {
        name: 'demo-api',
        namespace: 'default',
        creationTimestamp: new Date('2026-06-23T12:00:00.000Z'),
      },
      spec: {
        replicas: 1,
        template: {
          spec: {
            containers: [
              {
                name: 'api',
                image: 'nginx:1.27-alpine',
                readinessProbe: { httpGet: { path: '/ready', port: 80 } },
                startupProbe: { tcpSocket: { port: 80 } },
              },
            ],
          },
        },
      },
    };

    expect(mapper.toSummary(deployment)).toMatchObject({
      hasLivenessProbe: false,
      hasReadinessProbe: true,
      hasStartupProbe: true,
    });
  });
});
