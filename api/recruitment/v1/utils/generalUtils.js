export const generateSlug = (slug) => {
  return slug
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // remove symbols
    .replace(/\s+/g, "-");
};

export const getCompletionPercentage = (dataset) => {
  const totalCount = Object.keys(dataset).length;
  const filledKeys = Object.keys(dataset).filter(
    (key) =>
      dataset[key] !== undefined &&
      dataset[key] !== null &&
      dataset[key] !== "" &&
      dataset[key] !== "[]",
  ).length;

  if (totalCount === 0) return 0;

  const percentage = (filledKeys / totalCount) * 100;

  return Math.min(100, Math.ceil(percentage * 10) / 10);
};

export const mergeUploadFilestoJson = (defaultData, newData) => {
  const firstData = JSON.parse(defaultData);

  if (!newData) {
    newData = [];
  }
  const output = [...firstData, ...newData];

  return JSON.stringify(output);
};
