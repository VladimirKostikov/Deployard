import { describe, expect, it } from 'vitest';
import * as k8s from '@kubernetes/client-node';
import { DeploymentEventMapper } from './deployment-event.mapper';

describe('DeploymentEventMapper', () => {
  const mapper = new DeploymentEventMapper();

  it('matches pods and replica sets for a deployment', () => {
    expect(
      mapper.matchesDeployment(
        { involvedObject: { kind: 'Pod', name: 'demo-api-7d9f8c-abcde' } } as k8s.CoreV1Event,
        'demo-api',
      ),
    ).toBe(true);

    expect(
      mapper.matchesDeployment(
        { involvedObject: { kind: 'Deployment', name: 'demo-api' } } as k8s.CoreV1Event,
        'demo-api',
      ),
    ).toBe(true);

    expect(
      mapper.matchesDeployment(
        { involvedObject: { kind: 'Pod', name: 'other-app-abc' } } as k8s.CoreV1Event,
        'demo-api',
      ),
    ).toBe(false);
  });

  it('picks the latest warning for a deployment', () => {
    const events: k8s.CoreV1Event[] = [
      {
        type: 'Warning',
        reason: 'FailedScheduling',
        message: 'old',
        count: 1,
        lastTimestamp: new Date('2026-08-07T10:00:00.000Z'),
        involvedObject: { kind: 'Pod', name: 'demo-api-aaa' },
      },
      {
        type: 'Warning',
        reason: 'CrashLoopBackOff',
        message: 'back-off restarting',
        count: 4,
        lastTimestamp: new Date('2026-08-07T12:00:00.000Z'),
        involvedObject: { kind: 'Pod', name: 'demo-api-bbb' },
      },
      {
        type: 'Normal',
        reason: 'Started',
        message: 'ok',
        lastTimestamp: new Date('2026-08-07T13:00:00.000Z'),
        involvedObject: { kind: 'Pod', name: 'demo-api-ccc' },
      },
    ];

    expect(mapper.pickLatestWarning(events, 'demo-api')).toEqual({
      reason: 'CrashLoopBackOff',
      message: 'back-off restarting',
      count: 4,
      lastTimestamp: '2026-08-07T12:00:00.000Z',
    });
  });
});
