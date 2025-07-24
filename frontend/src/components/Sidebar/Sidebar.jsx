import './Sidebar.css';

const Sidebar = ({ selectedLanguage, onLanguageSelect }) => {
  const languages = {
    'C': {
      name: 'C',
      defaultCode: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`
    },
    'C++': {
      name: 'C++',
      defaultCode: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`
    },
    'Java': {
      name: 'Java',
      defaultCode: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`
    },
    'Python': {
      name: 'Python',
      defaultCode: `print("Hello, World!")`
    }
  };

  const handleLanguageSelect = (lang) => {
    onLanguageSelect(lang, languages[lang].defaultCode);
  };

  return (
    <aside className="sidebar">
      <h3 className="sidebar-title">Languages</h3>
      {Object.keys(languages).map((lang) => (
        <button
          key={lang}
          onClick={() => handleLanguageSelect(lang)}
          className={`language-button ${selectedLanguage === lang ? 'selected' : ''}`}
        >
          {languages[lang].name}
        </button>
      ))}
    </aside>
  );
};

export default Sidebar;
