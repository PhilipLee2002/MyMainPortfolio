import type { Project, ProjectStage } from '@/types';

export const PROJECT_STAGES: { id: ProjectStage; label: string }[] = [
  { id: 'deployed', label: 'Completed and deployed' },
  { id: 'ready', label: 'Complete, not deployed yet' },
  { id: 'progress', label: 'Works in progress' },
  { id: 'planning', label: 'Works under planning' },
];

export const FRACA_SITE: Project = {
  id: 'fraca-site',
  title: 'FRACA SERVCOM Website',
  category: 'Client website',
  stage: 'deployed',
  tagline: 'A live catalogue site for a furniture and bags business operating since 2001.',
  status: 'Live — Phase 2 in development',
  href: 'https://fracaservcom.co.ke',
  problem:
    'The business had an outdated website that no longer rendered properly, and effectively no online presence — despite two decades of trading and customers across Nairobi, Mombasa and Kisumu.',
  contributionLabel: 'What I built',
  contribution:
    'A minimalistic catalogue site covering furniture, church seating and bags, designed to read clearly to both older and younger clients. The site presents over 430 photographed furniture items alongside a dedicated bags collection, and routes every inquiry to WhatsApp or a working contact form.',
  highlights: [
    'Custom contact API with validation, spam checks and email delivery, replacing a broken placeholder form',
    'WhatsApp inquiry links that open the exact product, so staff see the specific item rather than guessing from a name',
    'Catalogue-wide product search, consistent across every page',
    'Bag pricing applied from the official supplier list',
    'Brand mark rebuilt with true transparency for the header and favicon',
    '456 product photographs renamed to match their display titles, making future updates far easier',
  ],
  note: {
    label: 'Phase 2 — in development',
    body: 'An e-commerce layer that lets the shop add and remove products directly, with an in-stock or out-of-stock marker on every item so visitors can see availability at a glance. Cart, checkout and payment integration are scoped for Phase 3, after the staff system is approved for daily use.',
  },
  techStack: ['HTML', 'CSS', 'vanilla JavaScript', 'Node serverless functions (Vercel)', 'Resend'],
  pointTo:
    'Building the shop as a continuation of the same system rather than a standalone store. A separate e-commerce build would have launched faster and created a second place where stock and prices live. Integrating instead means one source of truth — which is why the staff system had to be trustworthy before the shop could sell anything.',
  images: [
    {
      src: '/work/fraca-site-homepage.png',
      label: 'Homepage',
      alt: 'Fraca Servcom homepage, with the dining set hero',
    },
    {
      src: '/work/fraca-site-featured.png',
      label: 'Featured furniture',
      alt: 'Featured furniture categories: chairs, beds, dining sets and coffee tables',
    },
    {
      src: '/work/fraca-site-catalogue.png',
      label: 'Furniture catalogue',
      alt: 'Furniture catalogue with chair prices and inquire links',
    },
    {
      src: '/work/fraca-site-inquiry.png',
      label: 'WhatsApp inquiry',
      alt: 'WhatsApp message asking about Antique High Back Chair 1',
    },
  ],
  imageNotes: [],
  imagePlaceholderType: 'gallery',
};

