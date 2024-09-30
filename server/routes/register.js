const handleRegister = async (e) => {
  e.preventDefault();

  if (password !== confirmPassword) {
    setError('Passwords do not match');
    return;
  }

  try {
    await axios.post('http://localhost:4000/auth/register', { email, password }, {
      withCredentials: true // Include credentials (cookies)
    });

    // Redirect to login page after successful registration
    router.push('/login');
  } catch (err) {
    console.error('Registration failed:', err);
    setError('Failed to register');
  }
};
