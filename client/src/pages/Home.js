import React from 'react';
import './Home.css'; // Make sure to create and link this CSS file

function Home() {
  return (
    <>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <h1>Stop Guessing, Start Growing.</h1>
          <p className="lead">The ultimate platform to shorten, manage, and analyze your affiliate links. Turn your content into a revenue machine.</p>
          <a href="/register" className="btn btn-light btn-lg">Sign Up for Free</a>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container text-center">
          <h2 className="mb-5">Why You'll Love Affiliate++</h2>
          <div className="row">
            <div className="col-md-3">
              <div className="feature-icon"><i className="bi bi-link-45deg"></i></div>
              <h3 className="feature-title">URL Shortening</h3>
              <p>Create clean, short links that are easy to share on any platform.</p>
            </div>
            <div className="col-md-3">
              <div className="feature-icon"><i className="bi bi-graph-up-arrow"></i></div>
              <h3 className="feature-title">Click Tracking</h3>
              <p>Track every click and conversion to understand what content performs best.</p>
            </div>
            <div className="col-md-3">
              <div className="feature-icon"><i className="bi bi-tags"></i></div>
              <h3 className="feature-title">Campaign Management</h3>
              <p>Organize links by campaign to measure performance and optimize your strategy.</p>
            </div>
            <div className="col-md-3">
              <div className="feature-icon"><i className="bi bi-people"></i></div>
              <h3 className="feature-title">Team Collaboration</h3>
              <p>Use role-based access to work with your team efficiently and securely.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container text-center">
            <h2 className="mb-5">Get Started in 3 Simple Steps</h2>
            <div className="row">
                <div className="col-md-4">
                    <div className="step-number">1</div>
                    <h4>Create & Shorten</h4>
                    <p>Paste your long affiliate link and get a short, trackable link in seconds.</p>
                </div>
                <div className="col-md-4">
                    <div className="step-number">2</div>
                    <h4>Share & Promote</h4>
                    <p>Share your new link across your blog, social media, or ad campaigns.</p>
                </div>
                <div className="col-md-4">
                    <div className="step-number">3</div>
                    <h4>Track & Earn</h4>
                    <p>Analyze your link performance and watch your earnings grow with every conversion.</p>
                </div>
            </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Monetize Your Content?</h2>
          <p className="lead mb-4">Join hundreds of content creators, marketers, and businesses who trust Affiliate++ to manage their links.</p>
          <a href="#" className="btn btn-primary btn-lg">Start Your Free Trial Today</a>
        </div>
      </section>

      {/* Footer */}
     
    </>
  );
}

export default Home;