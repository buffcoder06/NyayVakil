import { withAuth, readBody } from "@/lib/server/route";
import { updateTask, deleteTask } from "@/lib/services/tasks";
import { taskUpdateSchema } from "@/lib/validation";

type Params = { id: string };

export const PUT = withAuth<Params>(async ({ req, session, params }) =>
  updateTask(session.firmId, params.id, await readBody(req, taskUpdateSchema))
);

export const DELETE = withAuth<Params>(async ({ session, params }) => {
  await deleteTask(session.firmId, params.id);
});
