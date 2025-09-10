import { unstable_cache } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";
import { EStatus } from "@/types";

type School = Database["public"]["Tables"]["schools"]["Row"];
type User = Database["public"]["Tables"]["users"]["Row"];

// Extended types for UI display
export type SchoolWithStats = School & {
  studentCount: number;
};

export type UserWithSchool = User & {
  school_name: string | null;
  school_id: string | null;
  role: string;
  hasHeadmasterRole?: boolean;
  hasDirectorRole?: boolean;
};

type DashboardStatCards = {
  totalSchools: number;
  activeSchools: number;
  totalStudents: number;
  totalUsers: number;
};

type RecentSchools = {
  id: string;
  name: string;
  city: string;
  studentCount: number;
  status: string;
};

type StudentsPerSchool = {
  schoolName: string;
  studentCount: number;
};

type SchoolsWithStats = {
  totalSchools: number;
  activeSchools: number;
  totalStudents: number;
  totalTeachers: number;
};

// Schools data functions
export async function getSchools(): Promise<SchoolWithStats[]> {
  const supabase = await createClient();

  const { data: schools, error } = await supabase
    .from("schools")
    .select(`
      *,
      student_school_class!inner(count)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching schools:", error);
    return [];
  }

  // Get student counts for each school
  const schoolsWithStats = await Promise.all(
    schools.map(async (school) => {
      const { count: studentCount } = await supabase
        .from("student_school_class")
        .select("*", { count: "exact", head: true })
        .eq("school_id", school.id)
        .eq("is_active", true);

      return {
        ...school,
        studentCount: studentCount || 0,
      };
    }),
  );

  return schoolsWithStats;
}

export async function getSchoolById(id: string): Promise<School | null> {
  const supabase = await createClient();

  const { data: school, error } = await supabase
    .from("schools")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching school:", error);
    return null;
  }

  return school;
}

// Users data functions
export async function getUsers(): Promise<UserWithSchool[]> {
  const supabase = await createClient();

  const { data: users, error } = await supabase
    .from("users")
    .select(`
      *,
      user_roles!inner(
        role_id,
        school_id,
        roles(name)
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching users:", error);
    return [];
  }

  // Transform the data to include school information
  const usersWithSchool = await Promise.all(
    users.map(async (user) => {
      // Get user's primary role and school
      const { data: userRole } = await supabase
        .from("user_roles")
        .select(`
          role_id,
          school_id,
          roles(name)
        `)
        .eq("user_id", user.id)
        .limit(1)
        .single();

      let school_name = null;
      let school_id = null;
      let role = "user";

      if (userRole) {
        role = userRole.roles?.name || "user";
        school_id = userRole.school_id;

        if (school_id) {
          const { data: school } = await supabase
            .from("schools")
            .select("name")
            .eq("id", school_id)
            .single();

          school_name = school?.name || null;
        }
      }

      return {
        ...user,
        school_name,
        school_id,
        role,
      };
    }),
  );

  return usersWithSchool;
}

export async function getUserById(id: string): Promise<UserWithSchool | null> {
  const supabase = await createClient();

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching user:", error);
    return null;
  }

  // Get user's role and school information
  const { data: userRole } = await supabase
    .from("user_roles")
    .select(`
      role_id,
      school_id,
      roles(name)
    `)
    .eq("user_id", user.id)
    .limit(1)
    .single();

  let school_name = null;
  let school_id = null;
  let role = "user";

  if (userRole) {
    role = userRole.roles?.name || "user";
    school_id = userRole.school_id;

    if (school_id) {
      const { data: school } = await supabase
        .from("schools")
        .select("name")
        .eq("id", school_id)
        .single();

      school_name = school?.name || null;
    }
  }

  return {
    ...user,
    school_name,
    school_id,
    role,
  };
}

