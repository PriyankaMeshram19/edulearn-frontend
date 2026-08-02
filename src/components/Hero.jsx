function Hero() {
  return (
    <div className="hero" style={{ 
      backgroundImage: "url('hero-bg.jpg')", 
      height: "100vh", 
      backgroundSize: "cover" 
    }}>
      <div style={{ padding: "50px", color: "white", maxWidth: "400px" }}>
        <h1>Learn Skills, Build Careers</h1>
        <p>EduLearn helps you master coding, AI, and more with expert instructors.</p>
      </div>
    </div>
  );
}
