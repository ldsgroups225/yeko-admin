import { z } from "zod";

enum SchoolStateEnum {
  ACTIVE = 1,
  SUSPENDED = 3,
}

// Base schemas
// School Status Enum (from DB)
export const schoolStatusEnum = z.enum(["private", "public"]);
export const schoolStateEnum = z.enum([
  SchoolStateEnum.ACTIVE.toString(),
  SchoolStateEnum.SUSPENDED.toString(),
]);
export const uuidSchema = z.uuid();
export const stringSchema = z.string().trim();
export const emailSchema = z.email().trim().toLowerCase();
export const urlSchema = z.url().trim();
export const phoneSchema = z
  .string()
  .regex(/^[+]?[\d\s\-()]+$/, "Format de téléphone invalide");
// User schemas
export const createUserSchema = z.object({
  email: emailSchema,
  first_name: z
    .string()
    .min(2, "Le prénom doit contenir au moins 2 caractères"),
  last_name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  phone: phoneSchema.optional(),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "TEACHER", "PARENT"]),
  is_active: z.boolean().default(true),
});

export const updateUserSchema = createUserSchema.partial().extend({
  id: uuidSchema,
});

// School schemas
export const createSchoolSchema = z.object({
  name: stringSchema.min(
    3,
    "Le nom de l'école doit contenir au moins 3 caractères",
  ),
  address: stringSchema
    .min(5, "L'adresse doit contenir au moins 5 caractères")
    .nullable(),
  city: stringSchema.min(2, "La ville doit contenir au moins 2 caractères"),
  code: stringSchema.min(2, "Le code doit contenir au moins 2 caractères"),
  cycle_id: z.enum(["primary", "secondary"]),
  state_id: schoolStateEnum
    .optional()
    .default(SchoolStateEnum.SUSPENDED.toString())
    .transform(Number),
  is_technical_education: z.boolean().optional().default(false),
  phone: phoneSchema,
  email: emailSchema,
  image_url: stringSchema
    .transform((url) => (url.length === 0 ? null : url))
    .nullish(),
  status: schoolStatusEnum.default("private"),
});

export const updateSchoolSchema = createSchoolSchema.partial().extend({
  id: uuidSchema,
  updated_by: uuidSchema.optional(),
});

// Grade schemas
export const createGradeSchema = z.object({
  name: z
    .string()
    .min(2, "Le nom de la classe doit contenir au moins 2 caractères"),
  description: z
    .string()
    .min(5, "La description doit contenir au moins 5 caractères"),
  cycle_id: uuidSchema,
});

export const updateGradeSchema = createGradeSchema.partial().extend({
  id: z.number(),
});

// Class schemas
export const createClassSchema = z.object({
  name: z
    .string()
    .min(2, "Le nom de la classe doit contenir au moins 2 caractères"),
  grade_id: z.number(),
  school_id: uuidSchema,
  max_student: z
    .number()
    .min(1, "Le nombre maximum d'élèves doit être au moins 1")
    .max(100, "Le nombre maximum d'élèves ne peut pas dépasser 100"),
  series: z.string().optional(),
  is_active: z.boolean().default(true),
});

export const updateClassSchema = createClassSchema.partial().extend({
  id: uuidSchema,
});

// Student schemas
export const createStudentSchema = z.object({
  first_name: z
    .string()
    .min(2, "Le prénom doit contenir au moins 2 caractères"),
  last_name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  date_of_birth: z.string().refine((date) => {
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= 3 && age <= 25;
  }, "L'âge doit être entre 3 et 25 ans"),
  gender: z.enum(["M", "F"]),
  class_id: uuidSchema,
  parent_id: uuidSchema,
  registration_number: z
    .string()
    .min(3, "Le numéro d'inscription doit contenir au moins 3 caractères"),
  id_number: z
    .string()
    .min(3, "Le numéro d'identité doit contenir au moins 3 caractères"),
  phone: phoneSchema.optional(),
  address: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
  emergency_contact: phoneSchema,
  medical_info: z.string().optional(),
  photo_url: z.string().url().optional(),
  is_active: z.boolean().default(true),
});

export const updateStudentSchema = createStudentSchema.partial().extend({
  id: uuidSchema,
});

// Subject schemas
export const createSubjectSchema = z.object({
  name: z
    .string()
    .min(2, "Le nom de la matière doit contenir au moins 2 caractères"),
  code: z.string().min(2, "Le code doit contenir au moins 2 caractères"),
  description: z.string().optional(),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Format de couleur invalide")
    .optional(),
  is_active: z.boolean().default(true),
});

