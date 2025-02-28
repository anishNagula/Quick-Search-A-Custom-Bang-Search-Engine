import React, { useState } from 'react';
import './App.css';
import searchIcon from './assets/search_icon.svg';
import { bangs } from './data/bangs.js';

function App() {
  const [searchInput, setSearchInput] = useState('');
  const [filteredBangs, setFilteredBangs] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1); // Track dropdown selection

  function handleSearch(input) {
    const parts = input.split(' ');
    const bang = parts.find((part) => part.startsWith('!'));
    const query = parts.filter((part) => !part.startsWith('!')).join(' ');

    if (bang && bangs[bang]) {
      window.location.href = bangs[bang] + encodeURIComponent(query);
    } else {
      window.location.href = `https://www.google.com/search?q=${encodeURIComponent(input)}`;
    }
  }

  function handleInputChange(e) {
    const value = e.target.value;
    setSearchInput(value);
    setSelectedIndex(-1);

    const parts = value.split(/(\s+)/); // Split including spaces
    const lastPart = parts[parts.length - 1].trim();
    
    if (lastPart.startsWith('!')) {
      const filtered = Object.keys(bangs)
        .filter(bang => bang.startsWith(lastPart))
        .sort();
      setFilteredBangs(filtered);
    } else {
      setFilteredBangs([]);
    }
  }

  function handleKeyDown(e) {
    if (filteredBangs.length === 0) return;
  
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => {
        const nextIndex = Math.min(prev + 1, filteredBangs.length - 1);
        scrollToItem(nextIndex);
        return nextIndex;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => {
        const nextIndex = Math.max(prev - 1, 0);
        scrollToItem(nextIndex);
        return nextIndex;
      });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0) {
        replaceLastBang(filteredBangs[selectedIndex]);
      } else {
        handleSearch(searchInput);
      }
    }
  }

  function scrollToItem(index) {
    const item = document.getElementById(`dropdown-item-${index}`);
    if (item) {
      item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }

  function replaceLastBang(selectedBang) {
    const parts = searchInput.split(/(\s+)/);
    const lastBangIndex = parts.findIndex((part, i) =>
      i === parts.length - 1 || part.trim().startsWith('!')
    );
  
    if (lastBangIndex >= 0) {
      parts[lastBangIndex] = selectedBang + ' ';
      const updatedInput = parts.join('').trim();
      setSearchInput(updatedInput);
      handleSearch(updatedInput); // Automatically search
    } else {
      const updatedInput = `${searchInput} ${selectedBang}`.trim();
      setSearchInput(updatedInput);
      handleSearch(updatedInput); // Automatically search
    }
  
    setFilteredBangs([]);
    setSelectedIndex(-1);
  }

  return (
    <div className="main">
      <h1>Quick Search</h1>
      <p>A simple search tool with custom bangs for quick redirections.</p>

      <div className="searchWrapper">
        <img className="search-icon" src={searchIcon} alt="Search Icon" />
        <input
          type="search"
          value={searchInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your search..."
        />
        {filteredBangs.length > 0 && (
          <ul className="dropdown">
            {filteredBangs.map((bang, index) => (
              <li
                key={bang}
                id={`dropdown-item-${index}`}
                className={selectedIndex === index ? 'selected' : ''}
                onMouseEnter={() => setSelectedIndex(index)}
                onClick={() => replaceLastBang(bang)}
              >
                <strong>{bang}</strong>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="linksWrapper">
        <ul className="links">
          <li><a href="https://github.com/anishNagula" target="_blank" rel="noopener noreferrer">GitHub</a></li>
          <li>&middot;</li>
          <li><a href="https://www.linkedin.com/in/anish-nagula/" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
          <li>&middot;</li>
          <li><a href="https://anishnagula.netlify.app/" target="_blank" rel="noopener noreferrer">Portfolio</a></li>
        </ul>
      </div>

    </div>
  );
}

export default App;