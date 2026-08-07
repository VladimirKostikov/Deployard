import { useQuery } from '@tanstack/react-query';
import { api } from '../../api';

export function useDeploymentEvents(namespace: string, name: string) {
  return useQuery({
    queryKey: ['deployment', namespace, name, 'events'],
    queryFn: () => api.getDeploymentEvents(namespace, name),
    enabled: Boolean(namespace && name),
    refetchInterval: 5_000,
  });
}
