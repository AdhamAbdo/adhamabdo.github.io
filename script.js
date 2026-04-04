/* ============================================
   ADHAM ABDO PORTFOLIO — script.js
   Lightweight, zero dependencies, GitHub Pages ready
   ============================================ */

'use strict';

/* ---------- MOBILE HAMBURGER MENU ---------- */
const hamburger = document.getElementById('hamburger');
const navDrawer = document.getElementById('navDrawer');

function closeDrawer() {
  navDrawer.classList.remove('open');
}

hamburger.addEventListener('click', () => {
  navDrawer.classList.toggle('open');
});

/* ---------- SCROLL: progress bar + nav compact (merged into one listener) ---------- */
const progressBar = document.getElementById('progress');
const navbar = document.querySelector('nav');

window.addEventListener('scroll', () => {
  // Progress bar
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  progressBar.style.width = pct + '%';
  // Nav shrink
  navbar.classList.toggle('compact', window.scrollY > 60);
}, { passive: true });

/* ---------- THEME TOGGLE ---------- */
const themeBtn = document.getElementById('themeBtn');
const html = document.documentElement;

// Apply saved theme immediately on load
const savedTheme = localStorage.getItem('theme') || 'dark';
html.dataset.theme = savedTheme;
themeBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

themeBtn.addEventListener('click', () => {
  const next = html.dataset.theme === 'dark' ? 'light' : 'dark';
  html.dataset.theme = next;
  themeBtn.textContent = next === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('theme', next);
});

/* ---------- FADE-IN ON SCROLL (IntersectionObserver — no layout thrash) ---------- */
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      fadeObserver.unobserve(e.target); // fire once, then stop watching
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.fade').forEach(el => fadeObserver.observe(el));

/* ---------- COUNTER ANIMATION ---------- */
function animCount(el, target, duration = 1600) {
  let startTime = null;
  const step = (ts) => {
    if (!startTime) startTime = ts;
    const progress = Math.min((ts - startTime) / duration, 1);
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

// Observe all elements with data-target (hero spans + about stat cards)
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animCount(e.target, parseInt(e.target.dataset.target));
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

/* ---------- SKILL BARS (animate once on scroll into view) ---------- */
const skillSection = document.getElementById('skills');
let skillsAnimated = false;

if (skillSection) {
  new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !skillsAnimated) {
      skillsAnimated = true;
      document.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = bar.dataset.w + '%';
      });
    }
  }, { threshold: 0.2 }).observe(skillSection);
}

/* ---------- PROJECT FILTER ---------- */
const filterBtns = document.querySelectorAll('.filter-btn');
const projCards  = document.querySelectorAll('.proj-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('on'));
    btn.classList.add('on');
    const cat = btn.dataset.cat;
    projCards.forEach(card => {
      const match = cat === 'all' || card.dataset.cat.includes(cat);
      card.style.display = match ? '' : 'none';
    });
  });
});

/* ---------- TESTIMONIAL SLIDER ---------- */
let currentSlide = 0;
const track = document.getElementById('testiTrack');
const dots  = document.querySelectorAll('.sl-dot');
const totalSlides = dots.length;

function goTo(n) {
  currentSlide = (n + totalSlides) % totalSlides;
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  dots.forEach((d, i) => d.classList.toggle('on', i === currentSlide));
}

document.getElementById('slPrev').addEventListener('click', () => goTo(currentSlide - 1));
document.getElementById('slNext').addEventListener('click', () => goTo(currentSlide + 1));
dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));

// Auto-advance every 7 seconds
let autoSlide = setInterval(() => goTo(currentSlide + 1), 7000);

// Pause on hover
track.addEventListener('mouseenter', () => clearInterval(autoSlide));
track.addEventListener('mouseleave', () => {
  autoSlide = setInterval(() => goTo(currentSlide + 1), 7000);
});
/* ---------- PROJECT MODAL — Case Study ---------- */

