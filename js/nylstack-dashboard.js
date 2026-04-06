 document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.querySelector('.topbar__menu-btn');
    const sidebar = document.querySelector('.sidebar');
    const appShell = document.querySelector('.app-shell');

    // 1. Injecting dynamic CSS to handle the "Open" state 
    // This avoids you having to manually edit your CSS block.
    const style = document.createElement('style');
    style.innerHTML = `
      @media (max-width: 1024px) {
        .sidebar--open {
          display: flex !important;
          position: fixed !important;
          top: 0;
          left: 0;
          z-index: 999;
          width: 280px;
          height: 100vh;
          box-shadow: 10px 0 30px rgba(0,0,0,0.2);
          animation: slideIn 0.3s ease-out;
        }
        
        .sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0,0,0,0.4);
          z-index: 998;
          backdrop-filter: blur(2px);
        }

        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      }
    `;
    document.head.appendChild(style);

    // 2. Create an overlay element
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    overlay.style.display = 'none';
    document.body.appendChild(overlay);

    // 3. Toggle Function
    const toggleSidebar = () => {
      const isOpen = sidebar.classList.toggle('sidebar--open');
      overlay.style.display = isOpen ? 'block' : 'none';
      
      // Prevent body scroll when menu is open
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    // 4. Event Listeners
    if (menuBtn) {
      menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleSidebar();
      });
    }

    // Close when clicking the overlay
    overlay.addEventListener('click', toggleSidebar);

    // Close when pressing Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sidebar.classList.contains('sidebar--open')) {
        toggleSidebar();
      }
    });
  });