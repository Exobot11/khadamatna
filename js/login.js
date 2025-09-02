// إعدادات API الأساسية
const API_BASE_URL = window.location.origin;

// ============ تسجيل الدخول عبر Discord ============
async function loginWithDiscord() {
    try {
        const btn = document.querySelector('discord-login-btn');
        if (btn) {
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التوجيه...';
            btn.disabled = true;
        }
        window.location.href = `${API_BASE_URL}/login`;
    } catch (error) {
        console.error('خطأ في تسجيل الدخول:', error);
        resetLoginButton();
        showNotification('فشل في التوجيه لتسجيل الدخول', 'error');
    }
}


// ============ التحقق من حالة المستخدم ============
async function checkAuthStatus() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/user`, {
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error('فشل في التحقق من حالة المستخدم');
        }
        
        const data = await response.json();
        
        if (data.loggedIn && data.user) {
            localStorage.setItem('userData', JSON.stringify(data.user));
            updateAuthUI(data.user);
            return true;
        } else {
            localStorage.removeItem('userData');
            updateAuthUI(null);
            return false;
        }
    } catch (error) {
        console.error('Error checking auth status:', error);
        updateAuthUI(null);
        return false;
    }
}

// ============ تحديث واجهة المستخدم ============
// ============ تحديث واجهة المستخدم ============
function updateAuthUI(user = null) {
    const authContainer = document.querySelector('.header-login');
    if (!authContainer) return;

    if (user) {
        authContainer.innerHTML = `
            <div class="user-profile">
                <div class="avatar-container" onclick="toggleDropdown()">
                    <img src="${user.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'}" 
                         alt="User Avatar" 
                         class="user-avatar"
                         onerror="this.src='https://cdn.discordapp.com/embed/avatars/0.png'">
                    <span class="username">${user.username}</span>
                    <i class="fas fa-caret-down dropdown-icon"></i>
                </div>
                <div class="dropdown-menu" id="dropdown-menu" style="display: none;">
                    <button class="logout-btn" onclick="logout()">
                        <i class="fas fa-sign-out-alt"></i> تسجيل خروج
                    </button>
                </div>
            </div>
        `;
    } else {
        authContainer.innerHTML = `
            <a href="javascript:void(0)" class="login-btn" onclick="loginWithDiscord()">
                <i class="fas fa-user nav-icon"></i>
                <span>تسجيل دخول</span>
            </a>
        `;
    }
}

function createUserProfileHTML(user) {
    return `
        <div class="user-profile">
            <div class="avatar-container">
                <img src="${user.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'}" 
                     class="user-avatar" 
                     alt="صورة المستخدم"
                     onerror="this.src='https://cdn.discordapp.com/embed/avatars/0.png'">
                <span class="username">${user.username}</span>
            </div>
            <div class="dropdown-menu" id="dropdown-menu" style="display:none;">
                <button class="logout-btn">
                    <i class="fas fa-sign-out-alt"></i> تسجيل خروج
                </button>
            </div>
        </div>
    `;
}

// ============ إدارة القائمة المنسدلة ============
function toggleDropdown() {
    const dropdown = document.getElementById('dropdown-menu');
    if (!dropdown) return;
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

// ============ تسجيل الخروج ============
async function logout() {
    try {
        const logoutBtn = document.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري تسجيل الخروج...';
            logoutBtn.disabled = true;
        }

        const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        });

        if (!response.ok) throw new Error('فشل في تسجيل الخروج');

        localStorage.removeItem('userData');
        window.location.href = '/';
    } catch (error) {
        console.error('خطأ في تسجيل الخروج:', error);
        const logoutBtn = document.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> تسجيل خروج';
            logoutBtn.disabled = false;
        }
        showNotification('فشل في تسجيل الخروج، يرجى المحاولة لاحقاً', 'error');
    }
}

// ============ وظائف مساعدة ============
function resetLoginButton() {
    const btn = document.querySelector('.discord-login-btn');
    if (btn) {
        btn.innerHTML = '<i class="fab fa-discord"></i> تسجيل دخول عبر ديسكورد';
        btn.disabled = false;
    }
}

function showNotification(message, type) {
    // يمكنك استبدال هذا بتنفيذ إشعار حقيقي في واجهة المستخدم
    alert(message);
}

// ============ تهيئة الصفحة عند التحميل ============
document.addEventListener('DOMContentLoaded', async function() {
    // التحقق من حالة المصادقة عند تحميل الصفحة
    const cachedUser = localStorage.getItem('userData');
    if (cachedUser) {
        updateAuthUI(JSON.parse(cachedUser));
    }
    
    await checkAuthStatus();
});
fetch("header.html")
    .then(response => response.text())
    .then(async data => {
        const headerContainer = document.getElementById("header-container");
        if (headerContainer) {
            headerContainer.innerHTML = data;
            
            // تحقق من وجود بيانات المستخدم والتوكن في localStorage
            const cachedUser = localStorage.getItem('userData');
            const authToken = localStorage.getItem('authToken');
            
            if (cachedUser && authToken) {
                updateAuthUI(JSON.parse(cachedUser));
            }
            
            // تحقق من حالة المصادقة مع الخادم
            await checkAuthStatus();
        }
    })
    .catch(error => console.error("Error loading header:", error));

// === تعريض الوظائف للعالم الخارجي ===
window.loginWithDiscord = loginWithDiscord;
window.logout = logout;
window.toggleDropdown = toggleDropdown;
