import vercelAxios from "../vercelAxios"
import { useQuery } from "react-query"
import { UseQueryOptions } from "react-query/types/react/types"

const useEvents = <TData = Event[]>(
  deploymentId?: string,
  options?: UseQueryOptions<unknown, unknown, TData>
) =>
  useQuery(
    ["deployments", deploymentId, "events"],
    () =>
      vercelAxios
        .get(`/v2/now/deployments/${deploymentId}/events`, {
          params: {
            direction: "backward",
            until: Date.now(),
            limit: 20,
          },
        })
        .then((res) => res.data),
    { suspense: true, refetchInterval: 5000, ...options }
  )

export default useEvents
