import getChapters from "./getChapters.js";
import downloadChapter from "./downloadChapter.cjs";
import { eachLimit } from "async";
import { MultiProgressBars } from "multi-progress-bars";

const mpb = new MultiProgressBars({
    initMessage: " Firerip ",
    anchor: "bottom",
    persist: true,
    progressWidth: 40,
    numCrawlers: 7,
    border: true,
});

async function downloadCourse(course) {
    console.log(
      `************************************************************************`
    );
    console.log(`****** Downloading [${course.title}] ******`);
    console.log(
      `************************************************************************`
    );
  
    const chapters = await getChapters(course.link);
    console.log(`[INFO] Found ${chapters.length} chapter(s)...`);
  
    await eachLimit(chapters, 6, async (chapter) => {
      const progressbarName = `${chapter.number} - ${chapter.name.slice(0, 20)}...`; // Truncate long titles
      mpb.addTask(progressbarName, {
        type: "percentage",
        message: `${chapter.number} - ${course.title}`,
      });
  
      try {
        await downloadChapter(
          chapter.link,
          `./downloads/${course.title}/${chapter.number}. ${chapter.emoji} - ${chapter.name.replace(
            /\//g,
            " "
          )}.mp4`,
          (progress) => {
            mpb.updateTask(progressbarName, { percentage: progress.percent / 100 });
          }
        );
        mpb.done(progressbarName, {
          message: `${chapter.number} - ${course.title} - Downloaded successfully.`,
        });
      } catch (error) {
        console.error(`Error downloading chapter: ${error.message}`);
        // Implement error handling strategy (e.g., retry, notify user)
      } finally {
        mpb.removeTask(progressbarName);
      }
    });
  }


export default downloadCourse;