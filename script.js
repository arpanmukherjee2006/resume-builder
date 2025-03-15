document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const clearBtn = document.getElementById('clearBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const addExperienceBtn = document.getElementById('add-experience');
    const addEducationBtn = document.getElementById('add-education');
    const addProjectBtn = document.getElementById('add-project');
    const skillInput = document.getElementById('skill-input');
    const skillsList = document.getElementById('skills-list');
    const experienceList = document.getElementById('experience-list');
    const educationList = document.getElementById('education-list');
    const projectsList = document.getElementById('projects-list');
    const previewContainer = document.getElementById('resume-preview-container');
    const enhanceSummaryBtn = document.getElementById('enhanceSummary');
    const templates = document.querySelectorAll('.template');

    // Event Listeners
    clearBtn.addEventListener('click', clearAll);
    downloadBtn.addEventListener('click', downloadPDF);
    addExperienceBtn.addEventListener('click', addExperience);
    addEducationBtn.addEventListener('click', addEducation);
    addProjectBtn.addEventListener('click', addProject);
    skillInput.addEventListener('keypress', addSkill);
    enhanceSummaryBtn.addEventListener('click', enhanceSummary);
    
    // Template selection
    templates.forEach(template => {
        template.addEventListener('click', function() {
            templates.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            const templateType = this.getAttribute('data-template');
            previewContainer.className = `preview-container ${templateType}-template`;
            updatePreview();
        });
    });

    // Live preview update on input change
    document.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', updatePreview);
    });

    // Set up event delegation for dynamically added elements
    document.addEventListener('click', function(e) {
        // Remove buttons
        if (e.target.classList.contains('remove-btn')) {
            e.target.closest('.experience-item, .education-item, .project-item').remove();
            updatePreview();
        }
        
        // AI enhance buttons for descriptions
        if (e.target.classList.contains('enhance-description')) {
            const description = e.target.previousElementSibling;
            enhanceText(description);
        }
        
        // AI enhance buttons for projects
        if (e.target.classList.contains('enhance-project')) {
            const description = e.target.previousElementSibling;
            enhanceText(description);
        }
    });

    // Initialize the first experience, education, and project item
    updatePreview();

    // Functions
    function clearAll() {
        if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
            document.querySelectorAll('input, textarea').forEach(input => {
                input.value = '';
            });
            
            // Clear skills
            skillsList.innerHTML = '';
            
            // Reset to one experience, education, and project item
            experienceList.innerHTML = createExperienceItem().outerHTML;
            educationList.innerHTML = createEducationItem().outerHTML;
            projectsList.innerHTML = createProjectItem().outerHTML;
            
            updatePreview();
        }
    }

    function downloadPDF() {
        // Clone the preview to modify for PDF
        const element = previewContainer.cloneNode(true);
        
        // Make sure links work in the PDF
        const links = element.querySelectorAll('a');
        links.forEach(link => {
            link.style.color = 'blue';
            link.style.textDecoration = 'underline';
        });
        
        // PDF options
        const opt = {
            margin: 10,
            filename: 'resume.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        
        // Generate PDF
        html2pdf().set(opt).from(element).save();
    }

    function addExperience() {
        const newItem = createExperienceItem();
        experienceList.appendChild(newItem);
    }

    function createExperienceItem() {
        const id = Date.now();
        const item = document.createElement('div');
        item.className = 'experience-item';
        item.innerHTML = `
            <div class="input-group">
                <label>Company</label>
                <input type="text" class="company" placeholder="Company Name">
            </div>
            <div class="input-group">
                <label>Position</label>
                <input type="text" class="position" placeholder="Job Title">
            </div>
            <div class="date-range">
                <div class="input-group">
                    <label>Start Date</label>
                    <input type="month" class="start-date">
                </div>
                <div class="input-group">
                    <label>End Date</label>
                    <input type="month" class="end-date">
                    <div class="checkbox-group">
                        <input type="checkbox" class="current-job" id="current-job-${id}">
                        <label for="current-job-${id}">Current Job</label>
                    </div>
                </div>
            </div>
            <div class="input-group">
                <label>Description</label>
                <textarea class="description" rows="3" placeholder="Describe your responsibilities and achievements..."></textarea>
                <button class="enhance-btn enhance-description">AI Enhance</button>
            </div>
            <button class="remove-btn">Remove</button>
        `;
        
        // Set up current job checkbox
        const checkbox = item.querySelector('.current-job');
        const endDateInput = item.querySelector('.end-date');
        
        checkbox.addEventListener('change', function() {
            endDateInput.disabled = this.checked;
            updatePreview();
        });
        
        return item;
    }

    function addEducation() {
        const newItem = createEducationItem();
        educationList.appendChild(newItem);
    }

    function createEducationItem() {
        const id = Date.now();
        const item = document.createElement('div');
        item.className = 'education-item';
        item.innerHTML = `
            <div class="input-group">
                <label>Institution</label>
                <input type="text" class="institution" placeholder="University Name">
            </div>
            <div class="input-group">
                <label>Degree</label>
                <input type="text" class="degree" placeholder="Bachelor of Science in Computer Science">
            </div>
            <div class="date-range">
                <div class="input-group">
                    <label>Start Date</label>
                    <input type="month" class="edu-start-date">
                </div>
                <div class="input-group">
                    <label>End Date</label>
                    <input type="month" class="edu-end-date">
                    <div class="checkbox-group">
                        <input type="checkbox" class="current-edu" id="current-edu-${id}">
                        <label for="current-edu-${id}">Currently Studying</label>
                    </div>
                </div>
            </div>
            <button class="remove-btn">Remove</button>
        `;
        
        // Set up current education checkbox
        const checkbox = item.querySelector('.current-edu');
        const endDateInput = item.querySelector('.edu-end-date');
        
        checkbox.addEventListener('change', function() {
            endDateInput.disabled = this.checked;
            updatePreview();
        });
        
        return item;
    }

    function addProject() {
        const newItem = createProjectItem();
        projectsList.appendChild(newItem);
    }

    function createProjectItem() {
        const item = document.createElement('div');
        item.className = 'project-item';
        item.innerHTML = `
            <div class="input-group">
                <label>Project Name</label>
                <input type="text" class="project-name" placeholder="Project Name">
            </div>
            <div class="input-group">
                <label>Project Link</label>
                <input type="url" class="project-link" placeholder="https://project-url.com">
            </div>
            <div class="input-group">
                <label>Description</label>
                <textarea class="project-description" rows="3" placeholder="Describe your project..."></textarea>
                <button class="enhance-btn enhance-project">AI Enhance</button>
            </div>
            <button class="remove-btn">Remove</button>
        `;
        return item;
    }

    function addSkill(e) {
        if (e.key === 'Enter' && e.target.value.trim() !== '') {
            const skillName = e.target.value.trim();
            const skillTag = document.createElement('div');
            skillTag.className = 'skill-tag';
            skillTag.innerHTML = `
                <span>${skillName}</span>
                <button class="remove-skill">✕</button>
            `;
            
            skillTag.querySelector('.remove-skill').addEventListener('click', function() {
                skillTag.remove();
                updatePreview();
            });
            
            skillsList.appendChild(skillTag);
            e.target.value = '';
            updatePreview();
        }
    }

    function enhanceText(element) {
        if (element.value.trim() === '') {
            alert('Please enter some text to enhance.');
            return;
        }
        
        // Show loading state
        const originalText = element.value;
        const enhanceBtn = element.nextElementSibling;
        enhanceBtn.disabled = true;
        enhanceBtn.textContent = 'Enhancing...';
        
        // Simulate AI enhancement (replace with actual API call)
        setTimeout(() => {
            // In a real implementation, you'd call an AI API here
            // This is just a simple example enhancement
            let enhanced = enhanceWithAI(originalText);
            element.value = enhanced;
            
            // Reset button
            enhanceBtn.disabled = false;
            enhanceBtn.textContent = 'AI Enhance';
            
            updatePreview();
        }, 1000);
    }

    function enhanceWithAI(text) {
        // This is a placeholder for real AI enhancement
        // In production, you'd call an external API like OpenAI
        
        // Simple rules-based enhancement for demo
        let enhanced = text;
        
        // Capitalize first letter of sentences
        enhanced = enhanced.replace(/(\.\s+|^\s*)([a-z])/g, (match, p1, p2) => p1 + p2.toUpperCase());
        
        // Replace weak words
        const replacements = {
            'good': 'excellent',
            'worked on': 'led',
            'helped': 'collaborated',
            'did': 'executed',
            'made': 'created',
            'use': 'utilize',
            'worked with': 'collaborated with',
            'responsible for': 'managed',
            'improved': 'enhanced',
            'solved': 'resolved',
            'gave': 'delivered',
            'learned': 'mastered',
            'changed': 'transformed',
            'handled': 'orchestrated',
            'started': 'initiated',
            'showed': 'demonstrated',
            'built': 'developed',
            'made': 'created',
            'use': 'utilize',
            'worked with': 'collaborated with',
            'responsible for': 'managed',
            'helped': 'assisted',
            'increased': 'boosted',
            'reduced': 'optimized',
            'fixed': 'rectified',
            'explained': 'articulated',
            'researched': 'analyzed',
            'worked on': 'executed',
            'thought of': 'conceptualized',
            'wrote': 'authored',
            'tested': 'validated',
            'checked': 'inspected',
            'gave feedback': 'critiqued',
            'taught': 'educated',
            'answered': 'addressed',
            'organized': 'structured',
            'ran': 'facilitated',
            'tried': 'experimented',
            'found': 'discovered',
            'made better': 'refined',
            'took part in': 'participated in',
            'said': 'communicated',
            'talked to': 'engaged with',
            'put together': 'assembled',
            'took care of': 'administered',
            'led': 'spearheaded',
            'brought': 'delivered',
            'got better at': 'advanced in',
            'made sure': 'ensured',
            'got': 'acquired',
            'kept up with': 'stayed updated on',
            'proved': 'substantiated',
            'planned': 'strategized',
            'fixed issues': 'troubleshot',
            'set up': 'implemented',
            'worked as': 'served as',
            'decided': 'determined',
            'pushed': 'propelled',
            'talked about': 'presented',
            'grew': 'expanded',
            'learned about': 'studied',
            'acted as': 'functioned as'
        };
        
        for (const [weak, strong] of Object.entries(replacements)) {
            const regex = new RegExp(`\\b${weak}\\b`, 'gi');
            enhanced = enhanced.replace(regex, strong);
        }
        
       
        
        return enhanced;
    }

    function enhanceSummary() {
        const summaryElement = document.getElementById('summary');
        enhanceText(summaryElement);
    }

    function updatePreview() {
        // Get form data
        const name = document.getElementById('name').value || 'Your Name';
        const title = document.getElementById('title').value || 'Professional Title';
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const location = document.getElementById('location').value;
        const summary = document.getElementById('summary').value;
        
        // Social links
        const linkedin = document.getElementById('linkedin').value;
        const github = document.getElementById('github').value;
        const twitter = document.getElementById('twitter').value;
        const instagram = document.getElementById('instagram').value;
        const website = document.getElementById('website').value;
        
        // Build the preview HTML
        let previewHTML = `
            <div class="preview-header">
                <h1>${name}</h1>
                <p>${title}</p>
                <div class="contact-info">
        `;
        
        if (email) previewHTML += `<div class="contact-item"><i class="fas fa-envelope"></i> ${email}</div>`;
        if (phone) previewHTML += `<div class="contact-item"><i class="fas fa-phone"></i> ${phone}</div>`;
        if (location) previewHTML += `<div class="contact-item"><i class="fas fa-map-marker-alt"></i> ${location}</div>`;
        
        previewHTML += `
                </div>
                <div class="social-links-preview">
        `;
        
        if (linkedin) previewHTML += `<div class="social-item"><i class="fab fa-linkedin"></i> <a href="https://linkedin.com/in/${linkedin}" target="_blank">linkedin.com/in/${linkedin}</a></div>`;
        if (github) previewHTML += `<div class="social-item"><i class="fab fa-github"></i> <a href="https://github.com/${github}" target="_blank">github.com/${github}</a></div>`;
        if (twitter) previewHTML += `<div class="social-item"><i class="fab fa-twitter"></i> <a href="https://twitter.com/${twitter}" target="_blank">twitter.com/${twitter}</a></div>`;
        if (instagram) previewHTML += `<div class="social-item"><i class="fab fa-instagram"></i> <a href="https://instagram.com/${instagram}" target="_blank">instagram.com/${instagram}</a></div>`;
        if (website) previewHTML += `<div class="social-item"><i class="fas fa-globe"></i> <a href="${website}" target="_blank">${website}</a></div>`;
        
        previewHTML += `
                </div>
            </div>
        `;
        
        // Summary section
        if (summary) {
            previewHTML += `
                <div class="preview-section">
                    <h2>Summary</h2>
                    <p>${summary}</p>
                </div>
            `;
        }
        
        // Experience section
        const experienceItems = document.querySelectorAll('.experience-item');
        if (experienceItems.length > 0) {
            previewHTML += `
                <div class="preview-section">
                    <h2>Experience</h2>
            `;
            
            experienceItems.forEach(item => {
                const company = item.querySelector('.company').value;
                const position = item.querySelector('.position').value;
                const startDate = item.querySelector('.start-date').value;
                const endDate = item.querySelector('.end-date').value;
                const isCurrentJob = item.querySelector('.current-job').checked;
                const description = item.querySelector('.description').value;
                
                if (company || position) {
                    let formattedStartDate = startDate ? formatDate(startDate) : '';
                    let formattedEndDate = isCurrentJob ? 'Present' : (endDate ? formatDate(endDate) : '');
                    let dateRange = formattedStartDate || formattedEndDate ? 
                        `${formattedStartDate} - ${formattedEndDate}` : '';
                    
                    previewHTML += `
                        <div class="experience-entry">
                            <div class="entry-header">
                                <div class="entry-title">${position || 'Position'}</div>
                                <div class="entry-date">${dateRange}</div>
                            </div>
                            <div class="entry-subtitle">${company || 'Company'}</div>
                            <div class="entry-description">${description || ''}</div>
                        </div>
                    `;
                }
            });
            
            previewHTML += `</div>`;
        }
        
        // Projects section
        const projectItems = document.querySelectorAll('.project-item');
        if (projectItems.length > 0) {
            previewHTML += `
                <div class="preview-section">
                    <h2>Projects</h2>
            `;
            
            projectItems.forEach(item => {
                const projectName = item.querySelector('.project-name').value;
                const projectLink = item.querySelector('.project-link').value;
                const description = item.querySelector('.project-description').value;
                
                if (projectName) {
                    previewHTML += `
                        <div class="project-entry">
                            <div class="entry-header">
                                <div class="entry-title">
                                    ${projectLink ? 
                                      `<a href="${projectLink}" target="_blank">${projectName}</a>` : 
                                      projectName}
                                </div>
                            </div>
                            <div class="entry-description">${description || ''}</div>
                        </div>
                    `;
                }
            });
            
            previewHTML += `</div>`;
        }
        
        // Education section
        const educationItems = document.querySelectorAll('.education-item');
        if (educationItems.length > 0) {
            previewHTML += `
                <div class="preview-section">
                    <h2>Education</h2>
            `;
            
            educationItems.forEach(item => {
                const institution = item.querySelector('.institution').value;
                const degree = item.querySelector('.degree').value;
                const startDate = item.querySelector('.edu-start-date').value;
                const endDate = item.querySelector('.edu-end-date').value;
                const isCurrentEdu = item.querySelector('.current-edu').checked;
                
                if (institution || degree) {
                    let formattedStartDate = startDate ? formatDate(startDate) : '';
                    let formattedEndDate = isCurrentEdu ? 'Present' : (endDate ? formatDate(endDate) : '');
                    let dateRange = formattedStartDate || formattedEndDate ? 
                        `${formattedStartDate} - ${formattedEndDate}` : '';
                    
                    previewHTML += `
                        <div class="education-entry">
                            <div class="entry-header">
                                <div class="entry-title">${institution || 'Institution'}</div>
                                <div class="entry-date">${dateRange}</div>
                            </div>
                            <div class="entry-subtitle">${degree || 'Degree'}</div>
                        </div>
                    `;
                }
            });
            
            previewHTML += `</div>`;
        }
        
        // Skills section
        const skillTags = document.querySelectorAll('.skill-tag span');
        if (skillTags.length > 0) {
            previewHTML += `
                <div class="preview-section">
                    <h2>Skills</h2>
                    <div class="skills-container">
            `;
            
            skillTags.forEach(skill => {
                previewHTML += `<div class="preview-skill">${skill.textContent}</div>`;
            });
            
            previewHTML += `
                    </div>
                </div>
            `;
        }
        
        previewContainer.innerHTML = previewHTML;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        return `${month} ${year}`;
    }

    // Add event listeners to checkboxes for current job/education
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('current-job')) {
            const endDateInput = e.target.closest('.input-group').querySelector('.end-date');
            endDateInput.disabled = e.target.checked;
            updatePreview();
        }
        
        if (e.target.classList.contains('current-edu')) {
            const endDateInput = e.target.closest('.input-group').querySelector('.edu-end-date');
            endDateInput.disabled = e.target.checked;
            updatePreview();
        }
    });
}); 