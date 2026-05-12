// utils/analyticsHelper.js
// FIXED VERSION - Uses db.models instead of direct imports + modelMap

// Helper: Calculate completion rate for ONE form entry (based on non-empty fields)
const calculateCompletionRate = (entryData, Model) => {
  if (!entryData) return 0;

  // Exclude system fields that should not count toward progress
  const excludeFields = [
    "id",
    "userId",
    "completion_rate",
    "audit_status",
    "createdAt",
    "updatedAt",
    "deletedAt",
  ];

  const attributes = Object.keys(Model.rawAttributes || {}).filter(
    (attr) => !excludeFields.includes(attr),
  );

  const totalFields = attributes.length;
  if (totalFields === 0) return 100; // Edge case - no fields

  let filledCount = 0;

  attributes.forEach((attr) => {
    let value = entryData[attr];
    // A field is "filled" if it's not null/undefined and not an empty string
    if (
      value !== null &&
      value !== undefined &&
      (typeof value !== "string" || value.trim() !== "")
    ) {
      filledCount++;
    }
  });

  return Number(((filledCount / totalFields) * 100).toFixed(1));
};

// NEW: Get detailed progress for ONE form (includes entries + per-entry completion_rate)
export const getFormProgress = async (userId, modelName, key, db) => {
  // Access model through db (your current pattern)
  const Model = db[modelName];

  if (!Model) {
    console.warn(
      `Model ${modelName} not found in db. Check your index.js exports.`,
    );
    return {
      key,
      completion_rate: 0,
      entries: [],
    };
  }

  // Fetch ALL entries for this user
  const entries = await Model.findAll({
    where: { userId },
    order: [["createdAt", "ASC"]],
  });

  // Enrich every entry with its own completion_rate
  const detailedEntries = entries.map((entry) => {
    const entryData = entry.toJSON();
    const completion_rate = calculateCompletionRate(entryData, Model);

    return {
      ...entryData,
      completion_rate,
    };
  });

  // Form-level completion_rate = average of its entries (0 if no entries)
  const formCompletionRate =
    detailedEntries.length > 0
      ? Number(
          (
            detailedEntries.reduce((sum, e) => sum + e.completion_rate, 0) /
            detailedEntries.length
          ).toFixed(1),
        )
      : 0;

  return {
    key,
    completion_rate: formCompletionRate,
    entries: detailedEntries,
  };
};

// UPDATED: Section progress based on each form's completion_rate
export const getSectionProgress = async (userId, formList, db) => {
  const formProgress = await Promise.all(
    formList.map(async ({ model, key }) => {
      return await getFormProgress(userId, model, key, db);
    }),
  );

  // Section progress = average of the forms' completion_rate
  const sectionAverage =
    formProgress.length > 0
      ? Number(
          (
            formProgress.reduce((sum, f) => sum + f.completion_rate, 0) /
            formProgress.length
          ).toFixed(1),
        )
      : 0;

  return {
    section_progress: sectionAverage,
    forms: formProgress,
  };
};
