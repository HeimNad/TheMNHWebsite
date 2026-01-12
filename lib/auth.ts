import { currentUser } from "@clerk/nextjs/server";

/**
 * Get the display name of the current user for audit logging.
 * Should only be called in protected routes (after middleware auth check).
 */
export async function getOperatorName(): Promise<string> {
  const user = await currentUser();
  if (!user) return "Unknown Staff";

  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  if (user.firstName) {
    return user.firstName;
  }
  if (user.username) {
    return user.username;
  }
  return user.emailAddresses[0]?.emailAddress || "Unknown Staff";
}
