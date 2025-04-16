import React, { useEffect, useState } from 'react';
import { User } from '../../core/entities/User';

interface NavItemProps {
  title: string;
  active: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ title, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg transition-colors ${
      active
        ? 'bg-primary text-primary-foreground'
        : 'hover:bg-secondary hover:text-secondary-foreground'
    }`}
  >
    {title}
  </button>
);

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('vocabulary');
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Test IPC communication
    window.electron.ipcRenderer.sendDebug('App component mounted');
  }, []);

  const handleUserCreate = async () => {
    try {
      console.log('Creating user...');
      const result = await window.electron.ipcRenderer.invoke('user:create', {
        email: 'test@example.com',
        username: 'testuser'
      });
      console.log('User creation result:', result);

      if (result.success) {
        const updatedUsers = await window.electron.ipcRenderer.invoke('user:list');
        console.log('Updated users:', updatedUsers);
        if (updatedUsers.success) {
          setUsers(updatedUsers.data);
        }
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-primary">FluencyDesk</h1>
        </div>
      </header>

      <nav className="border-b bg-card">
        <div className="container mx-auto px-4 py-2">
          <div className="flex gap-2">
            <NavItem
              title="Vocabulary"
              active={activeTab === 'vocabulary'}
              onClick={() => setActiveTab('vocabulary')}
            />
            <NavItem
              title="Practice"
              active={activeTab === 'practice'}
              onClick={() => setActiveTab('practice')}
            />
            <NavItem
              title="Settings"
              active={activeTab === 'settings'}
              onClick={() => setActiveTab('settings')}
            />
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {activeTab === 'vocabulary' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Vocabulary List</h2>
              <button
                onClick={handleUserCreate}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                Add Word
              </button>
            </div>
            <div className="grid gap-4">
              {users.length > 0 ? (
                users.map(user => (
                  <div key={user.id} className="p-4 border rounded-lg bg-card">
                    <p className="text-lg font-medium">{user.username}</p>
                    <p className="text-muted-foreground">{user.email}</p>
                  </div>
                ))
              ) : (
                <div className="p-4 border rounded-lg bg-card">
                  <p className="text-lg font-medium">Welcome to FluencyDesk!</p>
                  <p className="text-muted-foreground">
                    Start adding words to your vocabulary list.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'practice' && (
          <div className="grid gap-4">
            <h2 className="text-xl font-semibold">Practice</h2>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-6 border rounded-lg bg-card hover:bg-accent">
                <h3 className="text-lg font-medium">Flashcards</h3>
                <p className="text-muted-foreground">Practice with flashcards</p>
              </button>
              <button className="p-6 border rounded-lg bg-card hover:bg-accent">
                <h3 className="text-lg font-medium">Quiz</h3>
                <p className="text-muted-foreground">Test your knowledge</p>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Settings</h2>
            <div className="p-4 border rounded-lg bg-card">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Dark Mode</label>
                  <input type="checkbox" className="toggle" />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Notifications</label>
                  <input type="checkbox" className="toggle" />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;