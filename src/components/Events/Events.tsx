import { useSnapshot } from "valtio"
import state from "../../state"
import { useProjects } from "../../vercel/apiHooks"
import { Suspense, useMemo, VFC } from "react"
import useEvents from "../../vercel/apiHooks/useEvents"
import {
  Box,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core"
import Project from "../../vercel/models/project"
import LazyLoad from "react-lazyload"
import { DateFormat } from "react-library"

const projectEventsColumns = [
  {
    title: "Project",
    skeletonWidth: 8 * 20,
  },
  {
    title: "Date",
  },
  {
    title: "Log",
  },
]

const SkeletonProjectEvents = () => (
  <TableContainer>
    <Table size="small">
      <TableHead>
        <TableRow>
          {projectEventsColumns.map((column) => (
            <TableCell sx={{ width: column.skeletonWidth }} key={column.title}>
              {column.title}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          {projectEventsColumns.map((column, i) => (
            <TableCell
              component={i === 0 ? "th" : undefined}
              scope={i === 0 ? "row" : undefined}
              key={column.title}
            >
              <Skeleton variant="text" />
            </TableCell>
          ))}
        </TableRow>
      </TableBody>
    </Table>
  </TableContainer>
)

const ProjectEvents: VFC<{
  project: Project
}> = ({ project }) => {
  const deploymentId = project.targets.production.id
  const events = useEvents(deploymentId)

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            {projectEventsColumns.map((column) => (
              <TableCell key={column.title}>{column.title}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.payload?.id}>
              <TableCell component="th" scope="row">
                {project.name}
              </TableCell>
              <TableCell>
                <DateFormat date={event.payload?.date} />
              </TableCell>
              <TableCell>{event.payload?.text}</TableCell>
            </TableRow>
          ))}
          {!events.length && (
            <TableRow>
              <TableCell colSpan={projectEventsColumns.length}>
                <Typography variant="inherit" color="text.secondary">
                  No new logs on this project
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

const Events = () => {
  const { selectedProjects } = useSnapshot(state)
  const { data: projectsData } = useProjects({
    suspense: false,
    enabled: false,
  })

  const projects = useMemo(
    () =>
      projectsData?.projects.filter((p) => selectedProjects.includes(p.id)) ||
      [],
    [projectsData?.projects, selectedProjects]
  )

  return (
    <Box sx={{ py: 2, mx: -2 }}>
      {projects.map((project) => (
        <LazyLoad key={project.id} height={600} unmountIfInvisible>
          <Suspense fallback={<SkeletonProjectEvents />}>
            <ProjectEvents project={project} />
          </Suspense>
        </LazyLoad>
      ))}
      {!selectedProjects.length && (
        <Typography variant="body1" color="text.secondary" align="center">
          Select at least one project
        </Typography>
      )}
    </Box>
  )
}

export default Events