// Dashboard stats function with caching
export const getDashboardStats = unstable_cache(
  async (
    supabase: Awaited<ReturnType<typeof createClient>>,
  ): Promise<DashboardStatCards> => {
    const [
      // Get total schools, students, users
      { data: allSchools, count: totalSchools },
      { count: totalStudents },
      { count: totalUsers },
    ] = await Promise.all([
      supabase
        .from("schools")
        .select("id, name,state_id", { count: "exact", head: false }),
      supabase
        .from("student_school_class")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true),
      supabase.from("users").select("*", { count: "exact", head: true }),
    ]);

    const activeSchools = allSchools?.filter(
      (school) => school.state_id === EStatus.ACTIVE,
    );

    return {
      totalSchools: totalSchools || 0,
      activeSchools: activeSchools?.length || 0,
      totalStudents: totalStudents || 0,
      totalUsers: totalUsers || 0,
    };
  },
  ["dashboard-stats"],
  {
    revalidate: 300, // Cache for 5 minutes
    tags: ["dashboard", "stats"],
  },
);

// Dashboard stats for recent schools with caching
export const getRecentSchools = unstable_cache(
  async (
    supabase: Awaited<ReturnType<typeof createClient>>,
  ): Promise<RecentSchools[]> => {
    // Get recent schools (last 5)
    const { data: recentSchoolsData } = await supabase
      .from("schools")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);

    const recentSchools = await Promise.all(
      (recentSchoolsData || []).map(async (school) => {
        const { count: studentCount } = await supabase
          .from("student_school_class")
          .select("*", { count: "exact", head: true })
          .eq("school_id", school.id)
          .eq("is_active", true);

        return {
          id: school.id,
          name: school.name,
          city: school.city,
          studentCount: studentCount || 0,
          status: school.status === "private" ? "active" : "pending",
        };
      }),
    );

    return recentSchools;
  },
  ["recent-schools"],
  {
    revalidate: 300, // Cache for 5 minutes
    tags: ["dashboard", "schools"],
  },
);

// Dashboard stats for students per school with caching
export const getStudentsPerSchool = unstable_cache(
  async (
    supabase: Awaited<ReturnType<typeof createClient>>,
  ): Promise<StudentsPerSchool[]> => {
    const { data: allSchools } = await supabase
      .from("schools")
      .select("id, name");

    const studentsPerSchool = await Promise.all(
      (allSchools || []).map(async (school) => {
        const { count: studentCount } = await supabase
          .from("student_school_class")
          .select("*", { count: "exact", head: true })
          .eq("school_id", school.id)
          .eq("is_active", true)
          .eq("enrollment_status", "accepted");

        return {
          schoolName: school.name,
          studentCount: studentCount || 0,
        };
      }),
    );

    // Sort by student count and take top 5
    const topSchoolsByStudents = studentsPerSchool
      .sort((a, b) => b.studentCount - a.studentCount)
      .slice(0, 5);

    return topSchoolsByStudents;
  },
  ["students-per-school"],
  {
    revalidate: 300, // Cache for 5 minutes
    tags: ["dashboard", "schools"],
  },
);

// Get users with specific roles (for headmaster assignment)
export async function getUsersByRole(
  roleId: number,
): Promise<UserWithSchool[]> {
  const supabase = await createClient();

  const { data: users, error } = await supabase
    .from("users")
    .select(`
      *,
      user_roles!inner(
        role_id,
        school_id,
        roles(name)
      )
    `)
    .eq("user_roles.role_id", roleId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching users by role:", error);
    return [];
  }

  // Transform the data to include school information
  const usersWithSchool = await Promise.all(
    users.map(async (user) => {
      // Get user's primary role and school
      const { data: userRole } = await supabase
        .from("user_roles")
        .select(`
          role_id,
          school_id,
          roles(name)
        `)
        .eq("user_id", user.id)
        .eq("role_id", roleId)
        .limit(1)
        .single();

      let school_name = null;
      let school_id = null;
      let role = "user";

      if (userRole) {
        role = userRole.roles?.name || "user";
        school_id = userRole.school_id;

        if (school_id) {
          const { data: school } = await supabase
            .from("schools")
            .select("name")
            .eq("id", school_id)
            .single();

          school_name = school?.name || null;
        }
      }

      return {
        ...user,
        school_name,
        school_id,
        role,
      };
    }),
  );

  return usersWithSchool;
}

