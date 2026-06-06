// ── Job application statuses ──────────────────────────────────────────────────
export type JobStatus =
  | "discovered"
  | "scored"
  | "approved"
  | "skipped"
  | "applying"
  | "applied"
  | "interviewing"
  | "offer"
  | "rejected"
  | "withdrawn";

export interface DiscoveredJob {
  id: string;
  title: string;
  company: string;
  location: string;
  platform: Platform;
  link: string;
  salary: string;
  description: string;
  discoveredAt: string;
  aiScore: number | null;  // 1-10 fit score
  status: JobStatus;
  notes: string;
  easyApply: boolean;
  appliedAt: string | null;
}

// ── Platforms ─────────────────────────────────────────────────────────────────
export type Platform =
  | "linkedin"
  | "indeed"
  | "glassdoor"
  | "ziprecruiter"
  | "greenhouse"
  | "lever"
  | "workday"
  | "ashby"
  | "rippling"
  | "other";

export interface PlatformConfig {
  enabled: boolean;
  username: string;
  password: string;
  sessionCookies: string;
}

export type PlatformsConfig = Record<Platform, PlatformConfig>;

// ── User profile ──────────────────────────────────────────────────────────────
export interface PersonalInfo {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
  linkedIn: string;
  website: string;        // portfolio URL
  github: string;
  ethnicity: string;
  gender: string;
  disabilityStatus: string;
  veteranStatus: string;
}

export interface CareerProfile {
  headline: string;
  summary: string;
  yearsOfExperience: string;
  currentEmployer: string;
  currentTitle: string;
  desiredSalary: number;
  desiredSalaryMin: number;
  noticePeriod: number;
  requireVisa: boolean;
  usCitizenship: string;
  coverLetter: string;    // default cover letter template
  resumeFileName: string; // name of uploaded resume
  resumeBase64: string;   // base64-encoded PDF for download
  skills: string[];
  targetRoles: string[];
  targetCompanies: string[];
  avoidCompanies: string[];
}

// ── Search / Discovery config ─────────────────────────────────────────────────
export interface SearchConfig {
  searchTerms: string[];
  location: string;
  remoteOnly: boolean;
  datePosted: string;
  salary: string;
  easyApplyOnly: boolean;
  experienceLevel: string[];
  jobType: string[];
  onSite: string[];
  badWords: string[];           // skip jobs with these words
  badCompanyWords: string[];
  goodCompanyWords: string[];
  minAiScore: number;           // auto-skip jobs below this score
  under10Applicants: boolean;
  securityClearance: boolean;
}

// ── Bot / automation settings ─────────────────────────────────────────────────
export interface BotConfig {
  dryRun: boolean;              // don't actually submit
  pauseBeforeSubmit: boolean;   // always confirm before submit
  pauseAtUnknownQuestion: boolean;
  stealthMode: boolean;
  runInBackground: boolean;
  keepScreenAwake: boolean;
  clickGapMs: number;
  maxApplicationsPerRun: number;
  aiProvider: "openai" | "gemini" | "anthropic" | "none";
  aiApiKey: string;
  tailorResume: boolean;        // AI-tailor resume per job
  generateCoverLetter: boolean; // AI-generate cover letter per job
  telegramBotToken: string;
  telegramChatId: string;
}

// ── Top-level app config ──────────────────────────────────────────────────────
export interface AppConfig {
  personal: PersonalInfo;
  career: CareerProfile;
  search: SearchConfig;
  bot: BotConfig;
  platforms: PlatformsConfig;
}

// ── Run status ────────────────────────────────────────────────────────────────
export type RunStage = "idle" | "discovering" | "scoring" | "applying" | "done" | "error";

export interface RunStatus {
  stage: RunStage;
  message: string;
  discovered: number;
  scored: number;
  applied: number;
  skipped: number;
  startedAt: string | null;
  log: string[];
}

// ── Defaults ──────────────────────────────────────────────────────────────────
const defaultPlatform = (): PlatformConfig => ({
  enabled: false,
  username: "",
  password: "",
  sessionCookies: "",
});

export const DEFAULT_CONFIG: AppConfig = {
  personal: {
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    zipcode: "",
    country: "United States",
    linkedIn: "",
    website: "",
    github: "",
    ethnicity: "Decline",
    gender: "Decline",
    disabilityStatus: "Decline",
    veteranStatus: "Decline",
  },
  career: {
    headline: "",
    summary: "",
    yearsOfExperience: "3",
    currentEmployer: "",
    currentTitle: "",
    desiredSalary: 0,
    desiredSalaryMin: 0,
    noticePeriod: 14,
    requireVisa: false,
    usCitizenship: "U.S. Citizen/Permanent Resident",
    coverLetter: "",
    resumeFileName: "",
    resumeBase64: "",
    skills: [],
    targetRoles: ["Software Engineer"],
    targetCompanies: [],
    avoidCompanies: [],
  },
  search: {
    searchTerms: ["Software Engineer", "Frontend Developer"],
    location: "United States",
    remoteOnly: false,
    datePosted: "Past week",
    salary: "",
    easyApplyOnly: true,
    experienceLevel: [],
    jobType: [],
    onSite: [],
    badWords: ["Crossover", "Staffing", "C2C", "Corp-to-Corp", "Clearance Required"],
    badCompanyWords: [],
    goodCompanyWords: [],
    minAiScore: 6,
    under10Applicants: false,
    securityClearance: false,
  },
  bot: {
    dryRun: true,
    pauseBeforeSubmit: true,
    pauseAtUnknownQuestion: true,
    stealthMode: true,
    runInBackground: false,
    keepScreenAwake: true,
    clickGapMs: 800,
    maxApplicationsPerRun: 20,
    aiProvider: "none",
    aiApiKey: "",
    tailorResume: false,
    generateCoverLetter: false,
    telegramBotToken: "",
    telegramChatId: "",
  },
  platforms: {
    linkedin: defaultPlatform(),
    indeed: defaultPlatform(),
    glassdoor: defaultPlatform(),
    ziprecruiter: defaultPlatform(),
    greenhouse: defaultPlatform(),
    lever: defaultPlatform(),
    workday: defaultPlatform(),
    ashby: defaultPlatform(),
    rippling: defaultPlatform(),
    other: defaultPlatform(),
  },
};

export const DEFAULT_RUN_STATUS: RunStatus = {
  stage: "idle",
  message: "Ready",
  discovered: 0,
  scored: 0,
  applied: 0,
  skipped: 0,
  startedAt: null,
  log: [],
};
