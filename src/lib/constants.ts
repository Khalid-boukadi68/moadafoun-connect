export const TOPICS = [
  { value: 'thoughts', label: 'Thoughts', icon: '💭' },
  { value: 'confessions', label: 'Confessions', icon: '🎭' },
  { value: 'relationships', label: 'Relationships', icon: '💕' },
  { value: 'work', label: 'Work', icon: '💼' },
  { value: 'dreams', label: 'Dreams', icon: '🔮' },
  { value: 'opinions', label: 'Opinions', icon: '📢' },
  { value: 'questions', label: 'Questions', icon: '🤔' },
  { value: 'venting', label: 'Venting', icon: '😤' },
  { value: 'advice', label: 'Advice', icon: '💡' },
  { value: 'stories', label: 'Stories', icon: '📖' },
  { value: 'other', label: 'Other', icon: '📝' },
] as const;

// Alias for database compatibility (sector = topic in DB)
export const SECTORS = TOPICS;

export type TopicType = typeof TOPICS[number]['value'];
export type JobSector = TopicType;