// Get available headmasters (users with HEADMASTER role who are not assigned to any school)
export async function getAvailableHeadmasters(): Promise<UserWithSchool[]> {
  const supabase = await createClient();

  // Get users with HEADMASTER role who are not assigned to any school
  const { data: users, error } = await supabase
    .from("users")
    .select(`
      *,
      user_roles!inner(
        role_id,
        school_id,
        roles(name)
      )
    `)
    .eq("user_roles.role_id", 6) // HEADMASTER role
    .is("user_roles.school_id", null) // Not assigned to any school
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching available headmasters:", error);
    return [];
  }

  // Transform the data
  const usersWithSchool = users.map((user) => ({
    ...user,
    school_name: null,
    school_id: null,
    role: "Headmaster",
  }));

  return usersWithSchool;
}

// Get grades for school linking
export async function getGrades(): Promise<
  Array<{ id: number; name: string }>
> {
  const supabase = await createClient();

  const { data: grades, error } = await supabase
    .from("grades")
    .select("id, name")
    .order("id");

  if (error) {
    console.error("Error fetching grades:", error);
    return [];
  }

  return grades || [];
}

export async function getAvailableSchools(): Promise<School[]> {
  const supabase = await createClient();

  const { data: schools, error } = await supabase
    .from("schools")
    .select("*")
    .eq("state_id", EStatus.ACTIVE);

  if (error) {
    console.error("Error fetching available schools:", error);
    return [];
  }

  return schools || [];
}

// Wrapper functions that create the Supabase client and pass it to cached functions
export async function getDashboardStatsWrapper(): Promise<DashboardStatCards> {
  const supabase = await createClient();
  return getDashboardStats(supabase);
}

export async function getRecentSchoolsWrapper(): Promise<RecentSchools[]> {
  const supabase = await createClient();
  return getRecentSchools(supabase);
}

export async function getStudentsPerSchoolWrapper(): Promise<
  StudentsPerSchool[]
> {
  const supabase = await createClient();
  return getStudentsPerSchool(supabase);
}

// Enhanced schools data functions with caching
export const getSchoolsWithStats = unstable_cache(
  async (
    supabase: Awaited<ReturnType<typeof createClient>>,
  ): Promise<SchoolsWithStats> => {
    const [
      // Get total schools, students, teachers
      { data: allSchools, count: totalSchools },
      { count: totalStudents },
      { count: totalTeachers },
    ] = await Promise.all([
      supabase
        .from("schools")
        .select("id, name, state_id", { count: "exact", head: false }),
      supabase
        .from("student_school_class")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true),
      supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true),
    ]);

    const activeSchools = allSchools?.filter(
      (school) => school.state_id === EStatus.ACTIVE,
    );

    return {
      totalSchools: totalSchools || 0,
      activeSchools: activeSchools?.length || 0,
      totalStudents: totalStudents || 0,
      totalTeachers: totalTeachers || 0,
    };
  },
  ["schools-with-stats"],
  {
    revalidate: 300, // Cache for 5 minutes
    tags: ["schools", "stats", "students", "teachers"],
  },
);

// Basic schools list (fast loading)
export const getSchoolsBasic = unstable_cache(
  async (
    supabase: Awaited<ReturnType<typeof createClient>>,
  ): Promise<School[]> => {
    const { data: schools, error } = await supabase
      .from("schools")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching schools:", error);
      return [];
    }

    return schools || [];
  },
  ["schools-basic"],
  {
    revalidate: 300, // Cache for 5 minutes
    tags: ["schools"],
  },
);

