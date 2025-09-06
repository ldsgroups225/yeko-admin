/**
 * Enumeration representing different roles in the system.
 * @enum {number}
 */
export enum ERole {
  /** Represents a parent role */
  PARENT = 1,
  /** Represents a teacher role */
  TEACHER = 2,
  /** Represents a director role */
  DIRECTOR = 3,
  /** Represents a school life supervisor/educator role */
  EDUCATOR = 4,
  /** Represents an accountant role */
  ACCOUNTANT = 5,
  /** Represents a headmaster/principal role */
  HEADMASTER = 6,
  /** Represents a cashier role */
  CASHIER = 7,
  // /** Represents the super admin role */
  SUPER_ADMIN = 8,
}

/**
 * Converts an ERole enum value to its string representation.
 *
 * @param {ERole} role - The role enum value to convert.
 * @returns {string} The string representation of the role.
 * @throws {Error} If an invalid role is provided.
 *
 * @example
 * const roleString = roleToString(ERole.PARENT);
 * console.log(roleString); // Output: 'Parent'
 */
export function roleToString(role: ERole): string {
  const roleMap: { [key in ERole]: string } = {
    [ERole.PARENT]: "Parent",
    [ERole.TEACHER]: "Teacher",
    [ERole.DIRECTOR]: "Director",
    [ERole.CASHIER]: "Cashier",
    [ERole.EDUCATOR]: "Educator",
    [ERole.ACCOUNTANT]: "Accountant",
    [ERole.HEADMASTER]: "Headmaster",
    [ERole.SUPER_ADMIN]: "Super Admin",
  };

  const result = roleMap[role];
  if (!result) {
    throw new Error(`Invalid role: ${role}`);
  }
  return result;
}

/**
 * Converts an ERole enum value to its French string representation.
 *
 * @param {ERole} role - The role enum value to convert.
 * @returns {string} The French string representation of the role.
 * @throws {Error} If an invalid role is provided.
 *
 * @example
 * const roleString = roleToString(ERole.PARENT);
 * console.log(roleString); // Output: 'Parent'
 */
export const roleToFrenchName: Record<ERole, string> = {
  [ERole.DIRECTOR]: "Directeur",
  [ERole.TEACHER]: "Enseignant",
  [ERole.PARENT]: "Parent",
  [ERole.CASHIER]: "Caissier / Caissière",
  [ERole.EDUCATOR]: "Éducateur",
  [ERole.ACCOUNTANT]: "Comptable",
  [ERole.HEADMASTER]: "Proviseur",
  [ERole.SUPER_ADMIN]: "Super Admin",
};

/**
 * Converts a string representation of a role to its corresponding ERole enum value.
 *
 * @param {string} roleString - The string representation of the role.
 * @returns {ERole | undefined} The corresponding ERole enum value, or undefined if no match is found.
 *
 * @example
 * const role = stringToRole('Teacher');
 * if (role !== undefined) {
 *   console.log(role); // Output: 2 (ERole.TEACHER)
 * } else {
 *   console.log('Invalid role string');
 * }
 */
export function stringToRole(roleString: string): ERole | undefined {
  const stringRoleMap: { [key: string]: ERole } = {
    Parent: ERole.PARENT,
    Teacher: ERole.TEACHER,
    Director: ERole.DIRECTOR,
    Cashier: ERole.CASHIER,
    Educator: ERole.EDUCATOR,
    Accountant: ERole.ACCOUNTANT,
    Headmaster: ERole.HEADMASTER,
    "Super Admin": ERole.SUPER_ADMIN,
  };

  return stringRoleMap[roleString];
}
