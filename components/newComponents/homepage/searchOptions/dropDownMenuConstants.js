export const cityNames = [
  {
    name: "Gurgaon",
  },
  {
    name: "Pune",
  },
  {
    name: "Noida",
  },
  {
    name: "Ghaziabad",
  },
];

export const propertyTypeData = [
  {
    name: "Residential",
    residentialUnitTypes: [
      { name: "Apartments" },
      { name: "Floors" },
      { name: "Villa" },
      { name: "Plot" },
      { name: "Row House" },
      { name: "Independent House" },
      { name: "Studio Apartment" },
    ],
  },
  {
    name: "Commercial",
    commercialUnitTypes: [
      { name: "Plot" },
      { name: "Service Apartment" },
      { name: "Shop" },
      { name: "Office Space" },
      { name: "Virtual Shop" },
      { name: "Food Court" },
      { name: "Multiplex" },
      { name: "SCO" },
    ],
  },
];

export const priceRangeData = [
  { value: 10000000, label: "< 1 Cr" },
  { value: 20000000, label: "2 Cr" },
  { value: 30000000, label: "3 Cr" },
  { value: 40000000, label: "4 Cr" },
  { value: 50000000, label: "5 Cr" },
  { value: 60000000, label: "6 Cr" },
  { value: 70000000, label: "7 Cr <" },
];

export const valuetext = (value) => {
  if (value >= 10000000) {
    return `${value / 10000000} Cr.`;
  } else if (value >= 100000) {
    return `${value / 100000} Lacs`;
  } else {
    return `${value}`;
  }
};
