import getCourses from "./util/getCourses.js";
import downloadCourse from './util/downloadCourse.js';
import readline from "readline";


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});


(async () => {

  console.log("[INFO] Grabbing courses...");
  const courses = await getCourses();
  
  console.log(`[INFO] Found ${courses.length} course(s)...`);
  courses.forEach((course, index) => {
    console.log(`${index + 1} - ${course.title}`);
  });

  rl.question(
    "Enter keyword to filter course(s) (blank for all): ", 
    async (answer) => {
        const filteredCourses = courses.filter((course) =>
        course.title.toLowerCase().includes(answer.toLowerCase())
    );

    console.log(`-----------------------------`);
    console.log(`[INFO] Filtered ${filteredCourses.length} Course(s)...`);
    filteredCourses.forEach((course, index) => {
      console.log(`${index + 1} - ${course.title}`);
    });

    for (const course of filteredCourses) {
      await downloadCourse(course);
    }

    rl.close();
  });
})();
