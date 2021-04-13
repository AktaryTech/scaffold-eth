import * as React from 'react';
import { Switch } from 'antd';
import { useThemeSwitcher } from 'react-css-theme-switcher';

const { useEffect, useState } = React;

export default function ThemeSwitcher() {
  const theme = window.localStorage.getItem('theme');
  const [isDarkMode, setIsDarkMode] = useState(!(!theme || theme === 'light'));
  const { switcher, currentTheme, themes } = useThemeSwitcher();

  useEffect(() => {
    window.localStorage.setItem('theme', currentTheme || '');
  }, [currentTheme]);

  const toggleTheme = (isChecked: boolean) => {
    setIsDarkMode(isChecked);
    switcher({ theme: isChecked ? themes.dark : themes.light });
  };

  // Avoid theme change flicker
  // if (status === "loading") {
  //   return null;
  // }

  return (
    <div className="main fade-in" style={{ position: 'fixed', right: 8, bottom: 8 }}>
      <span style={{ padding: 8 }}>{currentTheme === 'light' ? '☀️' : '🌜'}</span>
      <Switch checked={isDarkMode} onChange={toggleTheme} />
    </div>
  );
}
