import { useQuery } from "react-query"
import vercelAxios from "../vercelAxios"
import Project from "../models/project"
import { UseQueryOptions } from "react-query/types/react/types"

const useProjects = <TQueryFnData = unknown,
  TError = unknown,
  TData = { projects: Project[] }>(
  options?: UseQueryOptions<TQueryFnData, TError, TData>
) =>
  useQuery(
    "projects",
    () => vercelAxios.get("/v4/projects/").then((res) => res.data),
    { suspense: true, ...options }
  )

export default useProjects
