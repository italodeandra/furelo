import { Autocomplete, Box, Grid, Skeleton, Tooltip } from "@material-ui/core"
import { TextField } from "react-library"
import { useProjects } from "../../vercel/apiHooks"
import { forwardRef, Suspense } from "react"
import { useSnapshot } from "valtio"
import state from "../../state"
import { useMount } from "react-use"
import ErrorBoundary from "../../utils/ErrorBoundary"
import { InlineIcon } from "@iconify/react"
import exclamationIcon from "@iconify/icons-heroicons-outline/exclamation"

const ProjectsFilter = () => {
  const { selectedProjects, setSelectedProjects } = useSnapshot(state)
  const {
    data: { projects },
  } = useProjects()

  useMount(() => {
    if (!selectedProjects.length) {
      setSelectedProjects(projects.map((p) => p.id))
    }
  })

  return (
    <>
      <Autocomplete
        multiple
        options={projects}
        getOptionLabel={(option) => option.name}
        getOptionSelected={(option, value) => option.id === value.id}
        value={projects.filter((p) => selectedProjects.includes(p.id))}
        renderInput={(params) => (
          <TextField
            {...params}
            label={`Projects (${selectedProjects.length}/${projects.length})`}
            placeholder="Select a project"
          />
        )}
        onChange={(event, value) =>
          setSelectedProjects(
            value.map((p) => (typeof p === "string" ? p : p.id))
          )
        }
      />
      2
    </>
  )
}

const LoadingFilter = () => (
  <TextField
    disabled
    label={<Skeleton variant="text" width={10 * 8} />}
    InputProps={{
      inputComponent: forwardRef(() => (
        <Box sx={{ p: "9px" }}>
          <Skeleton
            variant="rectangular"
            width={16 * 8}
            height={32}
            sx={{ m: "3px", borderRadius: 16 }}
          />
        </Box>
      )),
    }}
  />
)

const Filters = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} lg={6}>
        <ErrorBoundary
          fallback={
            <Tooltip title="There was an unexpected error while trying to get the list of projects">
              <span>
                <InlineIcon icon={exclamationIcon} />
              </span>
            </Tooltip>
          }
        >
          <Suspense fallback={<LoadingFilter />}>
            <ProjectsFilter />
          </Suspense>
        </ErrorBoundary>
      </Grid>
    </Grid>
  )
}

export default Filters
