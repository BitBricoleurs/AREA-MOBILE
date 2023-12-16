export function findUnusedIntID(objects) {
  const existingIDs = objects.map((obj) => obj.id);

  let unusedID = 1;
  while (existingIDs.includes(unusedID)) {
    unusedID++;
  }

  return unusedID;
}
