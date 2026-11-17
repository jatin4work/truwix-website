import { queryOptions } from "@tanstack/react-query";
import { listPosts } from "./site.functions";
export const postsQuery = queryOptions({ queryKey: ["posts"], queryFn: () => listPosts(), staleTime: 60000 });