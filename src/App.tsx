import { useState, useEffect } from 'react';
import './App.css';
import './index.css'; // Import Tailwind CSS
import 'font-awesome/css/font-awesome.min.css';

function App() {
  const [leftSideButtons, setLeftSideButtons] = useState(true);

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


  // Add buttons for linkedin github and email in a new tab
  var externalLinks = [
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
  ]

  //Copy email to clipboard button
  const copyEmail = () => {
    navigator.clipboard.writeText("j.andreatta@hotmail.com");
  }

  const emailButton = {
    name: "Email",
    action: copyEmail,
    icon: "fa fa-envelope aspect-square"
  }

  const toggleIconsOnLeft = (e: any) => {
    if (e.target.tagName.toLowerCase() !== 'button' && !e.target.closest('button')) {
      setLeftSideButtons(!leftSideButtons);
    }
  }


  const emailButtonHtml = (
    <div className='pr-10 py-1'>
      <button
        onClick={emailButton.action} className="relative group normal-button flex items-center justify-center text-white text-[25px] w-12 h-12 leading-1" onClick={emailButton.action}>
        <i className={emailButton.icon}></i>
        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-2 text-xs text-white bg-[var(--accent-color)] rounded opacity-0 group-focus:opacity-100 transition-opacity duration-300">
          Email&nbsp;Copied
        </span>
      </button>
    </div>
  )

  var links = (
    externalLinks.map((button, index) => {
      return (
        <a className="pr-10  py-1 flex " href={button.link} target="_blank" key={index} >
          <button
            onClick={(e) => e.stopPropagation()}
            className="normal-button flex items-center justify-center text-white text-[25px] w-12 h-12 leading-1"
          >
            <i className={button.icon}></i>
          </button>
        </a>
      );
    })

  )

  return (
    <>
      <div className="pane" onClick={toggleIconsOnLeft}>

        <div className="flex flex-row">

          {leftSideButtons && (
            <div className="card flex flex-col justify-center">
              {emailButtonHtml}
              {links}
            </div>
          )}
          <div>
            <div className='flex flex-row flex-wrap -mt-5'>
              <h1 className="gradient-text">Jeremy&nbsp;</h1>
              <h1 className="gradient-text">Andreatta</h1>
            </div>

            <h2 className='text-[var(--secondary-color)]'>mechatronics&nbsp;engineer&nbsp;/ software&nbsp;engineer</h2>
            <h3>i like building things sometimes</h3>

            {!leftSideButtons && (
              <div className="card flex justify-center">
                {emailButtonHtml}
                {links}
              </div>
            )}
          </div>
        </div>
      </div>
    </>

  );
}

export default App;