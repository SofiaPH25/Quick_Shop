
import { User } from '../types';
import { getItem, setItem, removeItem } from '../utils/localStorage';

const USERS_KEY = 'quickshop_users';
const CURRENT_USER_KEY = 'quickshop_current_user';

// Simulating a database of users
const getStoredUsers = (): User[] => getItem<User[]>(USERS_KEY) || [];
const saveStoredUsers = (users: User[]): void => setItem(USERS_KEY, users);

export const authService = {
  login: async (email: string, passwordAttempt: string): Promise<User | null> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    const users = getStoredUsers();
    // In a real app, password would be hashed and compared.
    // For this simulation, we'll store a mock password (not secure).
    // This is highly simplified and NOT for production.
    const user = users.find(u => u.email === email); 
    
    // This is where actual password check against a stored (hashed) password would happen.
    // For simulation, we assume any password matches if user exists.
    // In a real scenario, you'd have: if (user && await bcrypt.compare(passwordAttempt, user.hashedPassword))
    if (user) { 
      // For this example, we're not actually checking the password. If the email exists, login succeeds.
      // This is a major simplification. In a real app, you'd verify the password.
      const currentUser = { id: user.id, email: user.email, name: user.name };
      setItem<User>(CURRENT_USER_KEY, currentUser);
      return currentUser;
    }
    return null;
  },

  register: async (userData: Omit<User, 'id'> & { password?: string }): Promise<User | null> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    const users = getStoredUsers();
    if (users.find(u => u.email === userData.email)) {
      return null; // User already exists
    }
    const newUser: User = { 
      ...userData, 
      id: Date.now().toString(), // Simple ID generation
    };
    // Don't store password in the user object that gets returned or put into currentUser context
    // The password would be hashed and stored securely in a backend.
    
    users.push(newUser);
    saveStoredUsers(users); // Save updated user list
    
    const currentUser = { id: newUser.id, email: newUser.email, name: newUser.name };
    setItem<User>(CURRENT_USER_KEY, currentUser);
    return currentUser;
  },

  logout: async (): Promise<void> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    removeItem(CURRENT_USER_KEY);
  },

  getCurrentUser: (): User | null => {
    return getItem<User>(CURRENT_USER_KEY);
  },
};
    