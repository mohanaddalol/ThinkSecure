import React from "react";
import { Link } from "react-router-dom";
import "./Resources.css";

/* --- Attack Types --- */
const attackTypes = [
  { name: "Phishing", description: "Attackers send fraudulent emails that appear to be from reputable sources to steal sensitive data like login credentials and credit card numbers." },
  { name: "Pretexting", description: "Attackers create a fabricated scenario to engage a victim and obtain information or influence behavior." },
  { name: "Baiting", description: "Attackers offer something enticing to an end user in exchange for information or access to systems." },
  { name: "Quid Pro Quo", description: "Attackers request personal information in exchange for a service, such as IT assistance or software installation." },
  { name: "Tailgating", description: "Attackers follow authorized personnel into a restricted area or system to gain unauthorized access." },
  { name: "Vishing", description: "Voice phishing uses phone calls to deceive individuals into revealing critical financial or personal information." },
  { name: "Smishing", description: "SMS phishing involves sending text messages that appear to come from trusted sources to trick users into revealing sensitive information." },
  { name: "Ransomware", description: "Malicious software that encrypts a victim's files, with attackers demanding payment to restore access." },
  { name: "Watering Hole Attack", description: "Attackers compromise websites frequently visited by their targets to deliver malware." },
];

/* --- Protection Tips --- */
const protectionTips = [
  "Be skeptical of unsolicited communications asking for personal information.",
  "Verify the identity of anyone requesting sensitive information, even if they appear legitimate.",
  "Don't click on links or download attachments from unknown or suspicious sources.",
  "Use multi-factor authentication whenever possible.",
  "Keep your software and systems updated with the latest security patches.",
  "Create strong, unique passwords for each of your accounts.",
  "Be cautious about what information you share on social media.",
  "Educate yourself and stay informed about the latest social engineering tactics.",
  "Use a password manager to maintain strong, unique passwords for all your accounts.",
  "Back up your important data regularly and keep backups offline or in a separate secure location.",
  "Use anti-virus and anti-malware software and keep it updated.",
  "Enable automatic updates for your operating system and applications.",
];

/* --- Official Malaysian Government Resources --- */
const malaysianGovernmentResources = [
  {
    name: "CyberSecurity Malaysia (CSM)",
    url: "https://www.cybersecurity.my/",
    description: "National cybersecurity specialist agency under MOSTI focused on strengthening Malaysia's cyber resilience.",
  },
  {
    name: "Cyber999 Help Centre / MyCERT",
    url: "https://www.mycert.org.my/",
    description: "Report incidents (scams, phishing, malware) and read advisories issued by Malaysia CERT.",
  },
  {
    name: "Ministry of Science, Technology and Innovation (MOSTI)",
    url: "https://www.mosti.gov.my/",
    description: "Oversees national policies and initiatives related to cybersecurity and digital innovation.",
  },
  {
    name: "Royal Malaysia Police (CCID)",
    url: "https://ccid.rmp.gov.my/",
    description: "Commercial Crime Investigation Department for reporting cyber fraud and scams.",
  },
  {
    name: "MCMC (Malaysian Communications and Multimedia Commission)",
    url: "https://www.mcmc.gov.my/",
    description: "Regulator for communications and multimedia; tackles online fraud and misinformation.",
  },
];

/* --- Blogs and News --- */
const cybersecurityBlogs = [
  { name: "Krebs on Security", url: "https://krebsonsecurity.com/", description: "In-depth security news and investigations." },
  { name: "The Hacker News", url: "https://thehackernews.com/", description: "Leading source of cybersecurity news and information." },
  { name: "CSO Online", url: "https://www.csoonline.com/", description: "News, analysis and research on security and risk management." },
  { name: "Security Week", url: "https://www.securityweek.com/", description: "Cybersecurity news, insights and analysis." },
  { name: "BleepingComputer", url: "https://www.bleepingcomputer.com/", description: "Practical infosec and technology news." },
];

/* --- Statistics --- */
const cyberSecurityStats = [
  "CyberSecurity Malaysia reported more than 2,300 cyber-threat incidents in the first half of 2025 via Cyber999.",
  "Phishing and online scams remain the top reported incidents in Malaysia, according to MCMC and MyCERT advisories.",
  "Royal Malaysia Police (CCID) reports financial losses from cyber fraud exceeding RM 100 million in 2024.",
  "Malaysia continues investing in cybersecurity infrastructure under MOSTI's digital resilience strategy.",
  "Over 60% of incidents in Malaysia involve social engineering or fraud techniques.",
];

/* --- Component --- */
function ResourcesPage() {
  return (
    <div className="about-page">
      <main className="about-main">
        <div className="about-content">
          <Link to="/" className="back-home">&#x2190; Back to Home</Link>

          <div className="header-section">
            <h1>About This Quiz</h1>
            <p>Learn how to protect yourself from social engineering attacks</p>
          </div>

          <div className="info-section">
            <p>
              Social engineering attacks are manipulation techniques that exploit human error to gain private
              information, access, or valuables. These attacks use psychological manipulation to trick
              users into making security mistakes or giving away sensitive information.
            </p>

            <h2>Cybersecurity: The First Line of Defense</h2>
            <p>
              Cybersecurity protects systems, networks, programs, devices and data from digital attacks aimed at
              accessing, changing, or destroying sensitive information, extorting money, or interrupting business.
            </p>
            <p>
              The most effective strategy layers technology controls with user education, because people are often the
              weakest link.
            </p>

            <div className="stats-section">
              <h3>Cybersecurity by the Numbers</h3>
              <ul className="cyber-stats">
                {cyberSecurityStats.map((stat, i) => <li key={i}>{stat}</li>)}
              </ul>
            </div>

            <h2>Common Types of Attacks</h2>
            <div className="attack-grid">
              {attackTypes.map((attack, i) => (
                <div key={i} className="attack-card">
                  <h3>{attack.name}</h3>
                  <p>{attack.description}</p>
                </div>
              ))}
            </div>

            <h2>How to Protect Yourself</h2>
            <ul className="protection-tips">
              {protectionTips.map((tip, i) => <li key={i}>{tip}</li>)}
            </ul>

            {/* Malaysian Government Resources */}
            <h2>Malaysian Government Cybersecurity Resources</h2>
            <div className="resources-section">
              {malaysianGovernmentResources.map((r, i) => (
                <div key={i} className="resource-card">
                  <h3>{r.name}</h3>
                  <p>{r.description}</p>
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="resource-link">
                    Visit Website
                  </a>
                </div>
              ))}
            </div>

            {/* NEW SECTION DIVIDER */}
            <div className="divider-section">
              <h2>Stay Informed: Cybersecurity Blogs and News</h2>
              <p>Follow trusted cybersecurity blogs and media sources to stay ahead of the latest threats and defense strategies.</p>
            </div>

            {/* Blogs */}
            <div className="blog-section">
              {cybersecurityBlogs.map((b, i) => (
                <div key={i} className="blog-card">
                  <h3>{b.name}</h3>
                  <p>{b.description}</p>
                  <a href={b.url} target="_blank" rel="noopener noreferrer" className="blog-link">
                    Read Blog
                  </a>
                </div>
              ))}
            </div>

            <div className="quiz-promo">
              <h3>Ready to Test Your Knowledge?</h3>
              <p>Take our interactive quiz to see how well you can identify and respond to social engineering attacks.</p>
              <Link to="/games/security-quiz" className="start-quiz">Start Quiz Now</Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="about-footer">
        <p>© {new Date().getFullYear()} Cybersecurity Awareness Quiz Malaysia. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default ResourcesPage;
export { ResourcesPage };
