import * as k8s from '@kubernetes/client-node';

export function readContainerProbeFlags(container?: k8s.V1Container): {
  hasLivenessProbe: boolean;
  hasReadinessProbe: boolean;
  hasStartupProbe: boolean;
} {
  return {
    hasLivenessProbe: Boolean(container?.livenessProbe),
    hasReadinessProbe: Boolean(container?.readinessProbe),
    hasStartupProbe: Boolean(container?.startupProbe),
  };
}