const projects = [
  {
    title: "Army Sales Orders & Item Demand Analysis",
    tools: ["Power BI", "DAX", "Star Schema", "Supply Chain"],
    industry: "Defense / Government",
    problem: "The US Army procurement division lacked unified visibility into $24bn in sales. Data was fragmented across profit centers with no clear view of the growing fulfillment gap.",
    data: "605,000+ sales orders, 658M ordered units, and 209M shipped entries processed from government ERP systems over a 2-year period.",
    process: "Built a star schema in Power BI with custom DAX for YoY variance and profit center drill-throughs. Created a 'Sales vs. Orders' toggle to visualize demand spikes.",
    insights: "A critical fulfillment gap was identified: 193.82% YoY growth in ordered quantity vs. only 56.87% in shipped quantity. One profit center drove 58% ($14bn) of total revenue.",
    impact: [{ val: "$24bn", lbl: "Total Sales" }, { val: "193%", lbl: "Order Growth" }, { val: "56.8%", lbl: "Shipment Growth" }]
  },
  {
    title: "Labor Market Data — Saudi Arabia 2021–2024",
    tools: ["Power BI", "Geospatial Analysis", "Public Data"],
    industry: "Government / HR",
    problem: "Saudi agencies needed a national workforce view to monitor 'Saudization' and sector growth across different regions and occupations.",
    data: "188.4M cumulative workforce records covering Social Insurance (125.6M), Domestic Workers (46.6M), and Civil Service (16.2M).",
    process: "Integrated Bing Maps for regional density, built nationality distribution donuts (Saudi vs. Non-Saudi), and implemented top-N filters for occupational rankings.",
    insights: "Private sector dominates with 358.2M entries. The 35-39 age group is the largest demographic. 'Elementary Occupations' lead with 49.4M workers.",
    impact: [{ val: "188.4M", lbl: "Workforce Count" }, { val: "81.2%", lbl: "Non-Saudi Share" }, { val: "49.4M", lbl: "Top Job Segment" }]
  },
  {
    title: "HR Employee Attrition Analytics",
    tools: ["Power BI", "DAX", "People Analytics", "Python"],
    industry: "HR Analytics",
    problem: "A company faced a 16% attrition rate. Leadership needed to identify the core drivers of turnover and identify high-risk employee segments.",
    data: "1,470 employee records with 35+ variables including income, job satisfaction, commute distance, and manager tenure.",
    process: "Engineered 'Attrition Buckets' using DAX. Used Python integration for ML feature importance to highlight 'danger zones' in tenure and satisfaction scores.",
    insights: "The 20-34 age group represents 47.3% of attrition. Data showed a direct correlation between short manager tenure (0-3 years) and high employee turnover.",
    impact: [{ val: "16%", lbl: "Attrition Rate" }, { val: "47.3%", lbl: "Millennial Risk" }, { val: "165", lbl: "Manager Tenure Exit" }]
  },
  {
    title: "STAT — Supply Tracking & Analytics Tool",
    tools: ["Power BI", "Supply Chain", "KPI Engineering"],
    industry: "Defense Logistics",
    problem: "Supply managers lacked a real-time 'Control Center' to monitor the health and risk levels of 52K+ critical inventory items.",
    data: "52,120 items tracked. 43.66K healthy (84%), 3,309 on watchlist, and 5,153 at critical risk across 4 major supply chains.",
    process: "Developed a health-scoring algorithm in DAX to bin items. Built a dark-mode dashboard with drill-throughs for SOH (Stock on Hand) and demand metrics.",
    insights: "Medical and Subsistence chains were most stable, while Clothing & Textiles (C&T) carried the highest demand pressure (119M units).",
    impact: [{ val: "52.1K", lbl: "Items Scored" }, { val: "90.8%", lbl: "Avg Health" }, { val: "5,153", lbl: "Critical Risks" }]
  },
  {
    title: "Call Center Trends — PwC Case Study",
    tools: ["Power BI", "Operations", "CX Analytics"],
    industry: "Operations / Consulting",
    problem: "A PwC client needed to evaluate agent performance and customer satisfaction to resolve gaps in technical support and streaming topics.",
    data: "5,000 calls with metrics for answer speed, resolution (Y/N), and satisfaction ratings (1-5).",
    process: "Created a performance scorecard with gauges for satisfaction. Used conditional formatting in agent tables to highlight those below the 3.40 average.",
    insights: "81.1% answer rate vs. 72.9% resolution rate. Technical support had high volumes but lower satisfaction, indicating a need for specialized training.",
    impact: [{ val: "81.1%", lbl: "Answer Rate" }, { val: "3.40", lbl: "Avg Satisfaction" }, { val: "5,000", lbl: "Total Calls" }]
  },
  {
    title: "LinkedIn Jobs Market Analysis",
    tools: ["Power BI", "Python", "Market Research", "SQL"],
    industry: "Market Research",
    problem: "Identifying trends in the digital job market, specifically focusing on salary transparency and application-to-view ratios.",
    data: "16K job postings, 3K locations, 199K applications, and 1M views. Categorized by experience level and work type.",
    process: "Designed a brand-aligned UI. Visualized the dominance of 'Mid-Senior' roles and compared 'Simple' vs. 'Complex' application types via Python scraping.",
    insights: "Only 19.72% of job views converted to applications. Full-time roles make up 80.85% of the market, with Mid-Senior levels representing nearly half.",
    impact: [{ val: "16K", lbl: "Jobs Analyzed" }, { val: "1M", lbl: "Job Views" }, { val: "46.3%", lbl: "Mid-Senior Roles" }]
  },
  {
    title: "Tour de France Historical Stages",
    tools: ["Power BI", "Data Visualization", "Sports Analytics"],
    industry: "Sports / History",
    problem: "Cycling analysts needed a way to visualize over 100 years of race evolution and rider demographics in a single interactive dashboard.",
    data: "109 Tours, 1,607 stages, and 3,714 finishers spanning from 1903 to 2022.",
    process: "Created a 'Decade' slicer for historical navigation. Integrated a global map for finisher origins and trend lines for average speed evolution.",
    insights: "Average speed has increased significantly over a century. France, Belgium, and Spain remain the top 3 nations for stage winners and finishers.",
    impact: [{ val: "109", lbl: "Tours Tracked" }, { val: "1.6K", lbl: "Stages Mapped" }, { val: "34.5", lbl: "Avg Speed (km/h)" }]
  },
  {
    title: "National Grid SA — SCADA Monitoring",
    tools: ["Power BI", "Operations", "Utility Analytics"],
    industry: "Energy / Utilities",
    problem: "Monitoring work order health for SCADA systems, with a focus on data quality and documentation completeness.",
    data: "439 active work orders (46% open, 54% closed). Quality metrics for missing asset numbers and labor hour accuracy.",
    process: "Built a bilingual (Arabic/English) dashboard. Used donut charts for data quality gaps and gauges for the 50% quality threshold.",
    insights: "A critical 50% data gap was found in missing asset numbers. However, 99% of work orders were correctly linked with material costs.",
    impact: [{ val: "439", lbl: "Work Orders" }, { val: "50%", lbl: "Quality Score" }, { val: "99%", lbl: "Cost Accuracy" }]
  },
  {
    title: "Jeddah Municipality — Recycling Revenue",
    tools: ["Power BI", "Environmental Analytics", "Arabic RTL"],
    industry: "Government / Environment",
    problem: "Tracking financial returns and processed quantities for a recycling initiative involving multiple contractors and materials.",
    data: "2.73M SAR total return from 9,091 tons of recycled metal, plastic, and cardboard over 7 months.",
    process: "Implemented contractor-level drill-downs and a dual-view toggle for 'Quantity' vs. 'Return'. Full Arabic RTL support for regional stakeholders.",
    insights: "Revenue peaked in April 2025 at 627K SAR. One contractor (Al-Fahad) dominated with over 2M SAR in total financial return.",
    impact: [{ val: "2.73M", lbl: "SAR Revenue" }, { val: "9,091", lbl: "Tons Processed" }, { val: "78%", lbl: "Completion Rate" }]
  },
  {
    title: "Regional Occupancy Trends 2024",
    tools: ["Power BI", "Hospitality", "Time Intelligence"],
    industry: "Hospitality / Tourism",
    problem: "Analyzing seasonal occupancy trends across Saudi provinces to optimize pricing models and operational readiness.",
    data: "2024 occupancy rates broken down by accommodation type (Apartments vs. Hotels), month, and specific governorates.",
    process: "Time-series tracking for seasonality, using overlapping line charts and detailed matrix comparisons to highlight regional preferences.",
    insights: "July represents the absolute peak season (50.7%). Riyadh shows a strong preference for apartments (58.2%), while Madinah leans toward hotels (55.2%).",
    impact: [{ val: "50.7%", lbl: "Peak Occupancy" }, { val: "Riyadh", lbl: "Top Apt Market" }, { val: "July", lbl: "Peak Month" }]
  },
  {
    title: "C&E Inventory Position Health",
    tools: ["Power BI", "Supply Chain", "Inventory Control"],
    industry: "Logistics",
    problem: "Provide supply chain managers with a consolidated view of inventory health, highlighting stock that is blocked or in inspection.",
    data: "221M total stock units distributed across multiple plants, categorized by condition codes and supply chain branches.",
    process: "DAX-driven bucketing to separate Unrestricted, Blocked, and Quality Inspection stock, visualized with high-contrast donut charts.",
    insights: "While 210M units are unrestricted, a significant portion of blocked inventory is concentrated in the DDSP plant (39% of top 5).",
    impact: [{ val: "221M", lbl: "Total Units" }, { val: "12M", lbl: "Blocked/Qual" }, { val: "39%", lbl: "Plant Focus" }]
  },
  {
    title: "Facility Visitor Flow Analysis",
    tools: ["Power BI", "Operations", "Arabic Layout"],
    industry: "Security / Operations",
    problem: "Track visitor footfall and demographic data to optimize security staffing and customer service desk availability.",
    data: "9,732 visitor records tracking nationality, precise time of visit, and target department.",
    process: "Granular time-series analysis to identify intraday spikes, paired with demographic segmentation and Arabic RTL support.",
    insights: "Saudis make up 46% of traffic. The facility experiences a distinct daily rush hour precisely at 10:00 AM, and September was the busiest month.",
    impact: [{ val: "9,732", lbl: "Total Visitors" }, { val: "10:00 AM", lbl: "Peak Hour" }, { val: "46%", lbl: "Local Share" }]
  },
  {
    title: "National Strategic Performance Tracker",
    tools: ["Power BI", "Strategic KPIs", "Vision 2030"],
    industry: "Government",
    problem: "Monitor the execution of national initiatives for MEWA against Vision 2030 targets.",
    data: "41 distinct initiatives, 5 strategic goals, and 25 key performance indicators (KPIs).",
    process: "Strategic alignment matrix using conditional formatting to instantly flag on-track vs. delayed initiatives for executive overview.",
    insights: "Agricultural productivity initiatives are high-performing (88% target met), while specific regulatory frameworks show delays needing intervention.",
    impact: [{ val: "41", lbl: "Initiatives" }, { val: "25", lbl: "KPIs" }, { val: "88%", lbl: "Target Completion" }]
  },
  {
    title: "HR Terminations & Attrition Deep Dive",
    tools: ["Power BI", "HR Analytics", "Root Cause Analysis"],
    industry: "Human Resources",
    problem: "Uncover the root causes of employee turnover to improve onboarding processes and retention strategies.",
    data: "76 termination records cross-referenced by department, nationality, and specific exit reasons.",
    process: "Utilized decomposition trees to break down termination reasons visually alongside trendlines for monthly attrition tracking.",
    insights: "Over 52% of all terminations are resignations during the probation period, suggesting a misalignment in the recruitment phase.",
    impact: [{ val: "52%", lbl: "Probation Exits" }, { val: "Patient Svc", lbl: "Highest Turn" }, { val: "76", lbl: "Exits Analyzed" }]
  },
  {
    title: "SEC Health & Safety (HSE) Metrics",
    tools: ["Power BI", "Safety Analytics", "Risk Management"],
    industry: "Energy / Safety",
    problem: "Centralize safety reporting across power plants to proactively identify accident trends and workplace hazards.",
    data: "Tracking 115 accident events and 778 near-misses across multiple plant locations over 51 weeks.",
    process: "DAX calculations for moving averages of TRIR and LTIR, utilizing treemaps to pinpoint high-risk locations like plants PP12 and PP14.",
    insights: "Reporting culture is strong (778 near-misses). However, plants PP12 and PP14 show the highest concentration of actual accident events.",
    impact: [{ val: "778", lbl: "Near-Misses" }, { val: "115", lbl: "Accidents" }, { val: "51", lbl: "Weeks Tracked" }]
  },
  {
    title: "Corporate L&D Performance Matrix",
    tools: ["Power BI", "Training Analytics", "L&D"],
    industry: "Corporate Training",
    problem: "Evaluate the scale, reach, and employee satisfaction of corporate training programs across a massive workforce.",
    data: "12,963 employees, 401 programs, logging over 277K training hours and 51K training days.",
    process: "Aggregating massive datasets of logged hours and satisfaction scores (1-5) into a comprehensive executive overview.",
    insights: "Delivered 277K training hours. Behavioral training had the highest volume while maintaining an excellent 4.5/5 average rating.",
    impact: [{ val: "277K", lbl: "Training Hours" }, { val: "12.9K", lbl: "Employees" }, { val: "4.5/5", lbl: "Avg Rating" }]
  },
  {
    title: "Mobile Operational Production Dashboard",
    tools: ["Power BI Mobile", "UI/UX", "Real-Time"],
    industry: "Manufacturing",
    problem: "Equip floor managers with real-time, pocket-accessible production KPIs to immediately address downtimes.",
    data: "Shift-level production volumes (78.26K), adherence percentages, and categorized downtime causes.",
    process: "Specialized mobile-layout design in Power BI, prioritizing vertical scrolling, high-contrast KPI rings, and simplified sparklines.",
    insights: "Maintained 93% commitment to plan. Equipment failure was identified as the primary bottleneck for line downtime.",
    impact: [{ val: "93%", lbl: "Plan Adherence" }, { val: "78.2K", lbl: "Units Produced" }, { val: "Equipment", lbl: "Main Bottleneck" }]
  },
  {
    title: "Global Sales & Makkah Hospitality Analysis",
    tools: ["Power BI", "SQL Server", "Big Data", "DAX"],
    industry: "Hospitality / Retail",
    problem: "Managing high-volume data across global retail sales ($20.8bn) and hyper-local Makkah hotel occupancy required a unified, high-performance reporting architecture.",
    data: "Analyzed 1.1M total records, including 605K sales orders and detailed occupancy data for 177K visitors across Makkah province hotels.",
    process: "Developed a complex multi-fact schema to handle diverse KPIs. Implemented optimized SQL views to aggregate $15.5bn in profit-center specific revenue with sub-second report latency.",
    insights: "One primary profit center drives 74% ($15.5bn) of total revenue. In the hospitality sector, room-to-visitor ratios were optimized to handle peak seasonal surges in Makkah.",
    impact: [
      { val: "$20.8bn", lbl: "Total Revenue" },
      { val: "1.1M",    lbl: "Records Processed" },
      { val: "177K",   lbl: "Makkah Visitors" }
    ]
  }
];

