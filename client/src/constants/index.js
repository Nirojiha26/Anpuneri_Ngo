export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  USER: 'user',
};

export const PROJECT_CATEGORIES = [
  { value: 'education', label: 'Education' },
  { value: 'health', label: 'Health' },
  { value: 'community', label: 'Community' },
  { value: 'emergency', label: 'Emergency' },
  { value: 'scholarship', label: 'Scholarship' },
  { value: 'supplies', label: 'School Supplies' },
  { value: 'other', label: 'Other' },
];

export const PROJECT_STATUSES = [
  { value: 'planning', label: 'Planning' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'completed', label: 'Completed' },
  { value: 'archived', label: 'Archived' },
];

export const EVENT_CATEGORIES = [
  { value: 'fundraiser', label: 'Fundraiser' },
  { value: 'awareness', label: 'Awareness' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'community', label: 'Community' },
  { value: 'celebration', label: 'Celebration' },
  { value: 'other', label: 'Other' },
];

export const GALLERY_CATEGORIES = [
  { value: 'events', label: 'Events' },
  { value: 'projects', label: 'Projects' },
  { value: 'team', label: 'Team' },
  { value: 'community', label: 'Community' },
  { value: 'education', label: 'Education' },
  { value: 'other', label: 'Other' },
];

export const NEWS_CATEGORIES = [
  { value: 'news', label: 'News' },
  { value: 'blog', label: 'Blog' },
  { value: 'announcement', label: 'Announcement' },
  { value: 'story', label: 'Story' },
  { value: 'press', label: 'Press Release' },
];

export const VOLUNTEER_AVAILABILITY = [
  { value: 'weekdays', label: 'Weekdays Only' },
  { value: 'weekends', label: 'Weekends Only' },
  { value: 'both', label: 'Weekdays & Weekends' },
  { value: 'flexible', label: 'Flexible' },
];

export const DONATION_PURPOSES = [
  { value: 'general', label: 'General Fund' },
  { value: 'education', label: 'Education' },
  { value: 'emergency', label: 'Emergency Relief' },
  { value: 'scholarship', label: 'Scholarship' },
  { value: 'community', label: 'Community Programs' },
  { value: 'supplies', label: 'School Supplies' },
];

export const DONATION_AMOUNTS = [25, 50, 100, 250, 500, 1000];

export const ITEMS_PER_PAGE = 9;

export const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about', children: [
    { label: 'Who We Are', path: '/about' },
    { label: 'Our Mission', path: '/mission' },
    { label: 'Our Vision', path: '/vision' },
    { label: 'Our Team', path: '/team' },
  ]},
  { label: 'Projects', path: '/projects' },
  { label: 'Events', path: '/events' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Volunteer', path: '/volunteer' },
  { label: 'Donate', path: '/donate' },
  { label: 'Contact', path: '/contact' },
];

export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com/ngodemo',
  twitter: 'https://twitter.com/ngodemo',
  instagram: 'https://instagram.com/ngodemo',
  linkedin: 'https://linkedin.com/company/ngodemo',
  youtube: 'https://youtube.com/@ngodemo',
};
