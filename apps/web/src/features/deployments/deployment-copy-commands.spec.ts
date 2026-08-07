import { describe, expect, it } from 'vitest';
import { buildDeploymentKubectlHint } from './deployment-copy-commands';

describe('buildDeploymentKubectlHint', () => {
  it('builds a describe command for the deployment', () => {
    expect(buildDeploymentKubectlHint('default', 'demo-api')).toBe(
      'kubectl -n default describe deploy demo-api',
    );
  });
});