export const DASHING_TATA: Project = {
  id: 'dashing-tata',
  title: 'Dashing Tata',
  category: 'Shop website',
  stage: 'ready',
  tagline: 'A Kenyan shopfront for clothes, shoes, and bags. Pick a piece, then send the order into WhatsApp.',
  status: 'Built — orders open in WhatsApp',
  problem:
    'The shop needed people to order a specific photographed piece, in a size, and say how they would pay. An account and an online checkout were the wrong first step for that.',
  contributionLabel: 'What I built',
  contribution:
    'A dark shopfront. The top of the page introduces the shop and a couple of pieces. The collection is a searchable grid, filtered by who the piece is for and by clothes, shoes, or bags. A product page puts the photos beside the order: size, quantity, Vooma Till or M-Pesa Paybill, an optional note, and a button that opens the shop’s WhatsApp chat with that order already written.',
  highlights: [
    'Real photos and KSh prices. No account, and no card checkout',
    'Search, then filter by women, men, unisex, or kids, and by clothes, shoes, or bags',
    'The WhatsApp message names the piece, the size, the quantity, and how the customer will pay',
    'The shop confirms the item in that chat. Payment is by Vooma or M-Pesa, and pickup or delivery stays in the same thread',
  ],
  note: {
    label: 'What comes later',
    body: 'M-Pesa Daraja, once there is steady traffic. Until then the customer pays the till or paybill shown on the page, and the shop checks the message before releasing the piece.',
  },
  techStack: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Supabase'],
  pointTo:
    'The order is a message, not a checkout. Someone can name the exact shoe, the size, and Vooma or M-Pesa before a payment API exists. Daraja is the next step, not the first one.',
  images: [
    {
      src: '/work/dashing-tata-home.png',
      label: 'Shopfront',
      alt: 'Dashing Tata homepage, with the shop introduction and two featured shoes priced in Kenyan shillings',
    },
    {
      src: '/work/dashing-tata-collection.png',
      label: 'Collection',
      alt: 'Searchable collection of shoes, with filters for who the piece is for and for clothes, shoes, or bags',
    },
    {
      src: '/work/dashing-tata-product.png',
      label: 'Order',
      alt: 'Air Jordan product page with photos, EU sizes, quantity, Vooma Till, M-Pesa Paybill, and send order on WhatsApp',
    },
  ],
  imageNotes: [],
  imagePlaceholderType: 'gallery',
};

export const LASHED_BY_LORAH: Project = {
  id: 'lashed-by-lorah',
  title: 'Lashed by Lorah',
  category: 'Booking site',
  stage: 'ready',
  tagline:
    'A one-page site for a lash and waxing practice in Nairobi. Services, prices, and how to book, before it goes live.',
  status: 'Built — not deployed yet',
  problem:
    'People who find her on Instagram or by word of mouth still have to call to learn what she does, what it costs, where she works, and how to book.',
  contributionLabel: 'What I built',
  contribution:
    'A quiet single page for my cousin’s practice. White background, soft lavender bands, and one deep purple for the bar, buttons, and prices. The menu covers classic, hybrid, and volume sets, fills, removal, a lash bath, and waxing from brows to a Brazilian, with the price and the time next to each service. A short bio, her certifications, and a gallery sit beside that list. Booking is a request, not a live calendar: name, email, phone, service, a preferred date, and a note. Call and WhatsApp sit next to the form.',
  highlights: [
    'Sticky navigation, and a hero with two paths: book, or browse the services',
    'Featured service cards, the full menu, and a pricing table split into lashes and waxing, with care notes',
    'About section with her portrait, five years of experience, certifications, and a short philosophy',
    'Gallery with hover labels and a lightbox, and client quotes that advance on their own',
    'The form checks required fields and shows a thank-you state. It does not send mail yet',
  ],
  note: {
    label: 'At launch',
    body: 'The form can be wired to email or a form service without changing the layout. There is no backend and no build step, so the page can go live as soon as she is ready.',
  },
  techStack: ['HTML', 'Tailwind CSS', 'vanilla JavaScript', 'Font Awesome', 'AOS'],
  pointTo:
    'Four answers on one screen: what she does, what it costs, where she works, and how to book. She works from Carey Spa, Uniafric House, on Koinange Street. Most of her clients will still reach her on WhatsApp, so that path is the obvious one.',
  images: [
    {
      src: '/work/lashed-by-lorah-services.png',
      label: 'Services',
      alt: 'Lashed by Lorah service cards for classic, hybrid, and volume sets, with prices in Kenyan shillings and how long each takes',
    },
    {
      src: '/work/lashed-by-lorah-about.png',
      label: 'About',
      alt: 'Portrait of Lorah beside a short bio, her certifications, and a note on her approach to beauty',
    },
    {
      src: '/work/lashed-by-lorah-booking.png',
      label: 'Booking',
      alt: 'Booking section with the Carey Spa address, phone, WhatsApp, Instagram, hours, and an appointment request form',
    },
  ],
  imageNotes: [],
  imagePlaceholderType: 'gallery',
};

