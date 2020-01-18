// maps constants
const SEARCH_AS_YOU_TYPE_TIMEOUT = 4000;
const DEFAULT_SEARCH_LIMIT = 100;
const DEFAULT_ZOOM = 11;
const CHICAGO = { lat: 41.85187182891432, lng: -87.69695319550783 };

// data urls
const LOCAL_DATA = "http://localhost:8000/data/locations.txt";
const PROD_DATA = "https://www.chicagoresourcehub.com/wp-content/themes/fortunato-child/data/locations.txt";
const DATA_URL = LOCAL_DATA;

// maps support
const GOOGLE_SEARCH_URL_PREFIX = "https://www.google.com/search?q=";
const MAP_MARKERS = {
  "standard": "https://www.chicagoresourcehub.com/wp-content/uploads/2020/01/drop-pin.png",
  "peace_hub": "https://www.chicagoresourcehub.com/wp-content/uploads/2019/11/flag.png",
  "ucan": "https://www.chicagoresourcehub.com/wp-content/uploads/2019/11/UCAN-logo-transparant-64x64.png",
  "large_organization": "https://www.chicagoresourcehub.com/wp-content/uploads/2019/11/icon57.png",
  "police_department": "https://www.chicagoresourcehub.com/wp-content/uploads/2019/11/police.png",
  "food_provider": "https://www.chicagoresourcehub.com/wp-content/uploads/2019/11/groceries-32x32.png"
};

// placeholders
const ACTIVITY_PLACEHOLDER = "Filter for an activity.";
const POPULATION_PLACEHOLDER = "Filter for a population.";
const AUTOCOMPLETE_PLACEHOLDER = "Enter keyword to search organizations.";
const SERVICES_SEARCH_DISABLED = "Remove organization name to search services.";

// autocomplete
const AUTOCOMPLETE_DATA = {
  "Various": null,
  "Advocacy": null,
  "After School": null,
  "After School Matters": null,
  "Anger": null,
  "Cash": null,
  "Case Management": null,
  "CILA": null,
  "City Colleges of Chicago": null,
  "Community Support": null,
  "Computer": null,
  "Condom": null,
  "Counseling": null,
  "CPS Option": null,
  "DACA": null,
  "DHS": null,
  "Domestic Violence": null,
  "DUI": null,
  "Early Childhood Education": null,
  "Education!": null,
  "Crisis": null,
  "Phone Number": null,
  "Employment": null,
  "Job": null,
  "Nature": null,
  "Family Planning": null,
  "FQHC": null,
  "Financial": null,
  "Food": null,
  "GED": null,
  "Greencorps": null,
  "Head Start": null,
  "Early Head Start": null,
  "Health Care": null,
  "Phone": null,
  "HIV": null,
  "Home Visits": null,
  "Housing": null,
  "Inpatient": null,
  "Legal": null,
  "Library": null,
  "Life Skills": null,
  "Medicaid": null,
  "Medication": null,
  "Mentoring": null,
  "Mental Health": null,
  "Nutrition": null,
  "OBGYN": null,
  "One Summer Chicago": null,
  "Outpatient": null,
  "Police": null,
  "Internet": null,
  "Psychological Assessments": null,
  "Religious": null,
  "Residential": null,
  "RISE": null,
  "Shelter": null,
  "Youth Shelter": null,
  "Accepts SNAP": null,
  "SNAP Application": null,
  "Soup": null,
  "STD Testing": null,
  "Substance Abuse": null,
  "Summer": null,
  "Support Group": null,
  "TANF": null,
  "Taxes": null,
  "Thrift Shop": null,
  "Tutoring": null,
  "Urban Farm": null,
  "Warming & Cooling": null,
  "WIC": null,
  "WIOA": null,
};
