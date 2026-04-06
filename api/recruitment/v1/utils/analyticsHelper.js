import db from "../../../../models/index.js";

// Helper to get progress for a single form
export const getFormProgress = async (userId, model) => {
  const records = await db[model].findAll({
    where: { userId },
    attributes: ["completion_rate"],
    raw: true,
  });

  if (records.length === 0) return 0;

  const sum = records.reduce(
    (acc, r) => acc + Number(r.completion_rate || 0),
    0,
  );
  return Number((sum / records.length).toFixed(1));
};

// Helper to get progress for an entire section + individual forms
export const getSectionProgress = async (userId, formList) => {
  const formProgress = await Promise.all(
    formList.map(async ({ model, key }) => {
      const progress = await getFormProgress(userId, model);
      return { key, progress };
    }),
  );

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
    forms: formProgress, // ← This is what you asked for (per form progress)
  };
};
