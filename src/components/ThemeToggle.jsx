import { useEffect, useState } from 'react';

const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark'
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <span
      onClick={() => setDarkMode(!darkMode)}
      className="cursor-pointer text-2xl hover:scale-110 transition"
      title="Toggle Theme"
    >
      {darkMode ? '🌞' : '🌙'}
    </span>
  );
};

export default ThemeToggle;
