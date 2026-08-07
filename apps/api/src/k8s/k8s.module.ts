import { Global, Module } from '@nestjs/common';
import { K8sService } from './k8s.service';
import { K8sContextStore } from './context/k8s-context.store';
import { K8sClientPool } from './pool/k8s-client.pool';
import { K8sClientFactory } from './factories/k8s-client.factory';
import { KubeConfigLoader } from './loaders/kube-config.loader';
import { DeploymentMapper } from './mappers/deployment.mapper';
import { DeploymentEventMapper } from './mappers/deployment-event.mapper';
import { KubeExceptionMapper } from './mappers/kube-exception.mapper';
import { NamespaceMapper } from './mappers/namespace.mapper';
import { PodMapper } from './mappers/pod.mapper';
import { DeploymentEventsRepository } from './repositories/deployment-events.repository';
import { PodLogsStreamer } from './streamers/pod-logs.streamer';
import { DeploymentsReadRepository } from './repositories/deployments-read.repository';
import { DeploymentsRollbackRepository } from './repositories/deployments-rollback.repository';
import { DeploymentsScaleRepository } from './repositories/deployments-scale.repository';
import { DeploymentsDisableRepository } from './repositories/deployments-disable.repository';
import { DeploymentsCreateRepository } from './repositories/deployments-create.repository';
import { DeploymentsDeleteRepository } from './repositories/deployments-delete.repository';
import { DeploymentsComposeRepository } from './repositories/deployments-compose.repository';
import { SecretsRepository } from './repositories/secrets.repository';
import { PersistentVolumeClaimsRepository } from './repositories/persistent-volume-claims.repository';
import { ServicesComposeRepository } from './repositories/services-compose.repository';
import { DeploymentsHealthRepository } from './repositories/deployments-health.repository';
import { DeploymentsProjectRepository } from './repositories/deployments-project.repository';
import { DeploymentsImageRepository } from './repositories/deployments-image.repository';
import { DeploymentsRestartRepository } from './repositories/deployments-restart.repository';
import { DeploymentsConfigRepository } from './repositories/deployments-config.repository';
import { DeploymentsRepository } from './repositories/deployments.repository';
import { IngressRepository } from './repositories/ingress.repository';
import { NamespacesRepository } from './repositories/namespaces.repository';
import { ServicesRepository } from './repositories/services.repository';
import { EndpointsRepository } from './repositories/endpoints.repository';
import { PodsRepository } from './repositories/pods.repository';
import { DEPLOYMENTS_REPOSITORY } from './interfaces/deployments.repository.interface';
import { INGRESS_REPOSITORY } from './interfaces/ingress.repository.interface';
import { NAMESPACES_REPOSITORY } from './interfaces/namespaces.repository.interface';
import { PODS_REPOSITORY } from './interfaces/pods.repository.interface';
import { IngressMapper } from './mappers/ingress.mapper';
import { ServiceMapper } from './mappers/service.mapper';
import { EndpointMapper } from './mappers/endpoint.mapper';
import { PodExecService } from './streamers/pod-exec.service';
import { PodExecCommandService } from './streamers/pod-exec-command.service';
import { PodFilesService } from './files/pod-files.service';
import { ConfigMapsRepository } from './repositories/configmaps.repository';
import { ClusterAccessService } from './cluster-access.service';
import { ClusterContextInterceptor } from './interceptors/cluster-context.interceptor';
import { NodePortAllocatorService } from './network/node-port-allocator.service';

@Global()
@Module({
  providers: [
    KubeConfigLoader,
    K8sClientFactory,
    K8sContextStore,
    K8sClientPool,
    ClusterAccessService,
    ClusterContextInterceptor,
    K8sService,
    DeploymentMapper,
    DeploymentEventMapper,
    DeploymentEventsRepository,
    PodMapper,
    PodLogsStreamer,
    NamespaceMapper,
    KubeExceptionMapper,
    DeploymentsReadRepository,
    DeploymentsRollbackRepository,
    DeploymentsScaleRepository,
    DeploymentsDisableRepository,
    DeploymentsCreateRepository,
    DeploymentsComposeRepository,
    SecretsRepository,
    PersistentVolumeClaimsRepository,
    ServicesComposeRepository,
    NodePortAllocatorService,
    ConfigMapsRepository,
    DeploymentsDeleteRepository,
    DeploymentsHealthRepository,
    DeploymentsProjectRepository,
    DeploymentsImageRepository,
    DeploymentsRestartRepository,
    DeploymentsConfigRepository,
    DeploymentsRepository,
    IngressRepository,
    IngressMapper,
    ServiceMapper,
    EndpointMapper,
    ServicesRepository,
    EndpointsRepository,
    PodsRepository,
    NamespacesRepository,
    PodExecService,
    PodExecCommandService,
    PodFilesService,
    { provide: DEPLOYMENTS_REPOSITORY, useExisting: DeploymentsRepository },
    { provide: INGRESS_REPOSITORY, useExisting: IngressRepository },
    { provide: PODS_REPOSITORY, useExisting: PodsRepository },
    { provide: NAMESPACES_REPOSITORY, useExisting: NamespacesRepository },
  ],
  exports: [
    K8sService,
    K8sClientPool,
    K8sContextStore,
    ClusterAccessService,
    ClusterContextInterceptor,
    PodLogsStreamer,
    PodExecService,
    PodExecCommandService,
    PodFilesService,
    PodMapper,
    DEPLOYMENTS_REPOSITORY,
    INGRESS_REPOSITORY,
    PODS_REPOSITORY,
    NAMESPACES_REPOSITORY,
    ServicesRepository,
    EndpointsRepository,
    KubeExceptionMapper,
    SecretsRepository,
    PersistentVolumeClaimsRepository,
    DeploymentsComposeRepository,
    DeploymentsConfigRepository,
    DeploymentsHealthRepository,
    DeploymentEventsRepository,
    DeploymentEventMapper,
    ServicesComposeRepository,
    ConfigMapsRepository,
    DeploymentsProjectRepository,
  ],
})
export class K8sModule {}
