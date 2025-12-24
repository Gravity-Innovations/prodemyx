const mysql = require("mysql2/promise");

async function seed() {
  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "prodemyx",
  });

  console.log("Connected to MySQL. Seeding...");

  // 1. Clear tables (respect FK order)
  await db.execute("SET FOREIGN_KEY_CHECKS = 0");
  await db.execute("TRUNCATE TABLE user_course_access");
  await db.execute("TRUNCATE TABLE purchases");
  await db.execute("TRUNCATE TABLE course_schedules");
  await db.execute("TRUNCATE TABLE courses");
  await db.execute("TRUNCATE TABLE categories");
  await db.execute("TRUNCATE TABLE users");
  await db.execute("SET FOREIGN_KEY_CHECKS = 1");

  console.log("Tables truncated.");

  // 2. Insert users
  const users = [
    ["Admin User", "admin@site.com", "hashedpass1", "1234567890", "HQ", "admin"],
    ["John Instructor", "john@site.com", "hashedpass2", "9876543210", "NYC", "instructor"],
    ["Alice Student", "alice@site.com", "hashedpass3", "5555555555", "LA", "student"],
    ["Bob Student", "bob@site.com", "hashedpass4", "4444444444", "Chicago", "student"],
  ];

  await db.query(
    `INSERT INTO users (name, email, password, phone, address, role)
     VALUES ?`,
    [users]
  );

  console.log("Users inserted.");

  // 3. Insert categories
  const categories = [
    ["Web Development"],
    ["Data Science"],
    ["Design"],
  ];

  await db.query(`INSERT INTO categories (name) VALUES ?`, [categories]);
  console.log("Categories inserted.");

  // 4. Insert courses
  const courses = [
    [1, "JavaScript for Beginners", "Basic JS course", "4 weeks", 49.99, null],
    [1, "React Crash Course", "React basics", "6 weeks", 79.99, null],
    [2, "Python for Data Science", "Data analysis course", "8 weeks", 89.99, null],
    [3, "UI/UX Design Basics", "Learn UI/UX principles", "5 weeks", 69.99, null],
  ];

  await db.query(
    `INSERT INTO courses (category_id, title, description, duration, price, photo)
     VALUES ?`,
    [courses]
  );

  console.log("Courses inserted.");

  // 5. Insert course schedules
  const schedules = [
    [1, 2, "Live Q&A", "https://meet.example.com/js", "2025-11-25", "10:00:00", "scheduled"],
    [2, 2, "React Workshop", "https://meet.example.com/react", "2025-11-26", "14:00:00", "scheduled"],
    [3, 2, "Python Mentoring", "https://meet.example.com/python", "2025-11-28", "16:00:00", "scheduled"],
  ];

  await db.query(
    `INSERT INTO course_schedules (course_id, instructor_id, meeting_title, meeting_link, meeting_date, meeting_time, status)
     VALUES ?`,
    [schedules]
  );

  console.log("Course schedules inserted.");

  // 6. Insert purchases
  const purchases = [
    [3, 1, "PAY12345", 49.99, "success"],
    [4, 2, "PAY98765", 79.99, "success"],
  ];

  await db.query(
    `INSERT INTO purchases (user_id, course_id, payment_id, amount, status)
     VALUES ?`,
    [purchases]
  );

  console.log("Purchases inserted.");

  // 7. Insert user course access
  const access = [
    [3, 1],
    [4, 2],
  ];

  await db.query(
    `INSERT INTO user_course_access (user_id, course_id)
     VALUES ?`,
    [access]
  );

  console.log("User course access inserted.");

  console.log("🎉 Seeding completed successfully!");
  process.exit();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
