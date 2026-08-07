import { Injectable } from '@nestjs/common';
import type { DeploymentEventSummary, DeploymentWarningSummary } from '@dpd/shared';
import * as k8s from '@kubernetes/client-node';

@Injectable()
export class DeploymentEventMapper {
  toSummary(event: k8s.CoreV1Event): DeploymentEventSummary {
    return {
      type: event.type ?? 'Normal',
      reason: event.reason ?? 'Unknown',
      message: event.message ?? '',
      count: event.count ?? 1,
      lastTimestamp: this.resolveTimestamp(event),
      involvedKind: event.involvedObject?.kind ?? '',
      involvedName: event.involvedObject?.name ?? '',
    };
  }

  toWarning(event: k8s.CoreV1Event): DeploymentWarningSummary {
    return {
      reason: event.reason ?? 'Unknown',
      message: event.message ?? '',
      count: event.count ?? 1,
      lastTimestamp: this.resolveTimestamp(event),
    };
  }

  matchesDeployment(event: k8s.CoreV1Event, deploymentName: string): boolean {
    const kind = event.involvedObject?.kind ?? '';
    const name = event.involvedObject?.name ?? '';

    if (kind === 'Deployment' && name === deploymentName) {
      return true;
    }

    if (kind === 'ReplicaSet' && name.startsWith(`${deploymentName}-`)) {
      return true;
    }

    if (kind === 'Pod' && name.startsWith(`${deploymentName}-`)) {
      return true;
    }

    return false;
  }

  pickLatestWarning(
    events: k8s.CoreV1Event[],
    deploymentName: string,
  ): DeploymentWarningSummary | undefined {
    const matched = events
      .filter((event) => (event.type ?? '') === 'Warning')
      .filter((event) => this.matchesDeployment(event, deploymentName))
      .sort((left, right) => this.resolveTimestamp(right).localeCompare(this.resolveTimestamp(left)));

    const latest = matched[0];
    return latest ? this.toWarning(latest) : undefined;
  }

  private resolveTimestamp(event: k8s.CoreV1Event): string {
    return this.toIso(event.lastTimestamp) || this.toIso(event.eventTime) || this.toIso(event.metadata?.creationTimestamp);
  }

  private toIso(value?: Date | string | null): string {
    if (!value) {
      return '';
    }

    if (typeof value === 'string') {
      return value;
    }

    return value.toISOString();
  }
}
