export const loginUser = async (credentials) => {
    const response = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(credentials),
    });
  
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }
  
    return response.json();
  };
  
  export const registerUser = async (userData) => {
    const response = await fetch('http://localhost:8080/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(userData),
    });
  
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }
  
    return response.json();
  };