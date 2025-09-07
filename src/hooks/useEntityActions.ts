"use client";

import {
  createClass,
  deleteClass,
  toggleClassStatus,
  updateClass,
} from "@/actions/classes";
import {
  createSchool,
  deleteSchool,
  toggleSchoolStatus,
  updateSchool,
} from "@/actions/schools";
import {
  bulkDeleteStudents,
  bulkUpdateStudents,
  createStudent,
  deleteStudent,
  toggleStudentStatus,
  updateStudent,
} from "@/actions/students";
import { optimisticUpdates, useOptimisticAction } from "./useOptimisticAction";
import { useServerAction } from "./useServerAction";

// Base entity types
type BaseEntity = {
  id: string;
  is_active: boolean;
};

type Student = BaseEntity & {
  first_name: string;
  last_name: string;
  email: string;
};

type Class = BaseEntity & {
  name: string;
  level: string;
};

type School = BaseEntity & {
  name: string;
  address: string;
};

// Student actions
export function useStudentActions(initialStudents: Student[] = []) {
  const createAction = useServerAction(createStudent, {
    successMessage: "Élève créé avec succès",
    errorMessage: "Erreur lors de la création de l'élève",
  });

  const updateAction = useServerAction(
    async (params: {
      id: string;
      data: Parameters<typeof updateStudent>[1];
    }) => {
      return updateStudent(params.id, params.data);
    },
    {
      successMessage: "Élève mis à jour avec succès",
      errorMessage: "Erreur lors de la mise à jour de l'élève",
    },
  );

  const deleteAction = useServerAction(deleteStudent, {
    successMessage: "Élève supprimé avec succès",
    errorMessage: "Erreur lors de la suppression de l'élève",
  });

  const toggleStatusAction = useServerAction(
    async (params: { id: string; isActive: boolean }) => {
      const { id, isActive } = params;
      return toggleStudentStatus(id, isActive);
    },
    {
      onSuccess: () => {
        // Invalidate queries here if needed
      },
    },
  );

  const bulkUpdateAction = useServerAction(
    async (params: { ids: string[]; updates: Partial<Student> }) => {
      return bulkUpdateStudents(params.ids, params.updates);
    },
    {
      successMessage: "Élèves mis à jour avec succès",
      errorMessage: "Erreur lors de la mise à jour en lot",
    },
  );

  const bulkDeleteAction = useServerAction(
    async (params: { ids: string[] }) => {
      return bulkDeleteStudents(params.ids);
    },
    {
      successMessage: "Élèves supprimés avec succès",
      errorMessage: "Erreur lors de la suppression en lot",
    },
  );

  // Optimistic actions
  const {
    data: optimisticStudents,
    isPending,
    executeOptimistic,
  } = useOptimisticAction<Student>(initialStudents, {
    optimisticUpdate: (state, update) =>
      optimisticUpdates.update<Student>(
        state,
        update as Parameters<typeof optimisticUpdates.update<Student>>[1],
      ),
    onSuccess: () => {
      // Invalidate queries here if needed
    },
    successMessage: "Opération réussie",
    errorMessage: "Une erreur s'est produite",
    showToast: true,
  });

  return {
    create: createAction,
    update: updateAction,
    delete: deleteAction,
    toggleStatus: toggleStatusAction,
    bulkUpdate: bulkUpdateAction,
    bulkDelete: bulkDeleteAction,
    optimistic: {
      data: optimisticStudents,
      isPending,
      executeOptimistic,
    },
  };
}

export function useClassActions(initialClasses: Class[] = []) {
  const createAction = useServerAction(createClass, {
    successMessage: "Classe créée avec succès",
    errorMessage: "Erreur lors de la création de la classe",
  });

  const updateAction = useServerAction(
    async (params: { id: string; data: Parameters<typeof updateClass>[1] }) => {
      return updateClass(params.id, params.data);
    },
    {
      successMessage: "Classe mise à jour avec succès",
      errorMessage: "Erreur lors de la mise à jour de la classe",
    },
  );

  const deleteAction = useServerAction(deleteClass, {
    successMessage: "Classe supprimée avec succès",
    errorMessage: "Erreur lors de la suppression de la classe",
  });

  const toggleStatusAction = useServerAction(
    async (params: { id: string; isActive: boolean }) => {
      const { id, isActive } = params;
      return toggleClassStatus(id, isActive);
    },
    {
      onSuccess: () => {
        // Invalidate queries here if needed
      },
    },
  );

  // Optimistic actions
  const {
    data: optimisticClasses,
    isPending,
    executeOptimistic,
  } = useOptimisticAction<Class>(initialClasses, {
    optimisticUpdate: (state, update) =>
      optimisticUpdates.update<Class>(
        state,
        update as Parameters<typeof optimisticUpdates.update<Class>>[1],
      ),
    onSuccess: () => {
      // Invalidate queries here if needed
    },
    successMessage: "Opération réussie",
    errorMessage: "Une erreur s'est produite",
    showToast: true,
  });

  return {
    create: createAction,
    update: updateAction,
    delete: deleteAction,
    toggleStatus: toggleStatusAction,
    optimistic: {
      data: optimisticClasses,
      isPending,
      executeOptimistic,
    },
  };
}

// School actions
export function useSchoolActions(initialSchools: School[] = []) {
  const createAction = useServerAction(createSchool, {
    successMessage: "École créée avec succès",
    errorMessage: "Erreur lors de la création de l'école",
  });

  const updateAction = useServerAction(
    async (params: {
      id: string;
      data: Parameters<typeof updateSchool>[1];
    }) => {
      return updateSchool(params.id, params.data);
    },
    {
      successMessage: "École mise à jour avec succès",
      errorMessage: "Erreur lors de la mise à jour de l'école",
    },
  );

  const deleteAction = useServerAction(deleteSchool, {
    successMessage: "École supprimée avec succès",
    errorMessage: "Erreur lors de la suppression de l'école",
  });

  const toggleStatusAction = useServerAction(
    async (params: { id: string; isActive: boolean }) => {
      const { id, isActive } = params;
      return toggleSchoolStatus(id, isActive);
    },
    {
      onSuccess: () => {
        // Invalidate queries here if needed
      },
    },
  );

  // Optimistic actions
  const {
    data: optimisticSchools,
    isPending,
    executeOptimistic,
  } = useOptimisticAction<School>(initialSchools, {
    optimisticUpdate: (state, update) =>
      optimisticUpdates.update<School>(
        state,
        update as Parameters<typeof optimisticUpdates.update<School>>[1],
      ),
    onSuccess: () => {
      // Invalidate queries here if needed
    },
    successMessage: "Opération réussie",
    errorMessage: "Une erreur s'est produite",
    showToast: true,
  });

  return {
    create: createAction,
    update: updateAction,
    delete: deleteAction,
    toggleStatus: toggleStatusAction,
    optimistic: {
      data: optimisticSchools,
      isPending,
      executeOptimistic,
    },
  };
}
