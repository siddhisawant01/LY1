import { QueryClient } from "@tanstack/react-query";
import { createHashHistory, createMemoryHistory, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();
  const basepath = import.meta.env.BASE_URL;
  const history = typeof window === "undefined"
    ? createMemoryHistory({ initialEntries: ["/"] })
    : createHashHistory();

  const router = createRouter({
    routeTree,
    history,
    basepath,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
