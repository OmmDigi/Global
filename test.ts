const mapFilter = <T>(
  items: T[],
  mapCondition: (item: T) => T,
  filterCondition: (item: T) => boolean,
): T[] => {
  const finalItem: T[] = [];
  for (const item of items) {
    const mapedItem = mapCondition(item);
    if (filterCondition(mapedItem)) {
      finalItem.push(mapedItem);
    }
  }

  return finalItem;
};

const nums = [
  {
    name: "Somnath Gupta",
    age: 24,
  },
  {
    name: "Arindam Gupta",
    age: 23,
  },
  {
    name: "Hello Pal",
    age: 21,
  },
];

console.log(
  "Final Array ",
  mapFilter(
    nums,
    (item) => {
      const newItem = item;
      newItem.age + 2;
      return newItem;
    },
    (item) => item.age <= 10,
  ),
);
