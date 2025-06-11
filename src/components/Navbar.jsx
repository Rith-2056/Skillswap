import Notifications from './Notifications';

function Navbar({ user }) {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* ... existing navbar items ... */}
          
          <div className="flex items-center space-x-4">
            {user && <Notifications user={user} />}
            {/* ... other navbar items ... */}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 