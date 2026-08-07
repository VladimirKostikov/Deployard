import { describe, expect, it } from 'vitest';
import { readContainerProbeFlags } from './deployment-probe-flags';

describe('readContainerProbeFlags', () => {
  it('returns false flags when container is missing', () => {
    expect(readContainerProbeFlags(undefined)).toEqual({
      hasLivenessProbe: false,
      hasReadinessProbe: false,
      hasStartupProbe: false,
    });
  });

  it('detects configured probes', () => {
    expect(
      readContainerProbeFlags({
        name: 'api',
        image: 'nginx:1.27',
        livenessProbe: { httpGet: { path: '/health', port: 80 } },
        readinessProbe: { tcpSocket: { port: 80 } },
      }),
    ).toEqual({
      hasLivenessProbe: true,
      hasReadinessProbe: true,
      hasStartupProbe: false,
    });
  });
});
