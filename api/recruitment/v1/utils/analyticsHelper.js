import db from "../../../../models/index.js";

// Helper to get progress for a single form
// Now consistently returns { key, progress } object
export const getFormProgress = async (userId, model, key) => {
  if (!userId) {
    return { key, progress: 0 };
  }

  const records = await db[model].findAll({
    where: { userId },
    attributes: ["completion_rate"],
    raw: true,
  });

  // If no records found → return progress as 0 with the key
  if (records.length === 0) {
    return { key, progress: 0 };
  }

  const sum = records.reduce(
    (acc, r) => acc + Number(r.completion_rate || 0),
    0,
  );

  const progress = Number((sum / records.length).toFixed(1));

  return { key, progress };
};

// Helper to get progress for an entire section + individual forms
export const getSectionProgress = async (userId, formList) => {
  // Get progress for all forms in this section
  const formProgress = await Promise.all(
    formList.map(async ({ model, key }) => {
      return await getFormProgress(userId, model, key); // Now passing key
    }),
  );

  // Calculate section average
  const sectionAverage =
    formProgress.length > 0
      ? Number(
          (
            formProgress.reduce((sum, f) => sum + f.progress, 0) /
            formProgress.length
          ).toFixed(1),
        )
      : 0;

  return {
    section_progress: sectionAverage,
    forms: formProgress, // Always returns array of { key, progress }
  };
};