export const updateSubjectSchema = createSubjectSchema.partial().extend({
  id: uuidSchema,
});

// Attendance schemas
export const createAttendanceSchema = z.object({
  student_id: uuidSchema,
  class_id: uuidSchema,
  subject_id: uuidSchema,
  school_years_id: z.number(),
  semesters_id: z.number(),
  starts_at: z.iso.datetime(),
  ends_at: z.iso.datetime(),
  status: z.enum(["PRESENT", "ABSENT", "LATE", "EXCUSED"]),
  is_excused: z.boolean().default(false),
  reason: z.string().optional(),
  image_url: z.url().optional(),
});

export const updateAttendanceSchema = createAttendanceSchema.partial().extend({
  id: uuidSchema,
});

// Homework schemas
export const createHomeworkSchema = z.object({
  class_id: uuidSchema,
  subject_id: uuidSchema,
  teacher_id: uuidSchema,
  description: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères"),
  due_date: z.iso.datetime(),
  is_graded: z.boolean().default(false),
  max_score: z.number().min(0).optional(),
  school_years_id: z.number().optional(),
  semesters_id: z.number().optional(),
});

export const updateHomeworkSchema = createHomeworkSchema.partial().extend({
  id: uuidSchema,
});

// Conduct schemas
export const createConductIncidentSchema = z.object({
  student_id: uuidSchema,
  category_id: uuidSchema,
  reported_by: uuidSchema,
  school_year_id: z.number(),
  semester_id: z.number(),
  description: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères"),
  points_deducted: z.number().min(0).max(20),
  reported_at: z.iso.datetime().optional(),
  is_active: z.boolean().default(true),
});

export const updateConductIncidentSchema = createConductIncidentSchema
  .partial()
  .extend({
    id: uuidSchema,
  });

// Chat schemas
export const createChatSchema = z.object({
  class_id: uuidSchema,
  student_id: uuidSchema,
  teacher_id: uuidSchema,
  parent_id: uuidSchema,
  school_id: uuidSchema,
  topic_id: z.number().optional(),
  initiated_by: uuidSchema.optional(),
  status: z.enum(["ACTIVE", "CLOSED", "PENDING"]).default("ACTIVE"),
});

export const updateChatSchema = createChatSchema.partial().extend({
  id: uuidSchema,
});

// Pagination schema
export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
});

// Filter schema
export const filterSchema = z.object({
  column: z.string(),
  operator: z.enum([
    "eq",
    "neq",
    "gt",
    "gte",
    "lt",
    "lte",
    "like",
    "ilike",
    "in",
  ]),
  value: z.any(),
});

// Sort schema
export const sortSchema = z.object({
  column: z.string(),
  ascending: z.boolean().default(true),
});

// Query params schema
export const queryParamsSchema = z.object({
  pagination: paginationSchema.optional(),
  filters: z.array(filterSchema).optional(),
  sort: z.array(sortSchema).optional(),
  search: z.string().optional(),
});

// Export types
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CreateSchoolInput = z.infer<typeof createSchoolSchema>;
export type UpdateSchoolInput = z.infer<typeof updateSchoolSchema>;
export type CreateGradeInput = z.infer<typeof createGradeSchema>;
export type UpdateGradeInput = z.infer<typeof updateGradeSchema>;
export type CreateClassInput = z.infer<typeof createClassSchema>;
export type UpdateClassInput = z.infer<typeof updateClassSchema>;
export type CreateStudentInput = z.infer<typeof createStudentSchema>;
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;
export type CreateSubjectInput = z.infer<typeof createSubjectSchema>;
export type UpdateSubjectInput = z.infer<typeof updateSubjectSchema>;
export type CreateAttendanceInput = z.infer<typeof createAttendanceSchema>;
export type UpdateAttendanceInput = z.infer<typeof updateAttendanceSchema>;
export type CreateHomeworkInput = z.infer<typeof createHomeworkSchema>;
export type UpdateHomeworkInput = z.infer<typeof updateHomeworkSchema>;
export type CreateConductIncidentInput = z.infer<
  typeof createConductIncidentSchema
>;
export type UpdateConductIncidentInput = z.infer<
  typeof updateConductIncidentSchema
>;
export type CreateChatInput = z.infer<typeof createChatSchema>;
export type UpdateChatInput = z.infer<typeof updateChatSchema>;
export type QueryParams = z.infer<typeof queryParamsSchema>;
