/**
 * Developer Profile Configuration
 *
 * Centralized developer profile shared across the Noor-ul-Quran application.
 */
export interface DeveloperProfile {
  name: string;
  role: string;
  introduction: string;
  supportingParagraph: string;
  initials: string;
  avatarUrl?: string;
}

export const DEVELOPER_CONFIG: DeveloperProfile = {
  name: "Shamza Maqbool",
  role: "Student & Web Developer",
  introduction:
    "I’m Shamza Maqbool, a student and web developer with an interest in creating meaningful, user-friendly digital experiences. I developed Noor-ul-Quran as a university project to apply my web development skills to an educational platform that supports Quran reading and understanding.",
  supportingParagraph:
    "My focus in this project is on clear navigation, readable Arabic and Urdu typography, responsive layouts, and practical features such as audio playback and bookmarks. The project reflects my interest in learning through development and creating websites with a clear purpose.",
  initials: "SM",
  avatarUrl: "",
};
