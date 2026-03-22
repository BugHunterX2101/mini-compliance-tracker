import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchClientTasks, createTask, updateTaskStatus } from "../lib/api";
import type { CreateTaskInput, UpdateTaskStatusInput, Task } from "@ledgers/shared";

export function useTasks(clientId: string | null) {
  const queryClient = useQueryClient();

  const tasksQuery = useQuery({
    queryKey: ["tasks", clientId],
    queryFn: () => fetchClientTasks(clientId!),
    enabled: !!clientId,
    staleTime: 30_000,
  });

  const addTaskMutation = useMutation({
    mutationFn: (input: CreateTaskInput) => createTask(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", clientId] });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: string }) =>
      updateTaskStatus(taskId, { status } as UpdateTaskStatusInput),
    onMutate: async ({ taskId, status }) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ["tasks", clientId] });
      const previous = queryClient.getQueryData<Task[]>(["tasks", clientId]);
      queryClient.setQueryData<Task[]>(["tasks", clientId], (old) =>
        old?.map((t) => (t.id === taskId ? { ...t, status: status as Task["status"] } : t))
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["tasks", clientId], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", clientId] });
    },
  });

  return { tasksQuery, addTaskMutation, updateStatusMutation };
}
