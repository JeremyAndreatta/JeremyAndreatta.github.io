import { useState, useEffect } from 'react';
import './App.css';
import './index.css'; // Import Tailwind CSS
import 'font-awesome/css/font-awesome.min.css';
import { isMobile } from 'react-device-detect';

function App() {
  const [leftSideButtons, setLeftSideButtons] = useState(true);
  const [activeSection, setActiveSection] = useState('');

  document.body.style.background = `radial-gradient(circle at ${0}% ${0}%, var(--background-secondary-color), var(--background-color))`;

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      const { innerWidth, innerHeight } = window;
      const xPercent = (clientX / innerWidth) * 100;
      const yPercent = (clientY / innerHeight) * 100;

      // Adjust the size of the gradient circle by changing the size value (e.g., 20%).
      document.body.style.background = `radial-gradient(circle at ${xPercent}% ${yPercent}%, var(--background-secondary-color), var(--background-color))`;
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll('section');
    const visibilityMap = new Map();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibilityMap.set(entry.target.id, entry.intersectionRatio);
        });

        // Find the section with the highest visibility percentage
        let maxVisibility = 0;
        let mostVisibleSection = '';
        visibilityMap.forEach((visibility, id) => {
          if (visibility > maxVisibility && id !== 'top') {
            maxVisibility = visibility;
            mostVisibleSection = id;
          }
        });

        if (mostVisibleSection) {
          console.log(mostVisibleSection);
          setActiveSection(mostVisibleSection);
        }
      },
      { threshold: Array.from({ length: 101 }, (_, i) => i / 100) } // Create thresholds from 0 to 1 in increments of 0.01
    );

    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  // Add buttons for LinkedIn, GitHub, and email in a new tab
  const externalLinks = [
    {
      name: "LinkedIn",
      link: "https://www.linkedin.com/in/jeremy-andreatta/",
      icon: "fa fa-linkedin aspect-square"
    },
    {
      name: "GitHub",
      link: "https://github.com/JeremyAndreatta",
      icon: "fa fa-github aspect-square "
    },
  ];

  const experiences = [
    {
      title: "Mechatronics Engineer",
      company: "PNE Consult",
      date: "November 2024 - Current",
      description: "Design and development of custom automation solutions for various industries"
    },
    {
      title: "Undergraduate, Graduate & Intermediate Engineer",
      company: "Hatch",
      date: "Janurary 2022 - November 2024",
      description: "Full stack web development, data analysis, python scripting and automation"
    },
    {
      title: "Full Stack Developer",
      company: "Bank Edge",
      date: "May 2021 - January 2022",
      description: "Full stack web development"
    },
    {
      title: "Farm Hand",
      company: "Golden Valley Orchards",
      date: "November 2013 - February 2018",
      description: "Labouring, supervision, machinery operation, management"
    },
  ]


  const experiencesHtml = experiences.map((experience) => (

    <div className='p-5'>
      <p className='text-xl'><span className='text-[var(--primary-color)]'>{experience.title} </span>at <span className='text-[var(--accent-color)]'>{experience.company} </span></p>
      <p className='text-[var(--secondary-color)]'>{experience.date}</p>
      <p>{experience.description}</p>
    </div>
  ));


  const educations = [
    {
      degree: "Bachelor of Engineering (Honours) and Masters of Engineering",
      major: "Mechatronics Engineering",
      school: "The University of Queensland",
      date: "February 2018 - November 2022",
      description: "Studied software, mechanical and electrical engineering subjects to develop a broad range of skills"
    },
  ]

  const educationsHtml = educations.map((education) => (

    <div className='p-5'>
      <p className='text-xl'><span className='text-[var(--primary-color)]'>{education.degree} </span>at <span className='text-[var(--accent-color)]'>{education.school} </span></p>
      <p className='text-xl'><span className='text-[var(--accent-color)]'>Major: {education.major}  </span></p>
      <p className='text-[var(--secondary-color)]'>{education.date}</p>
      <p>{education.description}</p>
    </div>
  ));

  const skills = [
    {
      area: "Web Development",
      experience: "Full stack web development. Angular, .Net, Terraform, Azure, DevOps, CI/CD, GraphQL, ",
    },
    {
      area: "Data Analysis",
      experience: "Python, Pandas, Numpy, Matplotlib, Plotly, Jupyter Notebooks, SQL, PowerBI",
    },
    {
      area: "Electrical Engineering",
      experience: "Circuit design, PCB design, Microcontrollers, Component Selection",
    },
    {
      area: "Mechanical Engineering",
      experience: "Autodesk Inventor, 3D Printing, Statics, Dynamics, Vibrations",
    },
    {
      area: "Control Engineering",
      experience: "Kinematics, Dynamics, PID Control, State Space Control, Robotics",
    },
    {
      area: "Game Development",
      experience: "Godot, Unity, Shaders, 3D Modelling, Animation, Sound Design, Logic Scripting, Networking",
    }
  ]

  const skillHtml = (
    <div className='p-5'>

      {skills.map((skill) => (
        <p className='text-xl'><span className='text-[var(--primary-color)]'>{skill.area}:</span> <span className='text-[var(--accent-color)]'>{skill.experience} </span></p>
      ))}
    </div>
  );


  // Copy email to clipboard button
  const copyEmail = () => {
    navigator.clipboard.writeText("j.andreatta@hotmail.com");
    // if on mobile show alert
    if (isMobile) {
      alert("Email Copied");
    }
  };

  const emailButton = {
    name: "Email",
    action: copyEmail,
    icon: "fa fa-envelope aspect-square"
  };

  const toggleIconsOnLeft = (e: any) => {
    if (e.target.tagName.toLowerCase() !== 'button' && !e.target.closest('button')) {
      setLeftSideButtons(!leftSideButtons);
    }
  };

  const emailButtonHtml = (
    <div className='mr-5 py-1'>
      <button
        onClick={emailButton.action} className="relative group normal-button flex items-center justify-center transition-all text-white lg:text-[25px] text-[15px] lg:w-12 lg:h-12 w-10 h-10 leading-1">
        <i className={emailButton.icon}></i>
        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-2 text-xs text-white bg-[var(--accent-color)] rounded opacity-0 group-focus:opacity-100 transition-opacity duration-300">
          Email&nbsp;Copied
        </span>
      </button>
    </div>
  );

  const links = externalLinks.map((button, index) => (
    <a className="mr-5 py-1 flex" href={button.link} target="_blank" key={index}>
      <button
        onClick={(e) => e.stopPropagation()}
        className="normal-button flex items-center justify-center text-white transition-all lg:text-[25px] text-[15px] lg:w-12 lg:h-12 w-10 h-10 leading-1 p-0"
      >
        <i className={button.icon}></i>
      </button>
    </a>
  ));

  return (
    <div className="flex flex-row h-screen w-screen lg:pl-20 lg:pr-0 px-5 flex-wrap overflow-y-scroll lg:overflow-clip scroll-smooth">
      {/* Left Pane */}

      <div className="w-screen lg:w-1/3 p-4 lg:h-screen ">


        <div className='grow lg:h-1/4'>

        </div>
        <section id="top">
        </section>
        <div className='flex justify-center'>
          <div className="pane !p-0 !px-5 !pt-2" onClick={toggleIconsOnLeft}>
            <div className="flex flex-row">
              {false && leftSideButtons && (
                <div className="flex flex-col">
                  {emailButtonHtml}
                  {links}
                </div>
              )}
              <div className='flex flex-col self-center'>
                <div className='flex flex-row flex-wrap'>
                  <h1 className="gradient-text lg:text-[50px] text-[30px] transition-all">Jeremy&nbsp;</h1>
                  <h1 className="gradient-text lg:text-[50px] text-[30px] transition-all">Andreatta</h1>
                </div>
                <h2 className='text-[var(--secondary-color)] text-xl lg:text-2xl transition-all'>mechatronics&nbsp;engineer&nbsp;/ software&nbsp;engineer</h2>
                <h3 className='text-[var(--text-color)] text-sm lg:text-lg transition-all leading-8'>i like building things sometimes</h3>
                {(true || !leftSideButtons) && (
                  <div className="flex justify-center py-2">
                    {emailButtonHtml}
                    {links}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>


        <div className="flex flex-col p-2">
          <div className='flex justify-center'>
            <div className="flex flex-col  text-xl">
              <a href="#experience" className={`line-container ${activeSection === 'experience' ? 'active' : ''}`}>
                <span className='line'></span>
                experience
                <span className='line'></span>
              </a>
              <a href="#education" className={`line-container ${activeSection === 'education' ? 'active' : ''}`}>
                <span className='line'></span>
                education
                <span className='line'></span>
              </a>

              <a href="#projects" className={`line-container ${activeSection === 'projects' ? 'active' : ''}`}>
                <span className='line'></span>
                projects
                <span className='line'></span>
              </a>
              <a href="#skills" className={`line-container ${activeSection === 'skills' ? 'active' : ''}`}>
                <span className='line'></span>
                skills
                <span className='line'></span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Right Pane */}
      <div className="flex w-screen lg:w-3/5 lg:overflow-y-scroll p-4 lg:h-screen scroll-smooth text-white">

        {/* Add your scrollable content here */}
        <div className="flex-col flex-grow">

          <div className='py-5'>
            <section id="experience" className=' pane'>
              <h1 className='text-[var(--secondary-color)] text-5xl'>experience</h1>
              {experiencesHtml}
              <a className="lg:hidden" href="#top"><h1 className='text-[var(--secondary-color)] text-sm'>back to top ^</h1></a>
            </section>
          </div>

          <div className='py-5'>

            <section id="education" className='my-10 pane'>
              <h1 className='text-[var(--secondary-color)] text-5xl'>education</h1>

              {educationsHtml}

              <a className="lg:hidden" href="#top"><h1 className='text-[var(--secondary-color)] text-sm'>back to top ^</h1></a>

            </section>
          </div>



          <div className='py-5 flex'>

            <section id="projects" className='my-10 pane'>
              <h1 className='text-[var(--secondary-color)] text-5xl'>projects</h1>

              <video controls className="w-full h-auto mt-4">
                <source src="/earlygame.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <video controls className="w-full h-auto mt-4">
                <source src="/game.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              <div className='flex gap-1'>
                <video controls className="w-1/4 h-auto mt-4">
                  <source src="/sattelite.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <img className="w-3/4 h-auto mt-4" src="/satteliteDrawing.jpg" />
              </div>

              <div className='flex gap-1'>

                <img className="h-auto mt-4 w-1/2" src="/lander1.jpg" />
                <img className="h-auto mt-4 w-1/2" src="/lander2.jpg" />
              </div>

              <div className='flex gap-1'>

                <video controls className="w-1/3 h-auto mt-4">
                  <source src="/app.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <video controls className="w-2/3 h-auto mt-4" muted>
                  <source src="/pendulum.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className='flex gap-1'>

                <img className="h-auto mt-4 w-1/2" src="/glider.png" />
                <img className="h-auto mt-4 w-1/2" src="/wheel.png" />
              </div>


              <a className="lg:hidden" href="#top"><h1 className='text-[var(--secondary-color)] text-sm'>back to top ^</h1></a>

            </section>


          </div>
          <div className='py-5'>

            <section id="skills" className='py-5 pane'>
              <h1 className='text-[var(--secondary-color)] text-5xl'>skills</h1>

              <a className="lg:hidden" href="#top"><h1 className='text-[var(--secondary-color)] text-sm'>back to top ^</h1></a>
              {skillHtml}

            </section>
          </div>

        </div>
      </div></div>
  );
}

export default App;