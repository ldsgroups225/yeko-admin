import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

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

export type DashboardStats = {
  totalSchools: number;
  activeSchools: number;
  totalStudents: number;
  totalUsers: number;
  recentSchools: Array<{
    id: string;
    name: string;
    city: string;
    studentCount: number;
    status: string;
  }>;
  studentsPerSchool: Array<{
    schoolName: string;
    studentCount: number;
  }>;
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

// Dashboard stats function
export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();

  // Get total schools
  const { count: totalSchools } = await supabase
    .from("schools")
    .select("*", { count: "exact", head: true });

  // Get active schools (assuming status = 'private' means active)
  const { count: activeSchools } = await supabase
    .from("schools")
    .select("*", { count: "exact", head: true })
    .eq("status", "private");

  // Get total students
  const { count: totalStudents } = await supabase
    .from("student_school_class")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true);

  // Get total users
  const { count: totalUsers } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true });

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

  // Get students per school (top 5)
  const { data: allSchools } = await supabase
    .from("schools")
    .select("id, name");

  const studentsPerSchool = await Promise.all(
    (allSchools || []).map(async (school) => {
      const { count: studentCount } = await supabase
        .from("student_school_class")
        .select("*", { count: "exact", head: true })
        .eq("school_id", school.id)
        .eq("is_active", true);

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

  return {
    totalSchools: totalSchools || 0,
    activeSchools: activeSchools || 0,
    totalStudents: totalStudents || 0,
    totalUsers: totalUsers || 0,
    recentSchools,
    studentsPerSchool: topSchoolsByStudents,
  };
}

// Available schools for linking users
export async function getAvailableSchools(): Promise<
  Array<{ id: string; name: string; city: string }>
> {
  const supabase = await createClient();

  const { data: schools, error } = await supabase
    .from("schools")
    .select("id, name, city")
    .eq("status", "private")
    .order("name");

  if (error) {
    console.error("Error fetching available schools:", error);
    return [];
  }

  return schools || [];
}

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
