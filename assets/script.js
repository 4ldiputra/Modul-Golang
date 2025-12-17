const ACCESS_CODE = "GO2025SECURE";
let completedSections = new Set();
const totalSections = 11;  // ← UBAH DARI 12 JADI 11

// Mapping section ID ke file HTML (HAPUS STRUCT)
const sectionFiles = {
    'pengenalan': 'sections/section-1-pengenalan.html',
    'variabel': './sections/section-2-variabel.html',
    'operator': 'sections/section-3-operator.html',
    'percabangan': 'sections/section-4-percabangan.html',
    'perulangan': 'sections/section-5-perulangan.html',
    'array': 'sections/section-6-array.html',
    'map': 'sections/section-7-map.html',
    'komposisi': 'sections/section-8-komposisi.html',
    'fungsi': 'sections/section-9-fungsi.html',
    'pointer': 'sections/section-10-pointer.html',
    'proyek': 'sections/section-11-proyek.html'
};

// Fungsi cek akses login
function checkAccess() {
    const inputCode = document.getElementById('accessCode').value.trim();
    const errorMessage = document.getElementById('errorMessage');
    
    if (inputCode === ACCESS_CODE) {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('mainContent').style.display = 'block';
        sessionStorage.setItem('isAuthenticated', 'true');
        
        // Load section pertama
        showSection('pengenalan', document.querySelector('.nav-item'));
        completedSections.add('pengenalan');
        updateProgress();
        showNotification('Login berhasil! Selamat belajar!', 'success');
    } else {
        errorMessage.textContent = 'Kode akses tidak valid!';
        errorMessage.style.display = 'block';
        document.getElementById('accessCode').value = '';
        document.getElementById('accessCode').focus();
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 3000);
    }
}

// Fungsi load section dari file eksternal
async function loadSection(sectionId) {
    const contentArea = document.getElementById('contentArea');
    const filePath = sectionFiles[sectionId];
    
    if (!filePath) {
        contentArea.innerHTML = '<p style="color: red;">Section tidak ditemukan!</p>';
        return;
    }
    
    try {
        contentArea.innerHTML = '<div id="loadingMessage">Memuat konten...</div>';
        
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error('File tidak ditemukan');
        }
        
        const html = await response.text();
        contentArea.innerHTML = html;
        
        // Re-attach event listeners untuk code blocks
        attachCodeBlockListeners();
        
    } catch (error) {
        contentArea.innerHTML = `
            <div style="text-align: center; padding: 50px;">
                <h3 style="color: #e74c3c;">⚠️ Gagal Memuat Konten</h3>
                <p style="color: #7f8c8d;">File section tidak ditemukan: <strong>${filePath}</strong></p>
                <p style="color: #7f8c8d;">Pastikan file tersebut ada di folder yang benar.</p>
            </div>
        `;
        console.error('Error loading section:', error);
    }
}

// Fungsi show section
function showSection(sectionId, buttonElement) {
    // Update active nav button
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    
    // Set active button
    if (buttonElement) {
        buttonElement.classList.add('active');
    }
    
    // Load section content
    loadSection(sectionId);
    
    // Update progress
    completedSections.add(sectionId);
    updateProgress();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Fungsi update progress
function updateProgress() {
    const progress = (completedSections.size / totalSections) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    document.getElementById('progressText').textContent = 
        `Progress: ${Math.round(progress)}% (${completedSections.size}/${totalSections})`;
}

// Fungsi show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : '#00ADD8'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Fungsi attach code block listeners
function attachCodeBlockListeners() {
    const codeBlocks = document.querySelectorAll('.code-block');
    codeBlocks.forEach(block => {
        block.addEventListener('click', function() {
            navigator.clipboard.writeText(this.textContent).then(() => {
                showNotification('Kode berhasil disalin!', 'success');
            });
        });
    });
}

// Event listener saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    // Tampilkan login screen
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('mainContent').style.display = 'none';
    
    // Auto focus ke input
    setTimeout(() => {
        document.getElementById('accessCode').focus();
    }, 500);
});

// Event listener untuk Enter key di login
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && document.getElementById('loginScreen').style.display !== 'none') {
        checkAccess();
    }
});