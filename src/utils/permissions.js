import { createAccessControl } from "better-auth/plugins/access";
import {
  defaultStatements,
  adminAc,
  userAc,
} from "better-auth/plugins/admin/access";

const statement = {
  ...defaultStatements,
  project: ["create", "update", "delete"],
  user: [
    "create",
    "list",
    "set-role",
    "ban",
    "impersonate",
    "delete",
    "set-password",
  ],
};

export const ac = createAccessControl(statement); //access control

export const user = ac.newRole({
  ...userAc.statements,
  project: ["create", "update", "delete"],
  user: [
    "create",
    "list",
    "set-role",
    "ban",
    "impersonate",
    "delete",
    "set-password",
  ],
});

export const admin = ac.newRole({
  ...adminAc.statements,
  user: [
    "create",
    "list",
    "set-role",
    "ban",
    "impersonate",
    "delete",
    "set-password",
  ],
  project: ["create", "update", "delete"],
});

// Role member (tanpa memberAc)
export const member = ac.newRole({
    project: ["create", "update", "delete"],
    user: [
        "create",
        "list",
        "delete",
        "set-password",
      ],
  });

export const myCustomRole = ac.newRole({
  project: ["create", "update", "delete"],
  user: ["ban"],
  ...adminAc.statements,
});
