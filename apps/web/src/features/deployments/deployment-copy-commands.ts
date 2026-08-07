export function buildDeploymentKubectlHint(namespace: string, name: string): string {
  return `kubectl -n ${namespace} describe deploy ${name}`;
}
