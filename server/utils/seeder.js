require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');

const User = require('../models/User');
const Project = require('../models/Project');
const Event = require('../models/Event');
const News = require('../models/News');
const Gallery = require('../models/Gallery');
const Volunteer = require('../models/Volunteer');
const Donation = require('../models/Donation');
const TeamMember = require('../models/TeamMember');
const Testimonial = require('../models/Testimonial');
const FAQ = require('../models/FAQ');
const SuccessStory = require('../models/SuccessStory');
const Settings = require('../models/Settings');

const seed = async () => {
  await connectDB();

  // Clear all
  await Promise.all([
    User.deleteMany({}),
    Project.deleteMany({}),
    Event.deleteMany({}),
    News.deleteMany({}),
    Gallery.deleteMany({}),
    Volunteer.deleteMany({}),
    Donation.deleteMany({}),
    TeamMember.deleteMany({}),
    Testimonial.deleteMany({}),
    FAQ.deleteMany({}),
    SuccessStory.deleteMany({}),
    Settings.deleteMany({}),
  ]);

  console.log('🗑️  Database cleared');

  // Admin user
  const admin = await User.create({
    name: process.env.ADMIN_NAME || 'Super Admin',
    email: process.env.ADMIN_EMAIL || 'admin@ngo.org',
    password: process.env.ADMIN_PASSWORD || 'Admin@123456',
    role: 'admin',
    isActive: true,
  });

  console.log('👤 Admin user created:', admin.email);

  // Projects
  const projects = await Project.insertMany([
    {
      title: 'Bright Futures Scholarship Program',
      slug: 'bright-futures-scholarship-program',
      description: 'Our flagship scholarship program supports academically outstanding students from low-income families to pursue higher education. We cover tuition, books, and living expenses for selected students.',
      shortDescription: 'Providing full scholarships to deserving students who lack financial means to pursue higher education.',
      category: 'scholarship',
      status: 'ongoing',
      visibility: 'published',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
      targetAmount: 50000,
      raisedAmount: 32000,
      beneficiaries: 45,
      startDate: new Date('2023-01-01'),
      location: 'Nationwide',
      tags: ['scholarship', 'education', 'students'],
      isFeatured: true,
      createdBy: admin._id,
    },
    {
      title: 'School Supplies Drive 2024',
      slug: 'school-supplies-drive-2024',
      description: 'Every child deserves the tools to learn. This project distributes backpacks, notebooks, pens, geometry sets, and other essential school supplies to underprivileged students at the start of each academic year.',
      shortDescription: 'Distributing essential school supplies to thousands of underprivileged students annually.',
      category: 'supplies',
      status: 'ongoing',
      visibility: 'published',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
      targetAmount: 20000,
      raisedAmount: 15500,
      beneficiaries: 1200,
      startDate: new Date('2024-01-01'),
      location: 'Multiple Districts',
      tags: ['supplies', 'education', 'children'],
      isFeatured: true,
      createdBy: admin._id,
    },
    {
      title: 'Community Health & Nutrition Program',
      slug: 'community-health-nutrition-program',
      description: 'Addressing malnutrition and healthcare gaps in underserved communities through regular health camps, nutritional support for growing children, and free medical consultations.',
      shortDescription: 'Health camps and nutritional support for vulnerable families in underserved areas.',
      category: 'health',
      status: 'ongoing',
      visibility: 'published',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
      targetAmount: 30000,
      raisedAmount: 22000,
      beneficiaries: 350,
      startDate: new Date('2023-06-01'),
      location: 'Rural Areas',
      tags: ['health', 'nutrition', 'community'],
      isFeatured: false,
      createdBy: admin._id,
    },
    {
      title: 'Emergency Relief Fund',
      slug: 'emergency-relief-fund',
      description: 'When disaster strikes, families need immediate help. Our Emergency Relief Fund provides food, clothing, shelter assistance, and essential supplies to families affected by floods, fires, and other crises.',
      shortDescription: 'Rapid response aid for families affected by natural disasters and emergencies.',
      category: 'emergency',
      status: 'ongoing',
      visibility: 'published',
      image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800',
      targetAmount: 40000,
      raisedAmount: 28000,
      beneficiaries: 180,
      startDate: new Date('2022-01-01'),
      location: 'Nationwide',
      tags: ['emergency', 'relief', 'disaster'],
      isFeatured: true,
      createdBy: admin._id,
    },
    {
      title: 'Digital Literacy for Rural Youth',
      slug: 'digital-literacy-rural-youth',
      description: 'Bridging the digital divide by establishing computer labs in rural schools and providing hands-on training in basic computing, internet safety, and digital skills to prepare youth for the modern workforce.',
      shortDescription: 'Setting up computer labs and teaching digital skills to rural students.',
      category: 'education',
      status: 'completed',
      visibility: 'published',
      image: 'https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?w=800',
      targetAmount: 25000,
      raisedAmount: 25000,
      beneficiaries: 320,
      startDate: new Date('2022-06-01'),
      endDate: new Date('2023-12-31'),
      location: 'Rural Districts',
      tags: ['digital', 'technology', 'youth'],
      isFeatured: false,
      createdBy: admin._id,
    },
  ]);

  console.log(`📁 ${projects.length} projects created`);

  // Events
  const futureDate1 = new Date(); futureDate1.setDate(futureDate1.getDate() + 30);
  const futureDate2 = new Date(); futureDate2.setDate(futureDate2.getDate() + 60);
  const futureDate3 = new Date(); futureDate3.setDate(futureDate3.getDate() + 90);
  const pastDate = new Date(); pastDate.setDate(pastDate.getDate() - 30);

  const events = await Event.insertMany([
    {
      title: 'Annual Charity Gala 2024',
      slug: 'annual-charity-gala-2024',
      description: 'Join us for an evening of inspiration, celebration, and giving. This flagship fundraising event brings together donors, volunteers, and community leaders to celebrate our impact and raise funds for the coming year.',
      shortDescription: 'An elegant evening fundraiser celebrating our community impact and raising funds for education.',
      category: 'fundraiser',
      status: 'upcoming',
      visibility: 'published',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
      startDate: futureDate1,
      startTime: '6:00 PM',
      endTime: '10:00 PM',
      venue: 'Grand Ballroom, City Convention Center',
      location: 'Downtown',
      maxAttendees: 300,
      registeredAttendees: 187,
      isRegistrationOpen: true,
      isFree: false,
      ticketPrice: 75,
      organizer: 'NGO Events Committee',
      tags: ['gala', 'fundraiser', 'annual'],
      isFeatured: true,
      createdBy: admin._id,
    },
    {
      title: 'Back to School Supply Distribution',
      slug: 'back-to-school-supply-distribution',
      description: 'Help us distribute school supplies to 500+ students in need. Volunteers are welcome to join. Supplies include backpacks, notebooks, stationery sets, and more.',
      shortDescription: 'Community event distributing school supplies to 500+ students in our district.',
      category: 'community',
      status: 'upcoming',
      visibility: 'published',
      image: 'https://images.unsplash.com/photo-1596495577886-d920f1fb7238?w=800',
      startDate: futureDate2,
      startTime: '9:00 AM',
      endTime: '3:00 PM',
      venue: 'Community Sports Ground',
      location: 'East District',
      maxAttendees: 100,
      registeredAttendees: 45,
      isRegistrationOpen: true,
      isFree: true,
      organizer: 'Volunteer Team',
      tags: ['supplies', 'children', 'community'],
      isFeatured: true,
      createdBy: admin._id,
    },
    {
      title: 'Mental Health Awareness Workshop',
      slug: 'mental-health-awareness-workshop',
      description: 'A comprehensive workshop for parents, teachers, and youth on recognizing and addressing mental health challenges. Led by certified counselors and mental health professionals.',
      shortDescription: 'Free workshop on mental health awareness for parents, teachers, and youth.',
      category: 'awareness',
      status: 'upcoming',
      visibility: 'published',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800',
      startDate: futureDate3,
      startTime: '10:00 AM',
      endTime: '4:00 PM',
      venue: 'Community Hall',
      location: 'City Center',
      maxAttendees: 80,
      registeredAttendees: 31,
      isRegistrationOpen: true,
      isFree: true,
      organizer: 'Health & Wellness Team',
      tags: ['health', 'mental health', 'workshop'],
      isFeatured: false,
      createdBy: admin._id,
    },
    {
      title: 'Year-End Volunteer Appreciation Night',
      slug: 'year-end-volunteer-appreciation-night',
      description: 'A heartfelt evening to celebrate and honor our dedicated volunteers who have given their time and energy throughout the year. Awards, speeches, and community fellowship.',
      shortDescription: 'Celebrating our incredible volunteers with awards and community fellowship.',
      category: 'celebration',
      status: 'completed',
      visibility: 'published',
      image: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800',
      startDate: pastDate,
      venue: 'NGO Main Hall',
      location: 'NGO Headquarters',
      isFree: true,
      organizer: 'NGO Leadership',
      tags: ['volunteers', 'appreciation', 'community'],
      isFeatured: false,
      createdBy: admin._id,
    },
  ]);

  console.log(`📅 ${events.length} events created`);

  // News
  const news = await News.insertMany([
    {
      title: 'NGO Launches New Scholarship for 50 Students This Academic Year',
      slug: 'ngo-launches-new-scholarship-50-students',
      content: `<p>We are proud to announce the expansion of our Bright Futures Scholarship Program, which will now support <strong>50 students</strong> in the upcoming academic year — our largest cohort yet.</p><p>The scholarship covers full tuition, textbooks, and a monthly living stipend. Recipients are selected based on academic merit and demonstrated financial need.</p><p>"Education is the most powerful tool we have to break the cycle of poverty," said our Executive Director. "Each scholarship represents a life transformed and a community uplifted."</p><p>Applications are now open. Eligible students must maintain a minimum GPA of 3.0 and demonstrate financial need. The deadline for applications is the 30th of this month.</p>`,
      excerpt: 'Our scholarship program expands to support 50 students this year — the largest cohort in our organization\'s history.',
      category: 'announcement',
      status: 'published',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
      tags: ['scholarship', 'education', 'students'],
      isFeatured: true,
      publishedAt: new Date(),
      author: admin._id,
    },
    {
      title: 'Over 1,200 Students Receive School Supplies in Annual Drive',
      slug: 'over-1200-students-receive-school-supplies-annual-drive',
      content: `<p>Last weekend's School Supplies Distribution Drive was an overwhelming success. Over <strong>1,200 students</strong> from 14 schools across our region received complete supply kits, including backpacks, notebooks, pens, geometry sets, and art materials.</p><p>More than 80 volunteers participated in packing and distributing the supplies. The event ran smoothly thanks to the tireless efforts of our community partners and donors.</p><p>One teacher described it as "the most organized and heartfelt event I've seen in years." Many parents arrived early, grateful for the support that would ease their financial burden at the start of the school year.</p>`,
      excerpt: 'More than 1,200 students received complete supply kits in our biggest distribution drive yet, supported by 80 volunteers.',
      category: 'news',
      status: 'published',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
      tags: ['supplies', 'education', 'community'],
      isFeatured: true,
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      author: admin._id,
    },
    {
      title: 'Partnership with City Hospital Brings Free Health Camps to 5 Villages',
      slug: 'partnership-city-hospital-free-health-camps-villages',
      content: `<p>We are thrilled to announce a new partnership with City General Hospital to deliver free health camps to five underserved villages over the next six months. Each camp will offer general checkups, blood pressure monitoring, diabetes screening, eye exams, and basic dental checks.</p><p>Families who have gone years without access to medical care will now receive attention from licensed doctors and nurses. Medicines will be provided free of charge to those diagnosed during the camps.</p><p>This initiative is funded entirely through our Community Health Fund, supported by generous donors and corporate partners.</p>`,
      excerpt: 'A new partnership delivers free comprehensive medical camps to five villages, reaching families who rarely access healthcare.',
      category: 'news',
      status: 'published',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
      tags: ['health', 'partnership', 'community'],
      isFeatured: false,
      publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      author: admin._id,
    },
    {
      title: 'Volunteer of the Month: Priya Sharma\'s 500 Hours of Service',
      slug: 'volunteer-month-priya-sharma-500-hours',
      content: `<p>This month, we celebrate <strong>Priya Sharma</strong>, a dedicated volunteer who has quietly and consistently given over 500 hours of her time to our organization over the past two years. Priya coordinates our tutoring program every Saturday, helping dozens of students catch up on math and science.</p><p>"I was once a child who needed help," Priya shared. "Now I can give back in the way people gave to me. It's the most fulfilling thing I do."</p><p>Priya works as a software engineer during the week and volunteers every weekend. Her commitment exemplifies the spirit that makes our community stronger.</p>`,
      excerpt: 'Spotlight on Priya Sharma, whose 500 volunteer hours have transformed our Saturday tutoring program.',
      category: 'blog',
      status: 'published',
      image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800',
      tags: ['volunteer', 'community', 'spotlight'],
      isFeatured: false,
      publishedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
      author: admin._id,
    },
  ]);

  console.log(`📰 ${news.length} news articles created`);

  // Team Members
  const team = await TeamMember.insertMany([
    {
      name: 'Dr. Amara Osei',
      designation: 'Executive Director',
      department: 'leadership',
      bio: 'Dr. Osei has dedicated over 20 years to community development and social welfare. With a PhD in Social Policy, she leads our organization with vision, compassion, and strategic clarity.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
      email: 'amara@ngo.org',
      social: { linkedin: '#', twitter: '#' },
      status: 'active',
      sortOrder: 1,
      joinedYear: 2010,
    },
    {
      name: 'James Kofi Mensah',
      designation: 'Programs Director',
      department: 'leadership',
      bio: 'James oversees all NGO programs, ensuring they align with our mission and create measurable impact. His background in international development brings a global perspective to local challenges.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      email: 'james@ngo.org',
      social: { linkedin: '#' },
      status: 'active',
      sortOrder: 2,
      joinedYear: 2013,
    },
    {
      name: 'Sarah Nkrumah',
      designation: 'Education Coordinator',
      department: 'education',
      bio: 'Sarah manages all education initiatives including our scholarship program, tutoring centers, and school supply drives. Former teacher with 10 years of classroom experience.',
      avatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400',
      email: 'sarah@ngo.org',
      social: { linkedin: '#', twitter: '#' },
      status: 'active',
      sortOrder: 3,
      joinedYear: 2016,
    },
    {
      name: 'Emmanuel Asante',
      designation: 'Finance Manager',
      department: 'finance',
      bio: 'Emmanuel ensures financial transparency and accountability across all our programs. A certified accountant, he manages donor funds with the highest standards of integrity.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      email: 'emmanuel@ngo.org',
      social: { linkedin: '#' },
      status: 'active',
      sortOrder: 4,
      joinedYear: 2018,
    },
    {
      name: 'Fatima Al-Hassan',
      designation: 'Community Outreach Lead',
      department: 'community',
      bio: 'Fatima bridges the gap between our organization and the communities we serve. She coordinates field activities, volunteer programs, and local partnerships.',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
      email: 'fatima@ngo.org',
      social: { linkedin: '#', twitter: '#' },
      status: 'active',
      sortOrder: 5,
      joinedYear: 2019,
    },
    {
      name: 'David Tetteh',
      designation: 'Communications Officer',
      department: 'communications',
      bio: 'David tells our stories through compelling content, social media, and media relations. He is passionate about using communications as a tool for social change.',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
      email: 'david@ngo.org',
      social: { linkedin: '#', twitter: '#' },
      status: 'active',
      sortOrder: 6,
      joinedYear: 2020,
    },
  ]);

  console.log(`👥 ${team.length} team members created`);

  // Testimonials
  await Testimonial.insertMany([
    {
      name: 'Kwame Adjei',
      designation: 'Scholarship Recipient, 2021',
      content: 'Before the scholarship, I had almost given up on my dream of becoming an engineer. Today I am in my third year of university, and I owe it all to this incredible organization. They didn\'t just give me money — they gave me a future.',
      avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=400',
      rating: 5,
      category: 'beneficiary',
      status: 'published',
      isFeatured: true,
      sortOrder: 1,
    },
    {
      name: 'Margaret Oppong',
      designation: 'Parent, East District',
      content: 'When my husband lost his job, I didn\'t know how I would buy school supplies for my three children. The NGO\'s supply drive saved us that year. My children went to school smiling with brand new backpacks. I cried with gratitude.',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
      rating: 5,
      category: 'beneficiary',
      status: 'published',
      isFeatured: true,
      sortOrder: 2,
    },
    {
      name: 'Robert Chen',
      designation: 'Corporate Donor',
      content: 'We\'ve partnered with this NGO for three years now. The transparency, the impact reports, the field visits — everything builds confidence that our donations are making a real difference. Proud to be a partner.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      rating: 5,
      category: 'donor',
      status: 'published',
      isFeatured: true,
      sortOrder: 3,
    },
    {
      name: 'Aisha Konteh',
      designation: 'Volunteer since 2020',
      content: 'Volunteering here changed my life more than I changed others. I came expecting to give, and I left enriched by the resilience and joy of the communities we serve. Every Saturday is the best day of my week.',
      avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400',
      rating: 5,
      category: 'volunteer',
      status: 'published',
      isFeatured: true,
      sortOrder: 4,
    },
  ]);

  console.log('💬 Testimonials created');

  // FAQs
  await FAQ.insertMany([
    {
      question: 'How is my donation used?',
      answer: '100% of public donations go directly to our programs. Administrative costs are covered by institutional grants. We publish annual financial reports for full transparency.',
      category: 'donation',
      status: 'published',
      sortOrder: 1,
    },
    {
      question: 'Can I donate to a specific project?',
      answer: 'Yes! On our donation page, you can choose to direct your funds to a specific project like Education, Emergency Relief, or Scholarships.',
      category: 'donation',
      status: 'published',
      sortOrder: 2,
    },
    {
      question: 'How do I apply to volunteer?',
      answer: 'Visit our Volunteer page and fill out the application form. Our coordinator will review your application within 3–5 business days and contact you with next steps.',
      category: 'volunteer',
      status: 'published',
      sortOrder: 3,
    },
    {
      question: 'What volunteer opportunities are available?',
      answer: 'We offer opportunities in tutoring, event support, administrative work, health camps, community outreach, digital marketing, and more. Skills of all kinds are welcome.',
      category: 'volunteer',
      status: 'published',
      sortOrder: 4,
    },
    {
      question: 'How can my company partner with your NGO?',
      answer: 'We welcome corporate partnerships through sponsorships, employee volunteering, in-kind donations, and co-branded campaigns. Contact us at partnerships@ngo.org.',
      category: 'general',
      status: 'published',
      sortOrder: 5,
    },
    {
      question: 'How do I apply for a scholarship?',
      answer: 'Scholarship applications open at the start of each academic year. Visit our Projects page for the Scholarship Program, download the application form, and submit it with required documents before the deadline.',
      category: 'general',
      status: 'published',
      sortOrder: 6,
    },
    {
      question: 'Are donations tax-deductible?',
      answer: 'We are a registered non-profit organization. Donations may be tax-deductible depending on your country of residence. Please consult your tax advisor for specifics.',
      category: 'donation',
      status: 'published',
      sortOrder: 7,
    },
    {
      question: 'How can I stay updated on your work?',
      answer: 'Follow us on social media, subscribe to our newsletter via the footer form, and check our News & Events pages regularly for the latest updates.',
      category: 'general',
      status: 'published',
      sortOrder: 8,
    },
  ]);

  console.log('❓ FAQs created');

  // Success Stories
  await SuccessStory.insertMany([
    {
      title: 'From Dropout to Engineer: Kwame\'s Journey',
      slug: 'from-dropout-to-engineer-kwame-journey',
      personName: 'Kwame Adjei',
      age: 22,
      location: 'North District',
      story: '<p>Kwame was 16 when his father passed away, forcing his family into financial crisis. Despite being one of the top students in his school, he had no path to continue his education. He was three days from dropping out permanently when a teacher referred him to our scholarship program.</p><p>Four years later, Kwame is in his final year of Electrical Engineering at the national university. He volunteers every school holiday as a tutor for younger students in his community — giving back exactly what was given to him.</p><p>"I used to think education was not for people like me," Kwame says. "Now I know that the only limit is opportunity — and this NGO made sure I had mine."</p>',
      excerpt: 'Facing dropout at 16 after his father\'s passing, Kwame received our scholarship and is now weeks away from graduating as an electrical engineer.',
      image: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=800',
      category: 'scholarship',
      status: 'published',
      isFeatured: true,
      relatedProject: projects[0]._id,
      createdBy: admin._id,
    },
    {
      title: 'A Second Chance: How Emergency Aid Kept a Family Together',
      slug: 'second-chance-emergency-aid-family',
      personName: 'The Mensah Family',
      location: 'Riverside Community',
      story: '<p>In September, devastating floods swept through the Riverside area, destroying homes and livelihoods. The Mensah family — a mother, father, and four children — lost everything. Their home, their shop, their savings.</p><p>Within 48 hours of the disaster, our Emergency Relief team was on the ground. We provided the family with emergency food packages, temporary shelter assistance, and replacement clothing. Over the following weeks, we helped them access government relief programs and provided a small business restart grant.</p><p>Eight months later, Mr. Mensah has rebuilt his small provisions shop. The children are back in school with full supply kits. "We thought our lives were over," Mrs. Mensah said. "But we were never alone."</p>',
      excerpt: 'When floods destroyed everything the Mensah family owned, our Emergency Relief Fund helped them rebuild from nothing — in less than a year.',
      image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800',
      category: 'emergency',
      status: 'published',
      isFeatured: true,
      relatedProject: projects[3]._id,
      createdBy: admin._id,
    },
    {
      title: 'Learning to Code at 14: Ama\'s Digital Future',
      slug: 'learning-to-code-ama-digital-future',
      personName: 'Ama Boateng',
      age: 15,
      location: 'Rural West District',
      story: '<p>Before our Digital Literacy Program set up a computer lab at her school, 14-year-old Ama had never touched a computer. She grew up in a village where electricity was intermittent and smartphones were luxury items.</p><p>In her first class, she was nervous. By her third class, she had outpaced most of her peers in typing speed. By the end of the three-month program, Ama had built her first basic website — a simple page showcasing her school\'s achievements.</p><p>"I want to create apps that help farmers," she told us. With the digital foundation our program gave her, that dream is entirely within reach. Ama has now been accepted into a secondary school with a strong technology track.</p>',
      excerpt: 'Ama had never touched a computer before our Digital Literacy Program. Now she\'s building websites and dreaming of becoming a tech entrepreneur.',
      image: 'https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?w=800',
      category: 'education',
      status: 'published',
      isFeatured: false,
      relatedProject: projects[4]._id,
      createdBy: admin._id,
    },
  ]);

  console.log('⭐ Success stories created');

  // Gallery
  await Gallery.insertMany([
    { title: 'Scholarship Award Ceremony 2023', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600', category: 'events', status: 'published', isFeatured: true, sortOrder: 1, uploadedBy: admin._id },
    { title: 'School Supply Distribution Day', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600', category: 'events', status: 'published', isFeatured: true, sortOrder: 2, uploadedBy: admin._id },
    { title: 'Community Health Camp', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600', category: 'community', status: 'published', isFeatured: true, sortOrder: 3, uploadedBy: admin._id },
    { title: 'Digital Literacy Class', image: 'https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?w=600', category: 'education', status: 'published', isFeatured: false, sortOrder: 4, uploadedBy: admin._id },
    { title: 'Volunteer Team Photo', image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600', category: 'team', status: 'published', isFeatured: true, sortOrder: 5, uploadedBy: admin._id },
    { title: 'Annual Charity Gala', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600', category: 'events', status: 'published', isFeatured: false, sortOrder: 6, uploadedBy: admin._id },
    { title: 'Emergency Relief Distribution', image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600', category: 'community', status: 'published', isFeatured: false, sortOrder: 7, uploadedBy: admin._id },
    { title: 'Children Receiving Supplies', image: 'https://images.unsplash.com/photo-1596495577886-d920f1fb7238?w=600', category: 'education', status: 'published', isFeatured: true, sortOrder: 8, uploadedBy: admin._id },
  ]);

  console.log('🖼️  Gallery images created');

  // Donations (sample)
  await Donation.insertMany([
    { donorName: 'Anonymous', donorEmail: 'anon1@example.com', amount: 500, purpose: 'education', status: 'completed', isAnonymous: true },
    { donorName: 'Robert Chen', donorEmail: 'robert@example.com', amount: 1000, purpose: 'scholarship', status: 'completed', message: 'Keep up the amazing work!' },
    { donorName: 'Grace Williams', donorEmail: 'grace@example.com', amount: 250, purpose: 'emergency', status: 'completed' },
    { donorName: 'Tech Corp Ltd', donorEmail: 'csr@techcorp.com', amount: 5000, purpose: 'general', status: 'completed', message: 'Proud to support this mission.' },
    { donorName: 'Ama Darko', donorEmail: 'ama@example.com', amount: 100, purpose: 'supplies', status: 'completed' },
  ]);

  console.log('💰 Sample donations created');

  // Volunteers (sample)
  await Volunteer.insertMany([
    { name: 'Priya Sharma', email: 'priya@example.com', phone: '+1234567890', city: 'Downtown', occupation: 'Software Engineer', skills: ['Teaching', 'Web Development', 'Communication'], availability: 'weekends', hoursPerWeek: 4, status: 'approved', joinedDate: new Date('2022-03-01') },
    { name: 'John Mensah', email: 'john@example.com', phone: '+1234567891', city: 'East District', occupation: 'Doctor', skills: ['Medical', 'First Aid', 'Counseling'], availability: 'weekends', hoursPerWeek: 6, status: 'approved', joinedDate: new Date('2021-06-15') },
    { name: 'Fatima Baraka', email: 'fatima.b@example.com', phone: '+1234567892', city: 'North Side', occupation: 'Teacher', skills: ['Teaching', 'Mentoring', 'Administration'], availability: 'both', hoursPerWeek: 8, status: 'pending' },
  ]);

  console.log('🙋 Volunteers created');

  // Settings
  await Settings.insertMany([
    { key: 'org_name', value: 'Anpuneri', type: 'string', group: 'general', label: 'Organization Name', isPublic: true },
    { key: 'org_tagline', value: 'Empowering Communities, Transforming Lives', type: 'string', group: 'general', label: 'Tagline', isPublic: true },
    { key: 'org_email', value: 'info@ngo.org', type: 'string', group: 'contact', label: 'Email', isPublic: true },
    { key: 'org_phone', value: '+1 (555) 123-4567', type: 'string', group: 'contact', label: 'Phone', isPublic: true },
    { key: 'org_address', value: '123 Community Lane, Hope District, City 10001', type: 'string', group: 'contact', label: 'Address', isPublic: true },
    { key: 'social_facebook', value: 'https://facebook.com/ngodemo', type: 'string', group: 'social', label: 'Facebook URL', isPublic: true },
    { key: 'social_twitter', value: 'https://twitter.com/ngodemo', type: 'string', group: 'social', label: 'Twitter URL', isPublic: true },
    { key: 'social_instagram', value: 'https://instagram.com/ngodemo', type: 'string', group: 'social', label: 'Instagram URL', isPublic: true },
    { key: 'social_linkedin', value: 'https://linkedin.com/company/ngodemo', type: 'string', group: 'social', label: 'LinkedIn URL', isPublic: true },
    { key: 'stat_students_helped', value: 1250, type: 'number', group: 'stats', label: 'Students Helped', isPublic: true },
    { key: 'stat_families_supported', value: 520, type: 'number', group: 'stats', label: 'Families Supported', isPublic: true },
    { key: 'stat_volunteers', value: 180, type: 'number', group: 'stats', label: 'Active Volunteers', isPublic: true },
    { key: 'stat_projects_completed', value: 24, type: 'number', group: 'stats', label: 'Projects Completed', isPublic: true },
  ]);

  console.log('⚙️  Settings seeded');

  console.log('\n✅ Database seeded successfully!');
  console.log(`📧 Admin Email: ${admin.email}`);
  console.log(`🔑 Admin Password: ${process.env.ADMIN_PASSWORD || 'Admin@123456'}`);

  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Seeder error:', err);
  process.exit(1);
});
