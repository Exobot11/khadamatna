document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const closeBtn = document.getElementById('closeBtn');
  const sidebarNav = document.getElementById('sidebarNav');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const menuItems = document.querySelectorAll('.menu-item');
  const header = document.querySelector('.main-header');
  
  // Toggle sidebar
  function toggleSidebar() {
    hamburgerBtn.classList.toggle('active');
    sidebarNav.classList.toggle('active');
    sidebarOverlay.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
  }
  
  // Close sidebar
  function closeSidebar() {
    hamburgerBtn.classList.remove('active');
    sidebarNav.classList.remove('active');
    sidebarOverlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
  }
  
  // Header scroll effect
  function handleScroll() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
    
  document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll(".nav-item");
    const currentPath = window.location.pathname;

    links.forEach(link => {
      if (link.getAttribute("href") === currentPath) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  });

  
  // Menu item click animation
  function animateMenuItemClick(e) {
    e.preventDefault();
    const target = e.currentTarget;
    
    // Add click animation
    target.classList.add('clicked');
    
    // Remove animation after it completes
    setTimeout(() => {
      target.classList.remove('clicked');
    }, 300);
    
    // Navigate after animation
    setTimeout(() => {
      window.location.href = target.getAttribute('href');
    }, 300);
  }
  
  // Event listeners
  hamburgerBtn.addEventListener('click', toggleSidebar);
  closeBtn.addEventListener('click', closeSidebar);
  sidebarOverlay.addEventListener('click', closeSidebar);
  window.addEventListener('scroll', handleScroll);
  
  // Add click animation to menu items
  menuItems.forEach(item => {
    item.addEventListener('click', animateMenuItemClick);
  });
  
  // Close sidebar when clicking outside
  document.addEventListener('click', (e) => {
    if (!sidebarNav.contains(e.target) && e.target !== hamburgerBtn) {
      closeSidebar();
    }
  });
  
  // Initialize header state
  handleScroll();
  
  // Add emoji animation on hover
  menuItems.forEach(item => {
    const emoji = item.querySelector('.emoji');
    const originalEmoji = item.getAttribute('data-emoji');
    
    item.addEventListener('mouseenter', () => {
      emoji.textContent = originalEmoji;
      emoji.style.animation = 'bounce 0.5s';
    });
    
    item.addEventListener('mouseleave', () => {
      emoji.style.animation = '';
    });
    
    emoji.addEventListener('animationend', () => {
      emoji.style.animation = '';
    });
  });
});

// Add bounce animation for emojis
const style = document.createElement('style');
style.textContent = `
  @keyframes bounce {
    0%, 100% { transform: translateY(0) rotate(0); }
    25% { transform: translateY(-5px) rotate(5deg); }
    50% { transform: translateY(0) rotate(0); }
    75% { transform: translateY(-3px) rotate(-5deg); }
  }
`;
document.head.appendChild(style);