const modalBg    = document.getElementById('modalBg');
const modalTitle = document.getElementById('modalTitle');
const modalBody  = document.getElementById('modalBody');

function openModal(idx) {
  const p = projects[idx];
  if (!p) return;
  modalTitle.textContent = p.title;
  modalBody.innerHTML = `
    <div class="cs-section">
      <h3>🎯 Problem Statement <span class="cs-sub">/ BUSINESS CHALLENGE</span></h3>
      <p>${p.problem}</p>
    </div>
    <div class="cs-section">
      <h3>📁 Data Overview <span class="cs-sub">/ DATASET</span></h3>
      <p>${p.data}</p>
    </div>
    <div class="cs-section">
      <h3>⚙️ Process <span class="cs-sub">/ HOW IT WAS BUILT</span></h3>
      <p>${p.process}</p>
    </div>
    <div class="cs-section">
      <h3>💡 Key Insights <span class="cs-sub">/ FINDINGS</span></h3>
      <p>${p.insights}</p>
    </div>
    <div class="cs-section">
      <h3>📈 Business Impact <span class="cs-sub">/ RESULTS</span></h3>
      <div class="impact-row">
        ${p.impact.map(i => `<div class="impact-card"><div class="impact-val">${i.val}</div><div class="impact-lbl">${i.lbl}</div></div>`).join('')}
      </div>
    </div>
    <div class="cs-tools">${p.tools.map(t => `<span class="chip">${t}</span>`).join('')}</div>
  `;
  modalBg.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalBg.classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('modalClose').addEventListener('click', closeModal);
modalBg.addEventListener('click', e => { if (e.target === modalBg) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// Open modal when clicking anywhere on a project card
document.querySelectorAll('.proj-card').forEach(card => {
  card.addEventListener('click', () => openModal(parseInt(card.dataset.idx)));
});

