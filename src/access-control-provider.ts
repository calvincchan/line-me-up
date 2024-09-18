import { AccessControlProvider } from "@refinedev/core";
import { acl } from "./acl";

export const accessControlProvider: AccessControlProvider = {
  can: async ({ resource, action }) => {
    const role = localStorage.getItem("memberRole") || "";
    const result = await acl.can(role, resource ?? "*", action);
    if (result === true) {
      return { can: true };
    } else {
      return {
        can: false,
        reason: "Your role does not have permission to perform this action.",
      };
    }
  },
  options: {
    queryOptions: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 5, // 5 minutes
    },
  },
};