export const FRACA_INVENTORY: Project = {
  id: 'fraca-inventory',
  title: 'Inventory Management System — FRACA SERVCOM',
  category: 'Staff system',
  stage: 'ready',
  tagline: 'A private shop system for sales, stock, purchasing and daily totals.',
  status: 'Ready for review — board presentation pending',
  problem:
    "The shop could sell from a public catalogue, but a day's takings still lived on paper. There was no single source of truth for what sold, what left the store, or what the accountant could total at the end of the day.",
  contributionLabel: 'What I built',
  contribution:
    'A staff-facing system that separates selling from accounting from stock management, with permissions enforced on the server rather than hidden in the menu.',
  highlights: [
    'Sales saved as pending keep their stock; completing a sale deducts it and prints an A4 invoice',
    'The system refuses a sale for more than is on hand',
    'Purchases only add stock once marked received',
    'Daily, weekly, monthly and yearly reports, including which products actually sold',
    'Payment totals split by cash, M-Pesa, bank and cheque',
    'Stock adjustments carry a full audit trail',
    'Products published to the public website share only name, size, selling price and photos — never cost or stock',
    'Reception can sell without seeing cost margins; inventory manages stock without seeing profit; the head of company manages accounts',
  ],
  note: {
    label: 'Known limitations',
    body: 'Many quantities and costs are still being entered. The database sits in Europe, so every screen pays for the distance.',
  },
  techStack: [
    'Laravel 12',
    'PHP',
    'MySQL',
    'Bootstrap 5',
    'vanilla ES6 modules',
    'Axios',
    'Vite',
    'PHPUnit',
  ],
  pointTo:
    "Job titles are not permissions. My first pass blocked the accountant from the morning totals while inventory could still see the day's takings — because I trusted role names instead of checking the permission on every screen. That one bug reshaped how the whole system handles access.",
  images: [
    {
      src: '/work/fraca-inventory-dashboard.png',
      label: 'Dashboard',
      alt: 'Staff dashboard with product totals, today’s sales and payment breakdown',
    },
    {
      src: '/work/fraca-inventory-sales.png',
      label: 'Sales',
      alt: 'Sales screen with the invoice list',
    },
    {
      src: '/work/fraca-inventory-furniture.png',
      label: 'Furniture',
      alt: 'Furniture list with stock quantity and selling price',
    },
  ],
  imageNotes: [],
  imagePlaceholderType: 'gallery',
};

export const ASSET_MANAGEMENT: Project = {
  id: 'brs-assets',
  title: 'Asset Management System — Business Registration Service',
  category: 'System design',
  stage: 'ready',
  tagline:
    'System design for an organisational asset management system, developed during a five-month attachment.',
  status: 'Completed — organisational project',
  role: 'System design and interface prototyping',
  problem:
    "The IT team needed a structured way to track organisational assets, and the existing approach didn't hold up.",
  contributionLabel: 'My contribution',
  contribution:
    'I worked on how the system should work end to end. That meant studying how comparable asset management systems were structured, comparing what each did well and where each fell short, and shaping a design that drew the strongest attributes from several existing systems rather than copying one model outright. I also produced interface prototypes in Figma and Adobe Illustrator.',
  highlights: [],
  techStack: ['System design', 'comparative analysis', 'Figma', 'Adobe Illustrator'],
  pointTo:
    "The comparative approach. Rather than designing from a blank page, I mapped several existing systems against each other first and used the differences to justify each design decision. That's where I learned to argue for a structure instead of just picking one.",
  imageNotes: [],
  imagePlaceholderType: 'gallery',
};