// Student counts for schools (progressive loading)
export const getSchoolsStudentCounts = unstable_cache(
  async (
    supabase: Awaited<ReturnType<typeof createClient>>,
    schoolIds: string[],
  ): Promise<Record<string, number>> => {
    if (schoolIds.length === 0) return {};

    // Get student counts for all schools in parallel
    const studentCountPromises = schoolIds.map(async (schoolId) => {
      const { count: studentCount } = await supabase
        .from("student_school_class")
        .select("*", { count: "exact", head: true })
        .eq("school_id", schoolId)
        .eq("is_active", true);

      return { schoolId, count: studentCount || 0 };
    });

    const results = await Promise.all(studentCountPromises);

    // Convert to record for easy lookup
    return results.reduce(
      (acc, { schoolId, count }) => {
        acc[schoolId] = count;
        return acc;
      },
      {} as Record<string, number>,
    );
  },
  ["schools-student-counts"],
  {
    revalidate: 300, // Cache for 5 minutes
    tags: ["schools", "students"],
  },
);

// School detail data with caching
export const getSchoolDetailData = unstable_cache(
  async (
    supabase: Awaited<ReturnType<typeof createClient>>,
    schoolId: string,
  ): Promise<
    | (SchoolWithStats & {
        students: Array<{
          id: string;
          students?: {
            first_name: string;
            last_name: string;
            date_of_birth: string | null;
          };
          classes?: {
            name: string;
          } | null;
          enrollment_status: string;
        }>;
        teachers: unknown[];
      })
    | null
  > => {
    const { data: school, error } = await supabase
      .from("schools")
      .select("*")
      .eq("id", schoolId)
      .single();

    if (error || !school) {
      console.error("Error fetching school:", error);
      return null;
    }

    // Get related data in parallel
    const [{ count: studentCount }, { data: students }, { data: teachers }] =
      await Promise.all([
        supabase
          .from("student_school_class")
          .select("*", { count: "exact", head: true })
          .eq("school_id", schoolId)
          .eq("is_active", true),
        supabase
          .from("student_school_class")
          .select(`
          *,
          students(*),
          classes(*)
        `)
          .eq("school_id", schoolId)
          .eq("is_active", true)
          .limit(10),
        supabase
          .from("users")
          .select(`
          *,
          user_roles!inner(
            role_id,
            roles(name)
          )
        `)
          .eq("school_id", schoolId)
          .eq("is_active", true)
          .limit(10),
      ]);

    return {
      ...school,
      studentCount: studentCount || 0,
      students: students || [],
      teachers: teachers || [],
    };
  },
  ["school-detail"],
  {
    revalidate: 180, // Cache for 3 minutes
    tags: ["schools", "students", "teachers"],
  },
);

// Wrapper functions for enhanced schools data
export async function getSchoolsWithStatsWrapper(): Promise<SchoolsWithStats> {
  const supabase = await createClient();
  return getSchoolsWithStats(supabase);
}

export async function getSchoolsBasicWrapper(): Promise<School[]> {
  const supabase = await createClient();
  return getSchoolsBasic(supabase);
}

export async function getSchoolsStudentCountsWrapper(
  schoolIds: string[],
): Promise<Record<string, number>> {
  const supabase = await createClient();
  return getSchoolsStudentCounts(supabase, schoolIds);
}

export async function getSchoolDetailDataWrapper(schoolId: string): Promise<
  | (SchoolWithStats & {
      students: Array<{
        id: string;
        students?: {
          first_name: string;
          last_name: string;
          date_of_birth: string | null;
        };
        classes?: {
          name: string;
        } | null;
        enrollment_status: string;
      }>;
      teachers: unknown[];
    })
  | null
> {
  const supabase = await createClient();
  return getSchoolDetailData(supabase, schoolId);
}
