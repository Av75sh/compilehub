const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { uploadsDir } = require('../config/multer');

function compileC(code, filename) {
  return new Promise((resolve) => {
    const filePath = path.join(uploadsDir, `${filename}.c`);
    const execPath = path.join(uploadsDir, filename);

    fs.writeFileSync(filePath, code);

    exec(`gcc "${filePath}" -o "${execPath}"`, (compileError) => {
      if (compileError) {
        cleanup(filePath, execPath);
        return resolve({ success: false, error: compileError.message });
      }

      exec(`"${execPath}"`, { timeout: 5000 }, (runError, stdout, stderr) => {
        cleanup(filePath, execPath);

        if (runError) {
          return resolve({ success: false, error: stderr || runError.message });
        }

        resolve({ success: true, output: stdout });
      });
    });
  });
}

function compileCpp(code, filename) {
  return new Promise((resolve) => {
    const filePath = path.join(uploadsDir, `${filename}.cpp`);
    const execPath = path.join(uploadsDir, filename);

    fs.writeFileSync(filePath, code);

    exec(`g++ "${filePath}" -o "${execPath}"`, (compileError) => {
      if (compileError) {
        cleanup(filePath, execPath);
        return resolve({ success: false, error: compileError.message });
      }

      exec(`"${execPath}"`, { timeout: 5000 }, (runError, stdout, stderr) => {
        cleanup(filePath, execPath);

        if (runError) {
          return resolve({ success: false, error: stderr || runError.message });
        }

        resolve({ success: true, output: stdout });
      });
    });
  });
}

function compileJava(code, filename) {
  return new Promise((resolve) => {
    const classMatch = code.match(/public\s+class\s+(\w+)/);
    const className = classMatch ? classMatch[1] : 'Main';
    
    const filePath = path.join(uploadsDir, `${className}.java`);

    fs.writeFileSync(filePath, code);

    exec(`javac "${filePath}"`, { cwd: uploadsDir }, (compileError) => {
      if (compileError) {
        cleanup(filePath, path.join(uploadsDir, `${className}.class`));
        return resolve({ success: false, error: compileError.message });
      }

      exec(`java ${className}`, { cwd: uploadsDir, timeout: 5000 }, (runError, stdout, stderr) => {
        cleanup(filePath, path.join(uploadsDir, `${className}.class`));

        if (runError) {
          return resolve({ success: false, error: stderr || runError.message });
        }

        resolve({ success: true, output: stdout });
      });
    });
  });
}

function runPython(code, filename) {
  return new Promise((resolve) => {
    const filePath = path.join(uploadsDir, `${filename}.py`);

    fs.writeFileSync(filePath, code);

    exec(`python "${filePath}"`, { timeout: 5000 }, (runError, stdout, stderr) => {
      cleanup(filePath);

      if (runError) {
        return resolve({ success: false, error: stderr || runError.message });
      }

      resolve({ success: true, output: stdout });
    });
  });
}

function cleanup(...files) {
  files.forEach(file => {
    if (fs.existsSync(file)) {
      try {
        fs.unlinkSync(file);
      } catch (error) {
        console.error('Cleanup error:', error);
      }
    }
  });
}

const executeCode = async (code, language, filename) => {
  switch (language) {
    case 'C':
      return await compileC(code, filename);
    case 'C++':
      return await compileCpp(code, filename);
    case 'Java':
      return await compileJava(code, filename);
    case 'Python':
      return await runPython(code, filename);
    default:
      return { success: false, error: 'Unsupported language' };
  }
};

module.exports = { executeCode };