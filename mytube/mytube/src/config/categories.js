// EDIT ME: add/remove/modify categories here. Nothing else needs to change.
// - queries:  search terms sent to YouTube (first `queriesPerCategory` are used)
// - keywords: optional; if non-empty, a video must contain one in its title/channel
//             to be kept (stricter classification). Leave [] to trust the query.
export const settings = { queriesPerCategory: 1, perQueryResults: 12 };

export const categories = [
  { id: 'gate', label: 'GATE', icon: '🎯', color: '#e5484d', queries: ['GATE CSE preparation lectures', 'GATE Computer Science lectures'], keywords: [] },
  { id: 'ai', label: 'Artificial Intelligence', icon: '🤖', color: '#8e4ec6', queries: ['Artificial Intelligence tutorials', 'Machine Learning lectures'], keywords: [] },
  { id: 'cse', label: 'Computer Science', icon: '💻', color: '#3e63dd', queries: ['computer science fundamentals lectures'], keywords: [] },
  { id: 'dsa', label: 'DSA', icon: '🧩', color: '#12a594', queries: ['Data Structures and Algorithms course'], keywords: [] },
  { id: 'web', label: 'Web Development', icon: '🌐', color: '#0090ff', queries: ['web development tutorial HTML CSS JavaScript React'], keywords: [] },
  { id: 'sociology', label: 'Sociology', icon: '👥', color: '#d6409f', queries: ['Sociology concepts', 'Indian society lectures'], keywords: [] },
  { id: 'politics', label: 'Politics', icon: '🏛️', color: '#ab6400', queries: ['Indian politics explained', 'political science explainers'], keywords: [] },
  { id: 'news', label: 'News', icon: '📰', color: '#cd2b31', queries: ['news analysis current affairs'], keywords: [] },
  { id: 'spirituality', label: 'Spirituality', icon: '🕉️', color: '#f76b15', queries: ['spirituality meditation discourse'], keywords: [] },
  { id: 'science', label: 'Science', icon: '🔬', color: '#30a46c', queries: ['science explained physics chemistry biology'], keywords: [] },
  { id: 'psychology', label: 'Psychology', icon: '🧠', color: '#a18072', queries: ['psychology concepts explained'], keywords: [] },
  { id: 'philosophy', label: 'Philosophy', icon: '📜', color: '#6e56cf', queries: ['philosophy lectures introduction'], keywords: [] },
  { id: 'gk', label: 'General Knowledge', icon: '💡', color: '#e5a50a', queries: ['general knowledge facts India world'], keywords: [] },
];
