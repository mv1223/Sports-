// Sports Registration System JavaScript

class SportsRegistrationSystem {
    constructor() {
        this.currentUser = null;
        this.users = this.loadUsers();
        this.currentTest = null;
        this.mediaRecorder = null;
        this.recordedChunks = [];
        this.recordingStartTime = null;
        this.recordingTimer = null;
        this.testResults = this.loadTestResults();
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkAuthStatus();
    }

    bindEvents() {
        // Form submissions
        document.getElementById('signUpForm').addEventListener('submit', (e) => this.handleSignUp(e));
        document.getElementById('signInForm').addEventListener('submit', (e) => this.handleSignIn(e));
        document.getElementById('editProfileForm').addEventListener('submit', (e) => this.handleEditProfile(e));

        // Video recording events
        document.getElementById('startRecordingBtn').addEventListener('click', () => this.startRecording());
        document.getElementById('stopRecordingBtn').addEventListener('click', () => this.stopRecording());
        document.getElementById('retakeBtn').addEventListener('click', () => this.retakeRecording());
        document.getElementById('uploadBtn').addEventListener('click', () => this.uploadVideo());

        // Bottom navigation
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
            });
        });
    }

    // User Management
    loadUsers() {
        const users = localStorage.getItem('sportsUsers');
        return users ? JSON.parse(users) : [];
    }

    saveUsers() {
        localStorage.setItem('sportsUsers', JSON.stringify(this.users));
    }

    loadTestResults() {
        const results = localStorage.getItem('sportsTestResults');
        return results ? JSON.parse(results) : [];
    }

    saveTestResults() {
        localStorage.setItem('sportsTestResults', JSON.stringify(this.testResults));
    }

    generateUserId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Authentication
    checkAuthStatus() {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            this.currentUser = JSON.parse(currentUser);
            this.showDashboard();
        } else {
            this.showWelcome();
        }
    }

    signIn(email, password) {
        const user = this.users.find(u => u.email === email && u.password === password);
        if (user) {
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.showDashboard();
            this.showNotification('Welcome back!', 'success');
            return true;
        }
        return false;
    }

    signUp(userData) {
        // Check if user already exists
        if (this.users.find(u => u.email === userData.email)) {
            this.showNotification('User with this email already exists!', 'error');
            return false;
        }

        // Create new user
        const newUser = {
            id: this.generateUserId(),
            ...userData,
            createdAt: new Date().toISOString()
        };

        this.users.push(newUser);
        this.saveUsers();
        this.currentUser = newUser;
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        this.showDashboard();
        this.showNotification('Account created successfully!', 'success');
        return true;
    }

    signOut() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.showWelcome();
        this.showNotification('Signed out successfully!', 'success');
    }

    updateUser(updatedData) {
        const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
            this.users[userIndex] = { ...this.currentUser, ...updatedData };
            this.currentUser = this.users[userIndex];
            this.saveUsers();
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            this.showDashboard();
            this.showNotification('Profile updated successfully!', 'success');
            return true;
        }
        return false;
    }

    // UI Management
    showWelcome() {
        this.hideAllSections();
        document.getElementById('welcomeSection').style.display = 'block';
        document.getElementById('authButtons').style.display = 'flex';
        document.getElementById('userProfile').style.display = 'none';
        document.getElementById('bottomNav').style.display = 'none';
    }

    showSignUp() {
        this.hideAllSections();
        document.getElementById('signUpSection').style.display = 'block';
        document.getElementById('authButtons').style.display = 'flex';
        document.getElementById('userProfile').style.display = 'none';
        document.getElementById('bottomNav').style.display = 'none';
    }

    showSignIn() {
        this.hideAllSections();
        document.getElementById('signInSection').style.display = 'block';
        document.getElementById('authButtons').style.display = 'flex';
        document.getElementById('userProfile').style.display = 'none';
        document.getElementById('bottomNav').style.display = 'none';
    }

    showDashboard() {
        this.hideAllSections();
        document.getElementById('dashboardSection').style.display = 'block';
        document.getElementById('authButtons').style.display = 'none';
        document.getElementById('userProfile').style.display = 'flex';
        document.getElementById('bottomNav').style.display = 'flex';
        this.populateDashboard();
        this.updateBottomNav('home');
    }

    showEditProfile() {
        this.hideAllSections();
        document.getElementById('editProfileSection').style.display = 'block';
        document.getElementById('authButtons').style.display = 'none';
        document.getElementById('userProfile').style.display = 'flex';
        document.getElementById('bottomNav').style.display = 'flex';
        this.populateEditForm();
        this.updateBottomNav('profile');
    }

    showTests() {
        this.hideAllSections();
        document.getElementById('testsSection').style.display = 'block';
        document.getElementById('authButtons').style.display = 'none';
        document.getElementById('userInfo').style.display = 'flex';
        this.updateProgressStats();
    }

    showVideoRecording(testType) {
        this.hideAllSections();
        document.getElementById('videoSection').style.display = 'block';
        document.getElementById('authButtons').style.display = 'none';
        document.getElementById('userProfile').style.display = 'flex';
        document.getElementById('bottomNav').style.display = 'flex';
        this.setupVideoRecording(testType);
    }

    showTestResults(testData) {
        this.hideAllSections();
        document.getElementById('resultsSection').style.display = 'block';
        document.getElementById('authButtons').style.display = 'none';
        document.getElementById('userInfo').style.display = 'flex';
        this.populateTestResults(testData);
    }

    hideAllSections() {
        const sections = ['welcomeSection', 'signUpSection', 'signInSection', 'dashboardSection', 'editProfileSection', 'testsSection', 'videoSection', 'resultsSection', 'leaderboardSection'];
        sections.forEach(section => {
            document.getElementById(section).style.display = 'none';
        });
    }

    updateBottomNav(activeTab) {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => item.classList.remove('active'));
        
        const tabMap = {
            'home': 0,
            'tests': 1,
            'rankings': 2,
            'profile': 3
        };
        
        if (tabMap[activeTab] !== undefined) {
            navItems[tabMap[activeTab]].classList.add('active');
        }
    }

    showTests() {
        this.hideAllSections();
        document.getElementById('testsSection').style.display = 'block';
        document.getElementById('authButtons').style.display = 'none';
        document.getElementById('userProfile').style.display = 'flex';
        document.getElementById('bottomNav').style.display = 'flex';
        this.updateBottomNav('tests');
    }

    showLeaderboard() {
        this.hideAllSections();
        document.getElementById('leaderboardSection').style.display = 'block';
        document.getElementById('authButtons').style.display = 'none';
        document.getElementById('userProfile').style.display = 'flex';
        document.getElementById('bottomNav').style.display = 'flex';
        this.updateBottomNav('rankings');
        this.updateLeaderboard();
    }

    showProfile() {
        this.showEditProfile();
        this.updateBottomNav('profile');
    }

    showProgress() {
        // Show progress/analytics
        this.showNotification('Progress tracking coming soon!', 'info');
    }

    showResults() {
        // Show results history
        this.showNotification('Results history coming soon!', 'info');
    }

    populateDashboard() {
        if (!this.currentUser) return;

        document.getElementById('dashboardName').textContent = this.currentUser.firstName;
        
        // Update stats
        const testResults = this.loadTestResults();
        const completedTests = Object.keys(testResults).length;
        document.getElementById('completedTests').textContent = completedTests;
        
        // Update badges
        const badges = this.calculateBadges();
        document.getElementById('badgesEarned').textContent = badges;
        
        // Update rank
        const userRank = this.getUserRank();
        document.getElementById('userRank').textContent = userRank > 0 ? `#${userRank}` : '-';
        
        // Update progress stats
        this.updateProgressStats();
    }

    populateEditForm() {
        if (!this.currentUser) return;

        // Map old field names to new form IDs
        const fieldMap = {
            'firstName': 'editName',
            'email': 'editEmail',
            'phone': 'editPhone',
            'age': 'editAge',
            'gender': 'editGender',
            'height': 'editHeight',
            'weight': 'editWeight'
        };

        Object.entries(fieldMap).forEach(([oldField, newId]) => {
            const element = document.getElementById(newId);
            if (element && this.currentUser[oldField]) {
                element.value = this.currentUser[oldField];
            }
        });
    }

    // Form Handlers
    handleSignUp(e) {
        e.preventDefault();
        
        // Get form data from new form structure
        const userData = {
            firstName: document.getElementById('signUpName').value,
            email: document.getElementById('signUpEmail').value,
            phone: document.getElementById('signUpPhone').value,
            age: parseInt(document.getElementById('signUpAge').value),
            gender: document.getElementById('signUpGender').value,
            height: parseInt(document.getElementById('signUpHeight').value),
            weight: parseInt(document.getElementById('signUpWeight').value),
            password: document.getElementById('signUpPassword').value
        };
        
        // Validate required fields
        if (!this.validateSignUpData(userData)) {
            return;
        }

        this.signUp(userData);
        e.target.reset();
    }

    handleSignIn(e) {
        e.preventDefault();
        
        // Get form data from new form structure
        const email = document.getElementById('signInEmail').value;
        const password = document.getElementById('signInPassword').value;

        if (!email || !password) {
            this.showNotification('Please fill in all fields!', 'error');
            return;
        }

        if (!this.signIn(email, password)) {
            this.showNotification('Invalid email or password!', 'error');
        }
        
        e.target.reset();
    }

    handleEditProfile(e) {
        e.preventDefault();
        
        // Get form data from new form structure
        const updatedData = {
            firstName: document.getElementById('editName').value,
            email: document.getElementById('editEmail').value,
            phone: document.getElementById('editPhone').value,
            age: parseInt(document.getElementById('editAge').value),
            gender: document.getElementById('editGender').value,
            height: parseInt(document.getElementById('editHeight').value),
            weight: parseInt(document.getElementById('editWeight').value)
        };
        
        // Validate required fields
        if (!this.validateEditData(updatedData)) {
            return;
        }

        this.updateUser(updatedData);
        this.showNotification('Profile updated successfully!', 'success');
        this.showDashboard();
    }

    // Validation
    validateSignUpData(data) {
        const required = ['firstName', 'email', 'password', 'age', 'gender', 'height', 'weight'];
        
        for (let field of required) {
            if (!data[field]) {
                this.showNotification(`Please fill in ${field}!`, 'error');
                return false;
            }
        }

        if (data.password.length < 6) {
            this.showNotification('Password must be at least 6 characters!', 'error');
            return false;
        }

        if (data.age < 13 || data.age > 100) {
            this.showNotification('Age must be between 13 and 100!', 'error');
            return false;
        }

        if (!this.isValidEmail(data.email)) {
            this.showNotification('Please enter a valid email address!', 'error');
            return false;
        }

        return true;
    }

    validateEditData(data) {
        const required = ['firstName', 'lastName', 'email', 'age', 'sport', 'experience'];
        
        for (let field of required) {
            if (!data[field]) {
                this.showNotification(`Please fill in ${field}!`, 'error');
                return false;
            }
        }

        if (data.age < 13 || data.age > 100) {
            this.showNotification('Age must be between 13 and 100!', 'error');
            return false;
        }

        if (!this.isValidEmail(data.email)) {
            this.showNotification('Please enter a valid email address!', 'error');
            return false;
        }

        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Utility Functions
    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        const messageElement = document.getElementById('notificationMessage');
        
        messageElement.textContent = message;
        notification.className = `notification ${type}`;
        notification.style.display = 'flex';
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            this.hideNotification();
        }, 5000);
    }

    hideNotification() {
        document.getElementById('notification').style.display = 'none';
    }

    // Video Recording and Testing Methods
    setupVideoRecording(testType) {
        this.currentTest = testType;
        const testConfig = this.getTestConfig(testType);
        
        document.getElementById('testTitle').textContent = testConfig.title;
        document.getElementById('instructionText').textContent = testConfig.instructions;
        document.getElementById('testDuration').textContent = testConfig.duration + ' min';
        document.getElementById('testDifficulty').textContent = testConfig.difficulty || 'Medium';
        
        this.initializeCamera();
        this.resetVideoControls();
    }

    getTestConfig(testType) {
        const configs = {
            height: {
                title: 'Height Measurement',
                instructions: 'Stand straight against a wall with your back flat. Ensure your heels, buttocks, and shoulders touch the wall. Look straight ahead. Record for 5 seconds showing your full body from side view.',
                qualityTested: 'Physical Measurement',
                duration: 2,
                difficulty: 'Easy',
                requiresMeasurement: true
            },
            weight: {
                title: 'Weight Measurement',
                instructions: 'Stand on a weighing scale with minimal clothing. Ensure the scale is on a flat surface. Record for 5 seconds showing the scale reading clearly.',
                qualityTested: 'Physical Measurement',
                duration: 1,
                difficulty: 'Easy',
                requiresMeasurement: true
            },
            sitAndReach: {
                title: 'Sit and Reach',
                instructions: 'Sit on the floor with legs straight and feet against a box. Reach forward as far as possible and hold for 3 seconds. Record from side view showing the measurement.',
                qualityTested: 'Flexibility',
                duration: 3,
                difficulty: 'Medium',
                requiresMeasurement: true
            },
            verticalJump: {
                title: 'Vertical Jump',
                instructions: 'Stand next to a wall with arm raised. Jump as high as possible and mark the highest point. Record from side view showing the jump and measurement.',
                qualityTested: 'Lower Body Explosive Strength',
                duration: 5,
                difficulty: 'Hard',
                requiresMeasurement: true
            },
            broadJump: {
                title: 'Broad Jump',
                instructions: 'Stand behind a line with feet together. Jump forward as far as possible landing on both feet. Record from side view showing the jump and measurement.',
                qualityTested: 'Lower Body Explosive Strength',
                duration: 5,
                difficulty: 'Hard',
                requiresMeasurement: true
            },
            medicineBall: {
                title: 'Medicine Ball Throw',
                instructions: 'Stand behind a line holding a medicine ball. Throw the ball forward as far as possible using both hands. Record from side view showing the throw and measurement.',
                qualityTested: 'Upper Body Strength',
                duration: 5,
                difficulty: 'Hard',
                requiresMeasurement: true
            },
            sprint30m: {
                title: '30m Sprint',
                instructions: 'Start from a standing position behind the start line. Run 30 meters as fast as possible. Record from side view showing the complete run with timing.',
                qualityTested: 'Speed',
                duration: 5,
                difficulty: 'Hard',
                requiresTiming: true
            },
            shuttleRun: {
                title: 'Shuttle Run',
                instructions: 'Run 4 times between two lines 10 meters apart. Touch the line with your hand each time. Record from side view showing all 4 runs with timing.',
                qualityTested: 'Agility',
                duration: 5,
                difficulty: 'Hard',
                requiresTiming: true
            },
            sitUps: {
                title: 'Sit Ups',
                instructions: 'Lie on your back with knees bent and feet flat. Perform as many sit-ups as possible in 60 seconds. Record from side view showing proper form.',
                qualityTested: 'Core Strength',
                duration: 3,
                difficulty: 'Medium',
                requiresCounting: true
            },
            enduranceRun: {
                title: 'Endurance Run',
                instructions: 'Run 800m (U-12) or 1.6km (12+ years) as fast as possible. Record from side view showing the complete run with timing.',
                qualityTested: 'Endurance',
                duration: 10,
                difficulty: 'Hard',
                requiresTiming: true
            }
        };
        return configs[testType] || configs.height;
    }

    async initializeCamera() {
        try {
            // Request high-quality camera with optimal settings
            const constraints = {
                video: {
                    width: { ideal: 1920, min: 1280 },
                    height: { ideal: 1080, min: 720 },
                    frameRate: { ideal: 30, min: 24 },
                    facingMode: 'environment', // Use back camera on mobile
                    aspectRatio: 16/9
                },
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                    sampleRate: 44100
                }
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            
            const videoElement = document.getElementById('videoElement');
            videoElement.srcObject = stream;
            
            // Set up high-quality media recorder
            const mimeType = this.getSupportedMimeType();
            this.mediaRecorder = new MediaRecorder(stream, {
                mimeType: mimeType,
                videoBitsPerSecond: 2500000, // 2.5 Mbps for high quality
                audioBitsPerSecond: 128000   // 128 kbps for audio
            });
            
            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.recordedChunks.push(event.data);
                }
            };
            
            this.mediaRecorder.onstop = () => {
                this.handleRecordingStop();
            };

            // Update quality indicator
            this.updateVideoQualityIndicator(stream);
            
        } catch (error) {
            this.showNotification('Camera access denied. Please allow camera access to record tests.', 'error');
            console.error('Camera access error:', error);
        }
    }

    getSupportedMimeType() {
        const types = [
            'video/webm;codecs=vp9,opus',
            'video/webm;codecs=vp8,opus',
            'video/webm;codecs=h264,opus',
            'video/mp4;codecs=h264,aac',
            'video/webm'
        ];
        
        for (let type of types) {
            if (MediaRecorder.isTypeSupported(type)) {
                return type;
            }
        }
        return 'video/webm';
    }

    updateVideoQualityIndicator(stream) {
        const videoTrack = stream.getVideoTracks()[0];
        if (videoTrack) {
            const settings = videoTrack.getSettings();
            const quality = settings.width >= 1920 ? '4K Ready' : 
                          settings.width >= 1280 ? 'HD Ready' : 'SD Ready';
            
            document.getElementById('videoQualityIndicator').innerHTML = 
                `<i class="fas fa-video"></i><span>${quality}</span>`;
        }
    }

    resetVideoControls() {
        document.getElementById('startRecordingBtn').style.display = 'inline-block';
        document.getElementById('stopRecordingBtn').style.display = 'none';
        document.getElementById('retakeBtn').style.display = 'none';
        document.getElementById('uploadBtn').style.display = 'none';
        document.getElementById('recordingOverlay').style.display = 'none';
    }

    startRecording() {
        if (!this.mediaRecorder) {
            this.showNotification('Camera not initialized. Please refresh and try again.', 'error');
            return;
        }

        this.recordedChunks = [];
        this.recordingStartTime = Date.now();
        
        this.mediaRecorder.start();
        
        document.getElementById('startRecordingBtn').style.display = 'none';
        document.getElementById('stopRecordingBtn').style.display = 'inline-block';
        document.getElementById('recordingOverlay').style.display = 'flex';
        
        this.startRecordingTimer();
        this.showNotification('Recording started!', 'success');
    }

    stopRecording() {
        if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
            this.mediaRecorder.stop();
            this.stopRecordingTimer();
        }
    }

    startRecordingTimer() {
        this.recordingTimer = setInterval(() => {
            const elapsed = Date.now() - this.recordingStartTime;
            const minutes = Math.floor(elapsed / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);
            document.getElementById('recordingTimer').textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    stopRecordingTimer() {
        if (this.recordingTimer) {
            clearInterval(this.recordingTimer);
            this.recordingTimer = null;
        }
    }

    handleRecordingStop() {
        document.getElementById('stopRecordingBtn').style.display = 'none';
        document.getElementById('retakeBtn').style.display = 'inline-block';
        document.getElementById('uploadBtn').style.display = 'inline-block';
        document.getElementById('recordingOverlay').style.display = 'none';
        
        this.showNotification('Recording completed! You can now preview and upload.', 'success');
    }

    retakeRecording() {
        this.recordedChunks = [];
        this.resetVideoControls();
        this.showNotification('Ready to record again!', 'success');
    }

    async uploadVideo() {
        if (this.recordedChunks.length === 0) {
            this.showNotification('No video recorded. Please record a video first.', 'error');
            return;
        }

        const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(blob);
        
        // Show AI analysis section
        document.getElementById('aiAnalysis').style.display = 'block';
        
        // Perform AI analysis
        const analysisResults = await this.performAIAnalysis(blob, this.currentTest);
        
        // Save test result with AI analysis
        const testResult = {
            id: this.generateUserId(),
            userId: this.currentUser.id,
            testType: this.currentTest,
            videoUrl: videoUrl,
            score: analysisResults.performanceScore,
            aiAnalysis: analysisResults,
            completedAt: new Date().toISOString(),
            status: 'verified',
            benchmark: this.calculateBenchmark(analysisResults.performanceScore, this.currentTest)
        };
        
        this.testResults.push(testResult);
        this.saveTestResults();
        
        // Submit to SAI (simulated)
        await this.submitToSAI(testResult);
        
        this.showTestResults(testResult);
        this.showNotification('Video analyzed and submitted to SAI successfully!', 'success');
    }

    generatePlaceholderScore() {
        // Generate a random score between 60-100 for demonstration
        return Math.floor(Math.random() * 41) + 60;
    }

    populateTestResults(testData) {
        document.getElementById('resultTestName').textContent = this.getTestConfig(testData.testType).title;
        document.getElementById('scoreNumber').textContent = testData.score;
        document.getElementById('resultVideo').src = testData.videoUrl;
    }

    updateProgressStats() {
        const userResults = this.testResults.filter(result => result.userId === this.currentUser.id);
        const completedTests = userResults.length;
        const totalScore = userResults.reduce((sum, result) => sum + result.score, 0);
        const badgesEarned = this.calculateBadges(userResults);

        document.getElementById('completedTests').textContent = completedTests;
        document.getElementById('totalScore').textContent = totalScore;
        document.getElementById('badgesEarned').textContent = badgesEarned;
    }

    calculateBadges(userResults) {
        let badges = 0;
        
        // Badge for completing first test
        if (userResults.length >= 1) badges++;
        
        // Badge for completing all test types
        const testTypes = [...new Set(userResults.map(r => r.testType))];
        if (testTypes.length >= 10) badges++;
        
        // Badge for high average score
        const avgScore = userResults.reduce((sum, r) => sum + r.score, 0) / userResults.length;
        if (avgScore >= 85) badges++;
        
        // Badge for national ranking
        const userRank = this.getUserRank();
        if (userRank <= 100) badges++;
        
        return badges;
    }

    // Advanced AI Analysis Methods
    async performAIAnalysis(videoBlob, testType) {
        // Show AI analysis overlay
        document.getElementById('aiAnalysisOverlay').style.display = 'flex';
        
        // Perform comprehensive AI analysis
        const analysis = await this.runAdvancedAIAnalysis(videoBlob, testType);
        
        this.updateAIAnalysisDisplay(analysis);
        return analysis;
    }

    async runAdvancedAIAnalysis(videoBlob, testType) {
        const analysis = {
            videoQuality: await this.analyzeVideoQualityAdvanced(videoBlob),
            movementDetection: await this.analyzeMovementDetectionAdvanced(testType),
            cheatDetection: await this.analyzeCheatDetectionAdvanced(videoBlob),
            performanceScore: await this.calculatePerformanceScoreAdvanced(testType),
            repCount: await this.analyzeRepetitionsAdvanced(testType),
            timing: await this.analyzeTimingAdvanced(testType),
            formScore: await this.analyzeFormAdvanced(testType),
            biometricAnalysis: await this.analyzeBiometrics(videoBlob),
            motionTracking: await this.analyzeMotionTracking(videoBlob, testType),
            aiConfidence: await this.calculateAIConfidence(testType)
        };
        
        return analysis;
    }

    async analyzeVideoQualityAdvanced(videoBlob) {
        // Simulate advanced video quality analysis
        await this.delay(1000);
        
        const qualityMetrics = {
            resolution: '1920x1080',
            frameRate: 30,
            bitrate: '2.5 Mbps',
            compression: 'H.264',
            stability: Math.random() > 0.1 ? 'Stable' : 'Unstable',
            lighting: Math.random() > 0.2 ? 'Good' : 'Poor',
            sharpness: Math.random() > 0.15 ? 'Sharp' : 'Blurry'
        };
        
        return qualityMetrics;
    }

    async analyzeMovementDetectionAdvanced(testType) {
        await this.delay(1500);
        
        const movements = {
            height: 'Standing posture detected with 95% confidence',
            weight: 'Scale reading visible and clear',
            sitAndReach: 'Reaching movement detected with proper form',
            verticalJump: 'Jumping motion detected with peak height analysis',
            broadJump: 'Jumping motion detected with distance measurement',
            medicineBall: 'Throwing motion detected with trajectory analysis',
            sprint30m: 'Running motion detected with speed analysis',
            shuttleRun: 'Shuttle run pattern detected with direction changes',
            sitUps: 'Sit-up repetitions detected with form analysis',
            enduranceRun: 'Running motion detected with endurance metrics'
        };
        
        return movements[testType] || 'Movement detected with high confidence';
    }

    async analyzeCheatDetectionAdvanced(videoBlob) {
        await this.delay(2000);
        
        const cheatAnalysis = {
            videoAuthenticity: Math.random() > 0.05 ? 'Authentic' : 'Suspicious',
            tamperDetection: Math.random() > 0.03 ? 'No tampering detected' : 'Potential tampering',
            consistencyCheck: Math.random() > 0.02 ? 'Consistent' : 'Inconsistent',
            lightingAnalysis: Math.random() > 0.1 ? 'Natural lighting' : 'Artificial lighting detected',
            motionContinuity: Math.random() > 0.05 ? 'Smooth motion' : 'Discontinuous motion',
            audioSync: Math.random() > 0.08 ? 'Audio synchronized' : 'Audio desync detected',
            metadataCheck: Math.random() > 0.02 ? 'Metadata valid' : 'Metadata suspicious'
        };
        
        return cheatAnalysis;
    }

    async calculatePerformanceScoreAdvanced(testType) {
        await this.delay(1000);
        
        // Advanced scoring algorithm
        const baseScores = {
            height: 85,
            weight: 90,
            sitAndReach: 75,
            verticalJump: 80,
            broadJump: 82,
            medicineBall: 78,
            sprint30m: 88,
            shuttleRun: 85,
            sitUps: 90,
            enduranceRun: 87
        };
        
        const baseScore = baseScores[testType] || 80;
        const variation = Math.floor(Math.random() * 20) - 10;
        const finalScore = Math.max(0, Math.min(100, baseScore + variation));
        
        return {
            overall: finalScore,
            technique: finalScore + Math.floor(Math.random() * 10) - 5,
            effort: finalScore + Math.floor(Math.random() * 8) - 4,
            consistency: finalScore + Math.floor(Math.random() * 6) - 3
        };
    }

    async analyzeRepetitionsAdvanced(testType) {
        await this.delay(1200);
        
        if (['sitUps'].includes(testType)) {
            const repCount = Math.floor(Math.random() * 30) + 20;
            return {
                count: repCount,
                averageForm: Math.floor(Math.random() * 20) + 80,
                consistency: Math.floor(Math.random() * 15) + 85,
                pace: Math.floor(Math.random() * 10) + 15 // reps per minute
            };
        }
        return null;
    }

    async analyzeTimingAdvanced(testType) {
        await this.delay(800);
        
        if (['sprint30m', 'shuttleRun', 'enduranceRun'].includes(testType)) {
            const times = {
                sprint30m: (Math.random() * 2 + 4).toFixed(2),
                shuttleRun: (Math.random() * 5 + 10).toFixed(2),
                enduranceRun: (Math.random() * 60 + 180).toFixed(0)
            };
            
            return {
                totalTime: times[testType] + 's',
                splitTimes: this.generateSplitTimes(testType),
                pace: this.calculatePace(testType, parseFloat(times[testType]))
            };
        }
        return null;
    }

    async analyzeFormAdvanced(testType) {
        await this.delay(1000);
        
        const formScores = {
            height: 95,
            weight: 98,
            sitAndReach: 85,
            verticalJump: 88,
            broadJump: 90,
            medicineBall: 82,
            sprint30m: 92,
            shuttleRun: 87,
            sitUps: 89,
            enduranceRun: 91
        };
        
        const baseScore = formScores[testType] || 85;
        const variation = Math.floor(Math.random() * 10) - 5;
        
        return {
            overall: baseScore + variation,
            posture: baseScore + Math.floor(Math.random() * 8) - 4,
            technique: baseScore + Math.floor(Math.random() * 6) - 3,
            efficiency: baseScore + Math.floor(Math.random() * 4) - 2
        };
    }

    async analyzeBiometrics(videoBlob) {
        await this.delay(1500);
        
        return {
            heartRate: Math.floor(Math.random() * 40) + 120, // 120-160 bpm
            exertion: Math.floor(Math.random() * 5) + 3, // 3-7 scale
            fatigue: Math.floor(Math.random() * 3) + 1, // 1-3 scale
            recovery: Math.floor(Math.random() * 4) + 2 // 2-5 scale
        };
    }

    async analyzeMotionTracking(videoBlob, testType) {
        await this.delay(1800);
        
        return {
            keyPoints: this.generateKeyPoints(testType),
            trajectory: this.generateTrajectory(testType),
            velocity: this.generateVelocityProfile(testType),
            acceleration: this.generateAccelerationProfile(testType)
        };
    }

    async calculateAIConfidence(testType) {
        await this.delay(500);
        
        const confidenceScores = {
            height: 95,
            weight: 98,
            sitAndReach: 88,
            verticalJump: 92,
            broadJump: 90,
            medicineBall: 85,
            sprint30m: 94,
            shuttleRun: 89,
            sitUps: 91,
            enduranceRun: 87
        };
        
        return confidenceScores[testType] || 90;
    }

    // Helper methods for advanced analysis
    generateSplitTimes(testType) {
        if (testType === 'sprint30m') {
            return ['1.2s', '2.8s', '4.1s'];
        } else if (testType === 'shuttleRun') {
            return ['2.5s', '5.1s', '7.8s', '10.2s'];
        }
        return [];
    }

    calculatePace(testType, time) {
        if (testType === 'enduranceRun') {
            const minutes = time / 60;
            return `${(800 / minutes).toFixed(1)} m/min`;
        }
        return null;
    }

    generateKeyPoints(testType) {
        const keyPoints = {
            height: ['head', 'shoulders', 'hips', 'knees', 'ankles'],
            verticalJump: ['takeoff', 'peak', 'landing'],
            sitUps: ['start', 'up', 'down'],
            sprint30m: ['start', '10m', '20m', 'finish']
        };
        return keyPoints[testType] || ['start', 'middle', 'end'];
    }

    generateTrajectory(testType) {
        return {
            smoothness: Math.random() * 20 + 80,
            efficiency: Math.random() * 15 + 85,
            consistency: Math.random() * 10 + 90
        };
    }

    generateVelocityProfile(testType) {
        return {
            maxVelocity: Math.random() * 5 + 8, // m/s
            averageVelocity: Math.random() * 3 + 5,
            acceleration: Math.random() * 2 + 3 // m/s²
        };
    }

    generateAccelerationProfile(testType) {
        return {
            peakAcceleration: Math.random() * 3 + 4, // m/s²
            averageAcceleration: Math.random() * 2 + 2,
            deceleration: Math.random() * 2 + 1
        };
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async simulateAIAnalysis() {
        const steps = [
            { element: 'videoQuality', text: 'Analyzing video quality...', delay: 1000 },
            { element: 'movementDetection', text: 'Detecting movements...', delay: 1500 },
            { element: 'cheatDetection', text: 'Checking for anomalies...', delay: 2000 },
            { element: 'performanceScore', text: 'Calculating performance...', delay: 1000 }
        ];

        for (const step of steps) {
            document.getElementById(step.element).textContent = step.text;
            document.getElementById(step.element).className = 'analysis-value analyzing';
            await new Promise(resolve => setTimeout(resolve, step.delay));
        }
    }

    analyzeVideoQuality(videoBlob) {
        // Simulate video quality analysis
        const quality = Math.random() > 0.1 ? 'Good' : 'Poor';
        return quality;
    }

    analyzeMovementDetection(testType) {
        // Simulate movement detection based on test type
        const movements = {
            height: 'Standing posture detected',
            weight: 'Scale reading visible',
            sitAndReach: 'Reaching movement detected',
            verticalJump: 'Jumping motion detected',
            broadJump: 'Jumping motion detected',
            medicineBall: 'Throwing motion detected',
            sprint30m: 'Running motion detected',
            shuttleRun: 'Shuttle run pattern detected',
            sitUps: 'Sit-up repetitions detected',
            enduranceRun: 'Running motion detected'
        };
        return movements[testType] || 'Movement detected';
    }

    analyzeCheatDetection(videoBlob) {
        // Simulate cheat detection
        const cheatIndicators = [
            'Video appears authentic',
            'No suspicious cuts detected',
            'Consistent lighting',
            'Natural movement patterns'
        ];
        return Math.random() > 0.05 ? 'No cheating detected' : 'Potential manipulation detected';
    }

    calculatePerformanceScore(testType) {
        // Generate realistic performance scores based on test type
        const baseScores = {
            height: 85,
            weight: 90,
            sitAndReach: 75,
            verticalJump: 80,
            broadJump: 82,
            medicineBall: 78,
            sprint30m: 88,
            shuttleRun: 85,
            sitUps: 90,
            enduranceRun: 87
        };
        
        const baseScore = baseScores[testType] || 80;
        const variation = Math.floor(Math.random() * 20) - 10; // ±10 points
        return Math.max(0, Math.min(100, baseScore + variation));
    }

    analyzeRepetitions(testType) {
        // Simulate rep counting for relevant tests
        if (['sitUps'].includes(testType)) {
            return Math.floor(Math.random() * 30) + 20; // 20-50 sit-ups
        }
        return null;
    }

    analyzeTiming(testType) {
        // Simulate timing analysis for speed/endurance tests
        if (['sprint30m', 'shuttleRun', 'enduranceRun'].includes(testType)) {
            const times = {
                sprint30m: (Math.random() * 2 + 4).toFixed(2), // 4-6 seconds
                shuttleRun: (Math.random() * 5 + 10).toFixed(2), // 10-15 seconds
                enduranceRun: (Math.random() * 60 + 180).toFixed(0) // 3-4 minutes
            };
            return times[testType] + 's';
        }
        return null;
    }

    analyzeForm(testType) {
        // Simulate form analysis
        const formScores = {
            height: 95,
            weight: 98,
            sitAndReach: 85,
            verticalJump: 88,
            broadJump: 90,
            medicineBall: 82,
            sprint30m: 92,
            shuttleRun: 87,
            sitUps: 89,
            enduranceRun: 91
        };
        return formScores[testType] || 85;
    }

    updateAIAnalysisDisplay(analysis) {
        document.getElementById('videoQuality').textContent = analysis.videoQuality;
        document.getElementById('videoQuality').className = `analysis-value ${analysis.videoQuality === 'Good' ? 'success' : 'warning'}`;
        
        document.getElementById('movementDetection').textContent = analysis.movementDetection;
        document.getElementById('movementDetection').className = 'analysis-value success';
        
        document.getElementById('cheatDetection').textContent = analysis.cheatDetection;
        document.getElementById('cheatDetection').className = `analysis-value ${analysis.cheatDetection.includes('No cheating') ? 'success' : 'error'}`;
        
        document.getElementById('performanceScore').textContent = `${analysis.performanceScore}/100`;
        document.getElementById('performanceScore').className = `analysis-value ${analysis.performanceScore >= 80 ? 'success' : analysis.performanceScore >= 60 ? 'warning' : 'error'}`;
    }

    // Benchmarking and Leaderboard
    calculateBenchmark(score, testType) {
        const userAge = this.currentUser.age;
        const userGender = this.currentUser.gender || 'male';
        
        // Simplified benchmarking based on age and gender
        const benchmarks = this.getBenchmarkStandards(userAge, userGender, testType);
        
        if (score >= benchmarks.excellent) return 'Excellent';
        if (score >= benchmarks.good) return 'Good';
        if (score >= benchmarks.average) return 'Average';
        return 'Below Average';
    }

    getBenchmarkStandards(age, gender, testType) {
        // Simplified benchmark standards (in real implementation, these would be comprehensive)
        const ageGroup = age < 12 ? 'U12' : age < 16 ? 'U16' : '16+';
        
        return {
            excellent: 90,
            good: 75,
            average: 60
        };
    }

    updateProgressStats() {
        const userResults = this.testResults.filter(result => result.userId === this.currentUser.id);
        const completedTests = userResults.length;
        const totalScore = userResults.reduce((sum, result) => sum + result.score, 0);
        const badgesEarned = this.calculateBadges(userResults);
        const userRank = this.getUserRank();

        document.getElementById('completedTests').textContent = completedTests;
        document.getElementById('totalScore').textContent = totalScore;
        document.getElementById('badgesEarned').textContent = badgesEarned;
        document.getElementById('rankPosition').textContent = userRank || '--';
        
        this.updateLeaderboard();
    }

    getUserRank() {
        // Calculate user's rank based on total score
        const allUsers = this.getAllUserScores();
        const userScore = this.getCurrentUserScore();
        
        const rank = allUsers.findIndex(user => user.userId === this.currentUser.id) + 1;
        return rank || null;
    }

    getAllUserScores() {
        // Get all users with their total scores
        const userScores = {};
        
        this.testResults.forEach(result => {
            if (!userScores[result.userId]) {
                userScores[result.userId] = {
                    userId: result.userId,
                    totalScore: 0,
                    testCount: 0,
                    name: this.getUserNameById(result.userId)
                };
            }
            userScores[result.userId].totalScore += result.score;
            userScores[result.userId].testCount++;
        });
        
        return Object.values(userScores)
            .sort((a, b) => b.totalScore - a.totalScore);
    }

    getCurrentUserScore() {
        const userResults = this.testResults.filter(result => result.userId === this.currentUser.id);
        return userResults.reduce((sum, result) => sum + result.score, 0);
    }

    getUserNameById(userId) {
        const user = this.users.find(u => u.id === userId);
        return user ? `${user.firstName} ${user.lastName}` : 'Unknown User';
    }

    updateLeaderboard() {
        const leaderboardContent = document.getElementById('leaderboardContent');
        const allUsers = this.getAllUserScores().slice(0, 10); // Top 10
        
        leaderboardContent.innerHTML = allUsers.map((user, index) => `
            <div class="leaderboard-item">
                <span class="rank ${index < 3 ? 'top-3' : ''}">${index + 1}</span>
                <span class="name">${user.name}</span>
                <span class="score">${user.totalScore}</span>
                <span class="tests">${user.testCount}</span>
            </div>
        `).join('');
    }

    // SAI Submission
    async submitToSAI(testResult) {
        // Simulate secure submission to SAI servers
        const submissionData = {
            athleteId: this.currentUser.id,
            testType: testResult.testType,
            score: testResult.score,
            aiAnalysis: testResult.aiAnalysis,
            timestamp: testResult.completedAt,
            verificationStatus: 'verified'
        };
        
        // In real implementation, this would be a secure API call
        console.log('Submitting to SAI:', submissionData);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return { success: true, submissionId: this.generateUserId() };
    }
}

// Global functions for HTML onclick handlers
function startTest(testType) {
    if (window.sportsApp) {
        window.sportsApp.showVideoRecording(testType);
    }
}

function goToTests() {
    if (window.sportsApp) {
        window.sportsApp.showTests();
    }
}

function goToDashboard() {
    if (window.sportsApp) {
        window.sportsApp.showDashboard();
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.sportsApp = new SportsRegistrationSystem();
    
    // Register service worker for PWA functionality
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registered successfully:', registration);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    }
    
    // Add PWA install prompt
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        // Show install button
        const installBtn = document.createElement('button');
        installBtn.className = 'btn btn-primary install-btn';
        installBtn.innerHTML = '<i class="fas fa-download"></i> Install App';
        installBtn.style.position = 'fixed';
        installBtn.style.bottom = '20px';
        installBtn.style.right = '20px';
        installBtn.style.zIndex = '10000';
        
        installBtn.addEventListener('click', () => {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                }
                deferredPrompt = null;
                installBtn.remove();
            });
        });
        
        document.body.appendChild(installBtn);
    });
});

// Add some sample data for demonstration (optional)
function addSampleData() {
    const sampleUsers = [
        {
            id: 'sample1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            password: 'password123',
            age: 25,
            sport: 'football',
            experience: 'intermediate',
            phone: '+1234567890',
            location: 'New York, USA',
            bio: 'Passionate football player with 5 years of experience.',
            createdAt: new Date().toISOString()
        },
        {
            id: 'sample2',
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane@example.com',
            password: 'password123',
            age: 28,
            sport: 'tennis',
            experience: 'advanced',
            phone: '+1234567891',
            location: 'Los Angeles, USA',
            bio: 'Professional tennis player and coach.',
            createdAt: new Date().toISOString()
        }
    ];

    // Only add sample data if no users exist
    const existingUsers = localStorage.getItem('sportsUsers');
    if (!existingUsers) {
        localStorage.setItem('sportsUsers', JSON.stringify(sampleUsers));
    }
}

// Uncomment the line below to add sample data
// addSampleData();
