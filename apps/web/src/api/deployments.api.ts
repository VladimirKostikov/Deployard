import type {
  DeleteProjectGroupResult,
  DisableProjectGroupResult,
  RestartProjectGroupResult,
  DeploymentConfigSummary,
  DeploymentEventSummary,
  DeploymentHealthInsight,
  DeploymentRevision,
  DeploymentSummary,
  ImageDefaultsResponse,
} from '@dpd/shared';
import { request } from './http';

export function getDeployments(namespace: string) {
  return request<DeploymentSummary[]>(`/deployments?namespace=${namespace}`);
}

export function getDeployment(namespace: string, name: string) {
  return request<DeploymentSummary>(`/deployments/${name}?namespace=${namespace}`);
}

export function getDeploymentHistory(namespace: string, name: string) {
  return request<DeploymentRevision[]>(`/deployments/${name}/history?namespace=${namespace}`);
}

export function rollbackDeployment(namespace: string, name: string, revision: number) {
  return request<DeploymentSummary>(`/deployments/${name}/rollback?namespace=${namespace}`, {
    method: 'POST',
    body: JSON.stringify({ revision }),
  });
}

export function scaleDeployment(namespace: string, name: string, replicas: number) {
  return request<DeploymentSummary>(`/deployments/${name}/scale?namespace=${namespace}`, {
    method: 'PATCH',
    body: JSON.stringify({ replicas }),
  });
}

export function createDeployment(payload: {
  name: string;
  namespace: string;
  image: string;
  replicas: number;
  containerPort?: number;
  env?: Array<{ name: string; value: string }>;
  partOf?: string;
}) {
  return request<DeploymentSummary>('/deployments', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getImageDefaults(image: string, containerPort?: number) {
  const params = new URLSearchParams({ image });
  if (containerPort) {
    params.set('containerPort', String(containerPort));
  }

  return request<ImageDefaultsResponse>(`/deployments/image-defaults?${params.toString()}`);
}

export function getDeploymentConfig(namespace: string, name: string) {
  return request<DeploymentConfigSummary>(`/deployments/${name}/config?namespace=${namespace}`);
}

export function getDeploymentHealth(namespace: string, name: string) {
  return request<DeploymentHealthInsight>(`/deployments/${name}/health?namespace=${namespace}`);
}

export function getDeploymentEvents(namespace: string, name: string) {
  return request<DeploymentEventSummary[]>(`/deployments/${name}/events?namespace=${namespace}`);
}

export function updateDeploymentConfig(
  namespace: string,
  name: string,
  payload: { env: Array<{ name: string; value: string }> },
) {
  return request<DeploymentConfigSummary>(`/deployments/${name}/config?namespace=${namespace}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function deleteDeployment(namespace: string, name: string) {
  return request<{ ok: true }>(`/deployments/${encodeURIComponent(name)}?namespace=${namespace}`, {
    method: 'DELETE',
  });
}

export function deleteProjectGroup(namespace: string, partOf: string) {
  return request<DeleteProjectGroupResult>(
    `/deployments/project-groups/${encodeURIComponent(partOf)}?namespace=${namespace}`,
    { method: 'DELETE' },
  );
}

export function restartProjectGroup(namespace: string, partOf: string) {
  return request<RestartProjectGroupResult>(
    `/deployments/project-groups/${encodeURIComponent(partOf)}/restart?namespace=${namespace}`,
    { method: 'POST' },
  );
}

export function disableProjectGroup(namespace: string, partOf: string) {
  return request<DisableProjectGroupResult>(
    `/deployments/project-groups/${encodeURIComponent(partOf)}/disable?namespace=${namespace}`,
    { method: 'POST' },
  );
}

export function updateDeploymentImage(namespace: string, name: string, image: string) {
  return request<DeploymentSummary>(`/deployments/${name}/image?namespace=${namespace}`, {
    method: 'PATCH',
    body: JSON.stringify({ image }),
  });
}

export function restartDeployment(namespace: string, name: string) {
  return request<DeploymentSummary>(`/deployments/${name}/restart?namespace=${namespace}`, {
    method: 'POST',
  });
}

export function disableDeployment(namespace: string, name: string) {
  return request<DeploymentSummary>(`/deployments/${name}/disable?namespace=${namespace}`, {
    method: 'POST',
  });
}

export function enableDeployment(namespace: string, name: string) {
  return request<DeploymentSummary>(`/deployments/${name}/enable?namespace=${namespace}`, {
    method: 'POST',
  });
}
