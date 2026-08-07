import { Injectable } from '@nestjs/common';
import { DeploymentRevision, DeploymentSummary, readDeploymentDisableState } from '@dpd/shared';
import * as k8s from '@kubernetes/client-node';
import { readContainerProbeFlags } from './deployment-probe-flags';

@Injectable()
export class DeploymentMapper {
  toSummary(item: k8s.V1Deployment): DeploymentSummary {
    const container = item.spec?.template?.spec?.containers?.[0];
    const revision = Number(item.metadata?.annotations?.['deployment.kubernetes.io/revision'] ?? 0);
    const { disabled, previousReplicas, disabledWithErrors } = readDeploymentDisableState(
      item.metadata?.annotations,
    );
    const probeFlags = readContainerProbeFlags(container);

    return {
      name: item.metadata?.name ?? '',
      namespace: item.metadata?.namespace ?? '',
      replicas: item.spec?.replicas ?? 0,
      readyReplicas: item.status?.readyReplicas ?? 0,
      availableReplicas: item.status?.availableReplicas ?? 0,
      updatedReplicas: item.status?.updatedReplicas ?? 0,
      image: container?.image ?? '',
      revision,
      createdAt: item.metadata?.creationTimestamp?.toISOString() ?? '',
      partOf: item.metadata?.labels?.['app.kubernetes.io/part-of'],
      changeCause: item.metadata?.annotations?.['kubernetes.io/change-cause'],
      disabled,
      previousReplicas,
      disabledWithErrors,
      ...probeFlags,
    };
  }

  toRevision(item: k8s.V1ReplicaSet): DeploymentRevision {
    const container = item.spec?.template?.spec?.containers?.[0];
    const revision = Number(item.metadata?.annotations?.['deployment.kubernetes.io/revision'] ?? 0);

    return {
      revision,
      replicas: item.spec?.replicas ?? 0,
      image: container?.image ?? '',
      createdAt: item.metadata?.creationTimestamp?.toISOString() ?? '',
      changeCause: item.metadata?.annotations?.['kubernetes.io/change-cause'],
    };
  }

  sortRevisionsDesc(items: k8s.V1ReplicaSet[]): k8s.V1ReplicaSet[] {
    return [...items].sort((left, right) => {
      const leftRevision = Number(
        left.metadata?.annotations?.['deployment.kubernetes.io/revision'] ?? 0,
      );
      const rightRevision = Number(
        right.metadata?.annotations?.['deployment.kubernetes.io/revision'] ?? 0,
      );
      return rightRevision - leftRevision;
    });
  }
}
