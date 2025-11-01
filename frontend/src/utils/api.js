const API_BASE_URL = 'https://compilehub-1.onrender.com/';

export const checkAuthStatus = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/me`, {
      credentials: 'include'
    });
    
    if (response.ok) {
      const result = await response.json();
      return result.user;
    }
    return null;
  } catch (error) {
    console.log('Not authenticated');
    return null;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
      credentials: 'include'
    });

    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error('Connection error. Please check if the server is running.');
  }
};

export const loginUser = async (loginData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: loginData.email,
        password: loginData.password
      }),
      credentials: 'include'
    });

    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error('Connection error. Please check if the server is running.');
  }
};

export const logoutUser = async () => {
  try {
    await fetch(`${API_BASE_URL}/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    return false;
  }
};

export const compileCode = async (code, language) => {
  try {
    const response = await fetch(`${API_BASE_URL}/compile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: code,
        language: language
      }),
      credentials: 'include'
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      error: 'Connection Error: Unable to connect to server.\nMake sure your backend is running on http://localhost:5000'
    };
  }
};