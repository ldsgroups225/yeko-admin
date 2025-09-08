/**
 * Enumeration representing different statuses in the system.
 * @enum {number}
 */
export enum EStatus {
  /** Represents a active status */
  ACTIVE = 1,
  /** Represents a checking status */
  CHECKING = 2,
  /** Represents a suspended status */
  SUSPENDED = 3,
  /** Represents a deleted status */
  DELETED = 4,
}

/**
 * Converts an EStatus enum value to its string representation.
 *
 * @param {EStatus} status - The status enum value to convert.
 * @returns {string} The string representation of the status.
 * @throws {Error} If an invalid status is provided.
 *
 * @example
 * const statusString = statusToString(EStatus.ACTIVE);
 * console.log(statusString); // Output: 'Active'
 */
export function statusToString(status: EStatus): string {
  const statusMap: { [key in EStatus]: string } = {
    [EStatus.ACTIVE]: "Active",
    [EStatus.CHECKING]: "Checking",
    [EStatus.SUSPENDED]: "Suspended",
    [EStatus.DELETED]: "Deleted",
  };

  const result = statusMap[status];
  if (!result) {
    throw new Error(`Invalid status: ${status}`);
  }
  return result;
}

/**
 * Converts an EStatus enum value to its French string representation.
 *
 * @param {EStatus} status - The status enum value to convert.
 * @returns {string} The French string representation of the status.
 * @throws {Error} If an invalid status is provided.
 *
 * @example
 * const statusString = statusToString(EStatus.ACTIVE);
 * console.log(statusString); // Output: 'Active'
 */
export const statusToFrenchName: Record<EStatus, string> = {
  [EStatus.ACTIVE]: "Actif",
  [EStatus.CHECKING]: "En cours de vérification",
  [EStatus.SUSPENDED]: "Suspendu",
  [EStatus.DELETED]: "Supprimé",
};

/**
 * Converts a string representation of a status to its corresponding EStatus enum value.
 *
 * @param {string} statusString - The string representation of the status.
 * @returns {EStatus | undefined} The corresponding EStatus enum value, or undefined if no match is found.
 *
 * @example
 * const status = stringToStatus('Active');
 * if (status !== undefined) {
 *   console.log(status); // Output: 2 (EStatus.ACTIVE)
 * } else {
 *   console.log('Invalid status string');
 * }
 */
export function stringToStatus(statusString: string): EStatus | undefined {
  const stringStatusMap: { [key: string]: EStatus } = {
    Active: EStatus.ACTIVE,
    Checking: EStatus.CHECKING,
    Suspended: EStatus.SUSPENDED,
    Deleted: EStatus.DELETED,
  };

  return stringStatusMap[statusString];
}
