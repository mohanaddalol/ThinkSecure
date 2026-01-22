import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import './animations.css';

const features = [
  {
    id: 1,
    icon: '🎮',
    title: 'Gamified Learning',
    description: 'Learn cybersecurity through interactive challenges and earn rewards as you progress.'
  },
  {
    id: 2,
    icon: '🛡️',
    title: 'Real-World Scenarios',
    description: 'Practice with simulations based on actual cyber threats and attack patterns.'
  },
  {
    id: 3,
    icon: '📊',
    title: 'Track Your Progress',
    description: 'Monitor your skills development with detailed analytics and leaderboards.'
  },
  {
    id: 4,
    icon: '🏆',
    title: 'Compete & Collaborate',
    description: 'Challenge others or team up to solve complex security puzzles together.'
  }
];

const challenges = [
  // BEGINNER LEVEL
  {
    id: 1,
    title: 'Security Quiz',
    desc: 'Test your knowledge about social engineering attacks and threats.',
    icon: 'sx.png',
    path: '/games/security-quiz',
    difficulty: 'Beginner',
    color: '#ff8c00'
  },
  {
    id: 3,
    title: 'Master the Passwords',
    desc: 'Learn how to create strong and secure passwords while scoring your password strength!',
    icon: 'password-icon.png',
    path: '/games/password-challenge',
    difficulty: 'Beginner',
    color: '#ff8c00'
  },
  // INTERMEDIATE LEVEL
  {
    id: 2,
    title: 'Cyber Escape Room',
    desc: 'Solve a series of cybersecurity puzzles to escape from a virtual hacker trap.',
    icon: 'escape-room-icon.PNG',
    path: '/games/escape-room',
    difficulty: 'Intermediate',
    color: '#ff8c00'
  },
  // ADVANCED LEVEL
  {
    id: 4,
    title: 'Attack Simulator',
    desc: 'React to threats in real-time.',
    icon: 'attack-sim-icon.PNG',
    path: '/games/attack-sim',
    difficulty: 'Advanced',
    color: '#ff8c00'
  },
  {
    id: 5,
    title: 'Hack The Hacker',
    desc: 'Decrypt and analyze.',
    icon: 'hack-the-hacker.PNG',
    path: '/games/hack-hacker',
    difficulty: 'Advanced',
    color: '#ff8c00'
  },
  {
    id: 9,
    title: 'OSINT CTF Lab',
    desc: 'Use Open Source Intelligence to extract hidden data from social profiles.',
    icon: 'OSINT CTF Lab.png',
    path: '/osint-ctf',
    difficulty: 'Advanced',
    color: '#ff8c00'
  },
  {
    id: 10,
    title: 'Steganography CTF Lab',
    desc: 'Discover hidden data concealed within digital images.',
    icon: 'Steganography CTF Lab.png',
    path: '/stego-ctf',
    difficulty: 'Advanced',
    color: '#ff8c00'
  },
];

const stats = [
  { label: 'Active Users', value: '10K+', icon: '👥' },
  { label: 'Challenges', value: '50+', icon: '🎯' },
  { label: 'Success Rate', value: '95%', icon: '✨' },
  { label: 'Hours Learned', value: '100K+', icon: '⏱️' }
];

function Home() {
  const scrollRef = useRef([]);

  useEffect(() => {
    // Scroll reveal animation
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.1 }
    );

    scrollRef.current.forEach(el => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const addToRefs = (el) => {
    if (el && !scrollRef.current.includes(el)) {
      scrollRef.current.push(el);
    }
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg">
          <div className="matrix-bg"></div>
          <div className="gradient-overlay"></div>
        </div>
        <div className="hero-content">
          <div className="hero-badge animate-fade-in-down">
            <span>🔐 Powered by Gamification</span>
          </div>
          <h1 className="hero-title animate-fade-in-up delay-100">
            Master <span className="gradient-text">Cybersecurity</span>
            <br />
            Through Interactive Learning
          </h1>
          <p className="hero-subtitle animate-fade-in-up delay-200">
            Transform your security skills with hands-on challenges, real-world simulations,
            and a vibrant learning community. Start your journey today!
          </p>
          <div className="hero-cta animate-fade-in-up delay-300">
            <Link to="/challenges" className="btn-primary btn-ripple hover-glow">
              Start Learning
              <span className="btn-icon">→</span>
            </Link>
            <Link to="/resources" className="btn-secondary btn-ripple">
              Explore Resources
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header scroll-reveal" ref={addToRefs}>
          <h2 className="section-title">Why Choose ThinkSecure?</h2>
          <p className="section-subtitle">
            Experience a revolutionary approach to cybersecurity education
          </p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className="feature-card scroll-reveal hover-lift glass"
              ref={addToRefs}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="feature-icon animate-pulse">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Challenges Section */}
      <section className="challenges-section">
        <div className="section-header scroll-reveal" ref={addToRefs}>
          <h2 className="section-title">Interactive Challenges</h2>
          <p className="section-subtitle">
            Choose your path and start building your cybersecurity expertise
          </p>
        </div>
        <div className="challenges-grid">
          {challenges.map((challenge, index) => (
            <div
              key={challenge.id}
              className="challenge-card scroll-reveal hover-lift glass-dark"
              ref={addToRefs}
              style={{
                animationDelay: `${index * 0.1}s`,
                '--accent-color': challenge.color
              }}
            >
              <div className="challenge-header">
                <div className="challenge-icon-wrapper">
                  <img
                    src={`${import.meta.env.BASE_URL}${challenge.icon}`}
                    alt={challenge.title}
                    className="challenge-icon"
                  />
                </div>
                <span className="difficulty-badge" style={{ borderColor: challenge.color }}>
                  {challenge.difficulty}
                </span>
              </div>
              <h3 className="challenge-title">{challenge.title}</h3>
              <p className="challenge-desc">{challenge.desc}</p>
              <Link
                to={challenge.path}
                className="challenge-link"
                style={{ color: challenge.color }}
              >
                Start Challenge <span>→</span>
              </Link>
              <div className="card-glow" style={{ background: `radial-gradient(circle at center, ${challenge.color}20, transparent)` }}></div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section scroll-reveal" ref={addToRefs}>
        <div className="cta-content">
          <h2 className="cta-title">Ready to Elevate Your Security Skills?</h2>
          <p className="cta-description">
            Join thousands of learners mastering cybersecurity through gamification
          </p>
          <Link to="/challenges" className="btn-cta btn-ripple hover-glow">
            Get Started Now
            <span className="btn-icon">🚀</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-section">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>ThinkSecure</h3>
            <p>Master cybersecurity through gamification</p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>Platform</h4>
              <Link to="/challenges">Challenges</Link>
              <Link to="/resources">Resources</Link>
            </div>
            <div className="footer-column">
              <h4>Community</h4>
              <a href="#support">Support</a>
              <a href="#about">About Us</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} ThinkSecure — Created by{' '}
            <strong>Mohanad Abdullah Sultan Salem Dalol</strong> (
            <a href="mailto:mohanaddalol967@gmail.com">mohanaddalol967@gmail.com</a>) and{' '}
            <strong>MD Parvej Ahmed Rafi</strong> (
            <a href="mailto:mdparvej.ahmedrafi@student.aiu.edu.my">
              mdparvej.ahmedrafi@student.aiu.edu.my
            </a>
            )
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
