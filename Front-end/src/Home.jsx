import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const challenges = [
  {
    id: 1,
    title: 'Security Quiz',
    desc: 'Test your knowledge about social engineering attacks and threats.',
    icon: 'sx.png', // Icon file name in public/
    path: '/games/security-quiz',
    isNew: false,
  },
  {
    id: 2,
    title: 'Cyber Escape Room',
    desc: 'Solve a series of cybersecurity puzzles to escape from a virtual hacker trap.',
    icon: 'escape-room-icon.PNG', // Icon file name in public/
    path: '/games/escape-room',
    isNew: false,
  },
  {
    id: 3,
    title: 'Master the Passwords', // Updated name
    desc: 'Learn how to create strong and secure passwords while scoring your password strength!',
    icon: 'password-icon.png', // Icon file name in public/
    path: '/games/password-challenge',
    isNew: false,
  },
  {
    id: 4,
    title: 'Attack Simulator',
    desc: 'React to threats in real-time.',
    icon: 'attack-sim-icon.PNG', // Icon file name in public/
    path: '/games/attack-sim',
    isNew: false,
  },
  {
    id: 5,
    title: 'Hack The Hacker',
    desc: 'Decrypt and analyze.',
    icon: 'hack-the-hacker.PNG', // Icon file name in public/
    path: '/games/hack-hacker',
    isNew: false,
  },
  {
    id: 6,
    title: 'Security Resources', // New Card
    desc: 'Access a variety of tools, articles, and guides to enhance your cybersecurity knowledge and skills.',
    icon: 'resources.PNG', // Icon file name in public/
    path: '/resources',
    isNew: false,
  },
];

function Home() {
  return (
    <div className="home">
      <div className="hero">
        <h1>Cybersecurity Awareness Platform</h1>
        <p>
          Test your knowledge, develop skills, and learn to protect yourself from cyber threats through interactive challenges and simulations.
        </p>
      </div>
      <div className="challenges-grid">
        {challenges.map((challenge) => (
          <div key={challenge.id} className="challenge-card">
            {challenge.isNew && <span className="new-label">NEW</span>}
           <img
  src={`${import.meta.env.BASE_URL}${challenge.icon}`}
  alt={challenge.title}
  className="challenge-icon"
/>

            <h3>{challenge.title}</h3>
            <p>{challenge.desc}</p>
            <Link to={challenge.path} className="challenge-link">
              Start Challenge →
            </Link>
          </div>
        ))}
      </div>
      <footer className="footer">
  <p>
    © {new Date().getFullYear()} Cybersecurity Awareness Platform — Created by{" "}
    <strong>Mohanad Abdullah Sultan Salem Dalol</strong> (
    <a href="mailto:mohanaddalol967@gmail.com">mohanaddalol967@gmail.com</a>) and{" "}
    <strong>MD Parvej Ahmed Rafi</strong> (
    <a href="mailto:mdparvej.ahmedrafi@student.aiu.edu.my">
      mdparvej.ahmedrafi@student.aiu.edu.my
    </a>).
  </p>
</footer>

    </div>
  );
}

export default Home;
