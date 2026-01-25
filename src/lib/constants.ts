export const SECTORS = [
  { value: 'education', label: 'التعليم', icon: '📚' },
  { value: 'health', label: 'الصحة', icon: '🏥' },
  { value: 'security', label: 'الأمن', icon: '🛡️' },
  { value: 'administration', label: 'الإدارة', icon: '🏛️' },
  { value: 'justice', label: 'العدل', icon: '⚖️' },
  { value: 'finance', label: 'المالية', icon: '💰' },
  { value: 'transport', label: 'النقل', icon: '🚌' },
  { value: 'agriculture', label: 'الفلاحة', icon: '🌾' },
  { value: 'tourism', label: 'السياحة', icon: '✈️' },
  { value: 'technology', label: 'التكنولوجيا', icon: '💻' },
  { value: 'other', label: 'أخرى', icon: '📋' },
] as const;

export const MOROCCAN_CITIES = [
  'الرباط', 'الدار البيضاء', 'فاس', 'مراكش', 'طنجة', 
  'أكادير', 'مكناس', 'وجدة', 'القنيطرة', 'تطوان',
  'سلا', 'الناظور', 'خريبكة', 'أسفي', 'الجديدة',
  'تازة', 'بني ملال', 'العيون', 'الداخلة', 'أخرى'
];

export type JobSector = typeof SECTORS[number]['value'];
