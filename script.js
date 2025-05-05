document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const form = document.getElementById('timeCodeForm');
    const timeCodeInput = document.getElementById('timeCodeInput');
    const submitButton = document.getElementById('submitButton');
    const resultContainer = document.getElementById('resultContainer');
    const timeCoordDisplay = document.getElementById('timeCoordDisplay');
    const systemStatusDisplay = document.getElementById('systemStatus');
    const systemStatusContainer = document.getElementById('systemStatusContainer');
    
    // Constants
    const correctTimeCode = '3025-05-05-16:04';
    const videoUrl = 'https://drive.google.com/file/d/1df3FSA8IhwY469DRq10UX9A7LCFUB4SM/view?usp=drivesdk';
    
    // Variables
    let isSubmitting = false;
    let statusInterval;
    let currentStatus = 'SYS: READY';
    
    // Functions
    function formatTimeCode(value) {
        // Remove non-digit characters
        const digitsOnly = value.replace(/[^0-9]/g, '');
        let formattedValue = '';
        
        // Format as YYYY-MM-DD-HH:MM
        if (digitsOnly.length > 0) {
            formattedValue += digitsOnly.substring(0, Math.min(4, digitsOnly.length));
        }
        
        if (digitsOnly.length > 4) {
            formattedValue += '-' + digitsOnly.substring(4, Math.min(6, digitsOnly.length));
        }
        
        if (digitsOnly.length > 6) {
            formattedValue += '-' + digitsOnly.substring(6, Math.min(8, digitsOnly.length));
        }
        
        if (digitsOnly.length > 8) {
            formattedValue += '-' + digitsOnly.substring(8, Math.min(10, digitsOnly.length));
            
            if (digitsOnly.length > 10) {
                formattedValue += ':' + digitsOnly.substring(10, Math.min(12, digitsOnly.length));
            }
        }
        
        return formattedValue;
    }
    
    function updateSystemStatus(status, isError = false, isSuccess = false) {
        systemStatusDisplay.textContent = status;
        currentStatus = status;
        
        // Update status color
        if (isError) {
            systemStatusContainer.classList.add('text-red-500');
            systemStatusContainer.style.color = 'var(--error-red)';
        } else if (isSuccess) {
            systemStatusContainer.classList.add('text-green-500');
            systemStatusContainer.style.color = 'var(--success-green)';
        } else {
            systemStatusContainer.classList.remove('text-red-500', 'text-green-500');
            systemStatusContainer.style.color = '';
        }
    }
    
    function startStatusCycle() {
        if (statusInterval) {
            clearInterval(statusInterval);
        }
        
        const statusMessages = ['SYS: READY', 'SYS: SCANNING', 'SYS: STANDBY'];
        let currentIndex = 0;
        
        statusInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % statusMessages.length;
            updateSystemStatus(statusMessages[currentIndex]);
        }, 2000);
    }
    
    function showErrorMessage() {
        resultContainer.innerHTML = `
            <div class="error-message">
                <div>
                    <i class="ri-error-warning-line error-icon"></i>
                    <span class="error-title">오류 발생</span>
                </div>
                <p>타임트래블이 불가능한 코드입니다</p>
            </div>
        `;
        
        updateSystemStatus('SYS: ERROR', true, false);
        
        // Reset system status after error
        setTimeout(() => {
            updateSystemStatus('SYS: READY');
            startStatusCycle();
        }, 3000);
    }
    
    function showSuccessMessage() {
        resultContainer.innerHTML = `
            <div class="success-message">
                <div>
                    <i class="ri-check-line success-icon"></i>
                    <span class="success-title">타임트래블 성공!</span>
                </div>
                <p>시간 여행을 시작합니다</p>
            </div>
            
            <div class="video-button-container">
                <div class="portal-icon">
                    <div class="portal-pulse"></div>
                    <div class="portal-inner">
                        <i class="ri-play-fill"></i>
                    </div>
                </div>
                
                <a 
                    href="${videoUrl}"
                    target="_blank"
                    rel="noopener noreferrer" 
                    class="video-link"
                >
                    영상 보기
                </a>
            </div>
        `;
        
        updateSystemStatus('SYS: ACTIVATED', false, true);
    }
    
    // Event listeners
    timeCodeInput.addEventListener('input', (e) => {
        const value = e.target.value;
        const formattedValue = formatTimeCode(value);
        
        // Only update if the value is different to avoid cursor jumping
        if (formattedValue !== value) {
            timeCodeInput.value = formattedValue;
        }
        
        // Update time coordinate display
        timeCoordDisplay.textContent = ` T-COORD: ${formattedValue || '0000-00-00-00:00'}`;
        
        // Clear result if input changes
        resultContainer.innerHTML = '';
        
        // Reset system status if it was in error or success state
        if (currentStatus === 'SYS: ERROR' || currentStatus === 'SYS: ACTIVATED') {
            updateSystemStatus('SYS: READY');
            startStatusCycle();
        }
    });
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (isSubmitting) return;
        
        isSubmitting = true;
        clearInterval(statusInterval);
        updateSystemStatus('SYS: PROCESSING');
        
        // Add spinning animation to button icon
        const buttonIcon = submitButton.querySelector('.submit-icon');
        buttonIcon.classList.add('spinning-button-icon');
        
        // Disable button
        submitButton.disabled = true;
        
        // Simulate processing delay
        setTimeout(() => {
            // Remove spinning animation
            buttonIcon.classList.remove('spinning-button-icon');
            
            // Enable button
            submitButton.disabled = false;
            
            if (timeCodeInput.value === correctTimeCode) {
                showSuccessMessage();
            } else {
                showErrorMessage();
            }
            
            isSubmitting = false;
        }, 1000);
    });
    
    // Initialize
    startStatusCycle();
});