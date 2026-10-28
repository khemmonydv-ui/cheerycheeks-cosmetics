// The shop customer who is logged in, or null.
// Login.jsx and Signup.jsx save the customer in localStorage under "currentUser"
// (Account.jsx removes it on log out), so this reads the same place.
export function getCurrentUser() {
  try {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    return user && typeof user === 'object' ? user : null;
  } catch {
    return null;
  }
}