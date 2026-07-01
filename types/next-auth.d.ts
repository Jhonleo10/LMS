import "next-auth";
import type { Role, Status } from "@/types";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: Role;
      status: Status;
    };
  }

  interface User {
    id: string;
    role: Role;
    status: Status;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    status: Status;
  }
}
