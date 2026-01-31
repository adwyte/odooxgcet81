export const countries = [
    { code: 'IN', name: 'India' },
    { code: 'US', name: 'United States' },
];

export const states: Record<string, { code: string; name: string }[]> = {
    'IN': [
        { code: 'MH', name: 'Maharashtra' },
        { code: 'KA', name: 'Karnataka' },
        { code: 'DL', name: 'Delhi' },
        { code: 'TN', name: 'Tamil Nadu' },
        { code: 'UP', name: 'Uttar Pradesh' },
    ],
    'US': [
        { code: 'CA', name: 'California' },
        { code: 'NY', name: 'New York' },
        { code: 'TX', name: 'Texas' },
        { code: 'FL', name: 'Florida' },
        { code: 'IL', name: 'Illinois' },
    ],
};

export const cities: Record<string, string[]> = {
    // India
    'MH': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Thane'],
    'KA': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum'],
    'DL': ['New Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi'],
    'TN': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'],
    'UP': ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Ghaziabad'],

    // US
    'CA': ['Los Angeles', 'San Francisco', 'San Diego', 'San Jose', 'Sacramento'],
    'NY': ['New York City', 'Buffalo', 'Rochester', 'Yonkers', 'Syracuse'],
    'TX': ['Houston', 'San Antonio', 'Dallas', 'Austin', 'Fort Worth'],
    'FL': ['Jacksonville', 'Miami', 'Tampa', 'Orlando', 'St. Petersburg'],
    'IL': ['Chicago', 'Aurora', 'Naperville', 'Joliet', 'Rockford'],
};
