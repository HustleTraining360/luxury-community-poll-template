/**
 * Poll data configuration for the Luxury Community Poll
 * Design: Editorial Minimalism — Playfair Display + Inter, cream/charcoal/gold palette
 * All images served from CDN
 */

export interface PollOption {
  label: string;
  image: string;
}

export interface PollQuestion {
  headline: string;
  options: PollOption[];
}

const CDN = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030067302";

export const questions: PollQuestion[] = [
  {
    headline: "How would friends describe you?",
    options: [
      { label: "Social Connector", image: `${CDN}/SnfGcyEfDodHDCpd.jpg` },
      { label: "Wellness Focused", image: `${CDN}/DlcPiGwfftCsfdHc.jpg` },
      { label: "Luxury Lover", image: `${CDN}/esIxOmCrqkMKObxu.jpg` },
      { label: "Lifelong Learner", image: `${CDN}/zOcysqKlaisbvKSc.jpg` },
      { label: "Adventurous Spirit", image: `${CDN}/uKJzVnSTfstWROxf.jpg` },
      { label: "Selectively Private", image: `${CDN}/xNrebPdUvVWANptC.jpg` },
    ],
  },
  {
    headline: "When you attend events, you\u2026",
    options: [
      { label: "Bring Guests", image: `${CDN}/LZyENmKsspSrPjDp.jpg` },
      { label: "Come Solo", image: `${CDN}/kHviZmLiKjOTUcEK.jpg` },
      { label: "Prefer Exclusive", image: `${CDN}/hWHczaTsiunpXsSX.jpg` },
      { label: "Like Small Groups", image: `${CDN}/CBKOMsGZwLwRZybp.jpg` },
      { label: "Attend Most", image: `${CDN}/vCkjfjcuqdVzokrd.jpg` },
    ],
  },
  {
    headline: "What makes you proud to live here?",
    options: [
      { label: "The People", image: `${CDN}/nmJhrOxtxbhUYcZu.jpg` },
      { label: "The Amenities", image: `${CDN}/aSTkppnnzZgdLOpZ.jpg` },
      { label: "The Location", image: `${CDN}/wVkNmUfpRvfTSEBI.jpg` },
      { label: "The Reputation", image: `${CDN}/VlNOfHRVDzDWNrGY.jpg` },
      { label: "The Future Vision", image: `${CDN}/MDVQHeLdXsxIrnhR.jpg` },
    ],
  },
  {
    headline: "What would WOW you?",
    options: [
      { label: "Private Chef Night", image: `${CDN}/IpiwHGvozLAUmUlx.jpg` },
      { label: "Longevity Lab", image: `${CDN}/KcSzhzkgksKXFaks.jpg` },
      { label: "Black Tie Gala", image: `${CDN}/WLJPmAWIxrLLoAgM.jpg` },
      { label: "Sunset Party", image: `${CDN}/bhfPyuOiuGlBHlQU.jpg` },
      { label: "Executive Salon", image: `${CDN}/JVyKOUygjTUgEvoZ.jpg` },
      { label: "Something Unexpected", image: `${CDN}/ojrEyEwmyeRBSMjr.jpg` },
    ],
  },
  {
    headline: "What would make you invite a friend?",
    options: [
      { label: "Elegant & Upscale", image: `${CDN}/TciAztsFmHqEsUrK.jpg` },
      { label: "High Energy Fun", image: `${CDN}/HcElROualeZogVjA.jpg` },
      { label: "Health Focused", image: `${CDN}/WBYwjTiLZlrBqYoE.jpg` },
      { label: "Thought Provoking", image: `${CDN}/DDeDbQXPhpzkNEpW.jpg` },
      { label: "Family Friendly", image: `${CDN}/vPqxLdMigVEMight.jpg` },
      { label: "Invite Only VIP", image: `${CDN}/IpoQvawTskFmeWoi.jpg` },
    ],
  },
  {
    headline: "What format do you prefer?",
    options: [
      { label: "Large Events", image: `${CDN}/QaTQekRQNEZEFmIg.jpg` },
      { label: "Small & Curated", image: `${CDN}/hfcXqFLjnfNCpBRV.jpg` },
      { label: "Rotating Variety", image: `${CDN}/AMOjjEVcsUqlvWjF.jpg` },
      { label: "Structured Series", image: `${CDN}/VYrPBWNmhguBJQqe.jpg` },
      { label: "Surprise Pop-Ups", image: `${CDN}/GSXFajejuikYMJMZ.jpg` },
    ],
  },
  {
    headline: "Interested in VIP early access?",
    options: [
      { label: "Yes, Absolutely", image: `${CDN}/mOsGWUiqtsQNebJV.jpg` },
      { label: "Occasionally", image: `${CDN}/UNlCTEmtciyCdyQT.jpg` },
      { label: "Open to All Events", image: `${CDN}/CTvaEDqsrKWqDdxF.jpg` },
      { label: "Not Necessary", image: `${CDN}/wLZDDRwiCtAcTJIj.jpg` },
    ],
  },
];

export const questionLabels = [
  "How would friends describe you",
  "When you attend events you",
  "What makes you proud to live here",
  "What would WOW you",
  "What would make you invite a friend",
  "What format do you prefer",
  "Interested in VIP early access",
];