export const NOVA: Project = {
  id: 'nova',
  title: 'Nova',
  category: 'Personal tool',
  stage: 'progress',
  tagline: 'A private, offline AI assistant that runs in the terminal.',
  status: 'Working — in daily personal use',
  problem:
    "Cloud AI agents were either expensive, too heavy, or didn't integrate with my development environment. I wanted something free, lightweight and running locally.",
  contributionLabel: 'What I built',
  contribution:
    'A terminal-based assistant powered by a locally hosted model, with commands for reading files, writing files, deleting files, running terminal commands and listing project files — with confirmation prompts before anything destructive.',
  highlights: [
    'Runs entirely offline: no cloud cost, no data leaving the machine',
    'Global Python script that works across any project directory',
    'Used to scaffold a Laravel project, plan a feature build and manage dependencies',
  ],
  techStack: ['Python', 'LM Studio', 'Qwen2.5-Coder 1.5B'],
  pointTo:
    "Deleting files needed a confirmation step — not because the code was hard, but because I've learned what happens when automation is too eager. The interesting part of the build was making the tool trustworthy enough to actually use.",
  imageNotes: ['Terminal session showing a command and its response'],
  imagePlaceholderType: 'terminal',
};

export const VVENT: Project = {
  id: 'vvent',
  title: 'VVENT',
  category: 'Platform',
  stage: 'planning',
  tagline:
    'A platform for upcoming artists to be discovered, booked and paid — without needing a manager to open the door.',
  status: 'In development — early stage',
  problem:
    'New artists have talent and no route to the people who could move their careers forward. Getting seen, getting heard and getting a gig usually depend on knowing someone. Producers and event managers, meanwhile, are looking for new acts and have no good way to find them.',
  contributionLabel: "What I'm building",
  contribution:
    'A platform connecting those two sides. Artists get a place to be seen and heard. Producers and event managers get a way to discover them and book them directly. A ticketing hub sits alongside it, so an artist who lands a gig can sell tickets for it rather than sending people to a group chat.',
  highlights: [],
  note: {
    label: 'Where I am',
    body: "System design. Discovery, booking and ticketing solve related problems but carry very different technical demands, and I'm working out how they fit together without becoming three separate products pretending to be one.",
  },
  techStack: [],
  stackNote: 'To be confirmed as the build takes shape.',
  pointTo:
    'Treating ticketing as part of the platform rather than a separate tool. An artist who gets discovered, gets booked, and then can\'t sell tickets has only been helped two-thirds of the way. The interesting problem is making those three things feel like one experience.',
  imageNotes: ['Wireframes or flow diagrams'],
  imagePlaceholderType: 'gallery',
};

export const PLANPULSE: Project = {
  id: 'planpulse',
  title: 'PlanPulse',
  category: 'Civic product',
  stage: 'planning',
  tagline:
    'Checks whether a proposed block of flats can be carried by the local sewer, the soil, and the neighbours, before a county issues a building permit.',
  status: 'Planning',
  role: 'Team lead',
  problem:
    'Kenyan towns are approving taller buildings on pipes and plots that were built for houses. Neighbours usually hear about the building after construction starts.',
  contributionLabel: 'What it is meant to do',
  contribution:
    'A developer enters the plot, the floors, and the number of homes. PlanPulse checks water use, sewage, and stormwater, and flags the application if the pipe would go past 85% full. For 14 days it runs a public notice by site poster, SMS, and WhatsApp. The county planner sees the map and the objections. The county still approves or refuses the building.',
  highlights: [],
  note: {
    label: 'Where I am',
    body: 'I lead the work, across the screens, the capacity calculations, and the phone notice. The proposal and the technical specification are written. No application has been built yet. Two other developers are specifying it with me.',
  },
  techStack: ['React', 'TypeScript', 'FastAPI', 'Supabase', 'Leaflet'],
  stackNote: 'Specified, not built. Africa’s Talking would send the SMS and WhatsApp notice.',
  pointTo:
    'The county still issues the permit. PlanPulse only checks capacity and keeps the 14-day public notice in one record.',
  repoUrl: 'https://github.com/PhilipLee2002/PlanPulse',
  repoLabel: 'Proposal and specification',
  imageNotes: [],
  imagePlaceholderType: 'gallery',
};

export const PROJECTS: Project[] = PROJECT_STAGES.flatMap((stage) =>
  [
    FRACA_SITE,
    DASHING_TATA,
    LASHED_BY_LORAH,
    FRACA_INVENTORY,
    ASSET_MANAGEMENT,
    NOVA,
    VVENT,
    PLANPULSE,
  ].filter((project) => project.stage === stage.id),
);
