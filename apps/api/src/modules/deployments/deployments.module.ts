import { Module } from '@nestjs/common';
import { DeploymentsController } from './deployments.controller';
import { DeploymentEventsService } from './deployment-events.service';
import { DeploymentsService } from './deployments.service';

@Module({
  controllers: [DeploymentsController],
  providers: [DeploymentsService, DeploymentEventsService],
  exports: [DeploymentsService],
})
export class DeploymentsModule {}
