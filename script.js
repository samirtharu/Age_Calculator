document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const yearSelect = document.getElementById('year');
    const monthSelect = document.getElementById('month');
    const daySelect = document.getElementById('day');
    const adYearSelect = document.getElementById('ad-year');
    const adMonthSelect = document.getElementById('ad-month');
    const adDaySelect = document.getElementById('ad-day');
    const dobInput = document.getElementById('dob'); // Hidden AD date input
    const dateFormatToggle = document.getElementById('date-format-toggle');
    const nepaliDateSection = document.getElementById('nepali-date-section');
    const adDateSection = document.getElementById('ad-date-section');
    const dateInputLabel = document.getElementById('date-input-label');
    const calculateBtn = document.getElementById('calculate');
    const resultDiv = document.getElementById('result');
    const yearsElement = document.getElementById('years');
    const monthsElement = document.getElementById('months');
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    
    // Initialize Nepali date selection
    initializeNepaliDateSelects();
    
    // Initialize AD date selection
    initializeAdDateSelects();
    
    // Handle select dropdown behavior
    setupSelectDropdownBehavior();
    
    // Toggle between BS and AD date formats
    dateFormatToggle.addEventListener('change', function() {
        if (this.checked) {
            // Switch to AD
            nepaliDateSection.style.display = 'none';
            adDateSection.style.display = 'flex';
            dateInputLabel.textContent = 'Select your date of birth (AD Date)';
        } else {
            // Switch to BS (Nepali)
            nepaliDateSection.style.display = 'flex';
            adDateSection.style.display = 'none';
            dateInputLabel.textContent = 'Select your date of birth (Nepali Date)';
        }
    });
    
    let intervalId = null;
    
    // Add click event to calculate button
    calculateBtn.addEventListener('click', function() {
        if (dateFormatToggle.checked) {
            // AD Date calculation
            const adYear = parseInt(adYearSelect.value);
            const adMonth = parseInt(adMonthSelect.value);
            const adDay = parseInt(adDaySelect.value);
            
            if (!adYear || !adMonth || !adDay) {
                alert('Please select a valid date of birth');
                return;
            }
            
            // Create AD date string in YYYY-MM-DD format
            const adDateStr = `${adYear}-${String(adMonth).padStart(2, '0')}-${String(adDay).padStart(2, '0')}`;
            dobInput.value = adDateStr;
            
            const dob = new Date(adDateStr);
            
            if (isNaN(dob.getTime())) {
                alert('Invalid date selection');
                return;
            }
            
            const today = new Date();
            
            // Check if date is in the future
            if (dob > today) {
                alert('Date of birth cannot be in the future');
                return;
            }
            
            // Clear any existing interval
            if (intervalId) {
                clearInterval(intervalId);
            }
            
            // Update age immediately
            updateAge(dob);
            
            // Show result with animation
            resultDiv.classList.add('show');
            
            // Set interval to update age every second
            intervalId = setInterval(function() {
                updateAge(dob);
            }, 1000);
        } else {
            // BS Date calculation (conversion needed)
            // Get selected Nepali date
            const bsYear = parseInt(yearSelect.value);
            const bsMonth = parseInt(monthSelect.value);
            const bsDay = parseInt(daySelect.value);
            
            if (!bsYear || !bsMonth || !bsDay) {
                alert('Please select a valid date of birth');
                return;
            }
            
            // Convert BS to AD date
            convertBsToAd(bsYear, bsMonth, bsDay)
                .then(adDate => {
                    // Set the hidden date input value
                    dobInput.value = adDate;
                    
                    const dob = new Date(adDate);
                    
                    if (isNaN(dob.getTime())) {
                        alert('Invalid date conversion');
                        return;
                    }
                    
                    const today = new Date();
                    
                    // Check if date is in the future
                    if (dob > today) {
                        alert('Date of birth cannot be in the future');
                        return;
                    }
                    
                    // Clear any existing interval
                    if (intervalId) {
                        clearInterval(intervalId);
                    }
                    
                    // Update age immediately
                    updateAge(dob);
                    
                    // Show result with animation
                    resultDiv.classList.add('show');
                    
                    // Set interval to update age every second
                    intervalId = setInterval(function() {
                        updateAge(dob);
                    }, 1000);
                })
                .catch(error => {
                    console.error("Error converting date:", error);
                    alert('Error converting date. Please try again.');
                });
        }
    });
    
    function updateAge(dob) {
        const now = new Date();
        const diff = calculateExactDifference(dob, now);
        
        yearsElement.textContent = diff.years;
        monthsElement.textContent = diff.months;
        daysElement.textContent = diff.days;
        hoursElement.textContent = diff.hours;
        minutesElement.textContent = diff.minutes;
        secondsElement.textContent = diff.seconds;
    }
    
    function calculateExactDifference(startDate, endDate) {
        // Clone dates to avoid modifying originals
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        // Initialize result
        let years = end.getFullYear() - start.getFullYear();
        let months = end.getMonth() - start.getMonth();
        let days = end.getDate() - start.getDate();
        let hours = end.getHours() - start.getHours();
        let minutes = end.getMinutes() - start.getMinutes();
        let seconds = end.getSeconds() - start.getSeconds();
        
        // Adjust negative values
        if (seconds < 0) {
            seconds += 60;
            minutes--;
        }
        
        if (minutes < 0) {
            minutes += 60;
            hours--;
        }
        
        if (hours < 0) {
            hours += 24;
            days--;
        }
        
        // Adjust days based on the number of days in the month
        if (days < 0) {
            // Go to the last day of the previous month
            const tempDate = new Date(end.getFullYear(), end.getMonth(), 0);
            days += tempDate.getDate();
            months--;
        }
        
        if (months < 0) {
            months += 12;
            years--;
        }
        
        return {
            years,
            months,
            days,
            hours,
            minutes,
            seconds
        };
    }
    
    // Initialize AD date selection dropdowns
    function initializeAdDateSelects() {
        // Add years (from 1940 to current year)
        const currentYear = new Date().getFullYear();
        const startYear = 1940;
        
        // Clear existing options first
        adYearSelect.innerHTML = '<option value="">Year</option>';
        
        // Add years in descending order (most recent first)
        for (let year = currentYear; year >= startYear; year--) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            adYearSelect.appendChild(option);
        }
        
        // Update days when month or year changes
        adYearSelect.addEventListener('change', updateAdDays);
        adMonthSelect.addEventListener('change', updateAdDays);
        
        // Initial days population
        updateAdDays();
    }
    
    // Update days in the AD day select based on month and year
    function updateAdDays() {
        const year = parseInt(adYearSelect.value) || new Date().getFullYear();
        const month = parseInt(adMonthSelect.value) || 1;
        
        // Clear existing options
        adDaySelect.innerHTML = '<option value="">Day</option>';
        
        // Get days in the selected month
        const daysInMonth = getDaysInAdMonth(year, month);
        
        // Add day options
        for (let day = 1; day <= daysInMonth; day++) {
            const option = document.createElement('option');
            option.value = day;
            option.textContent = day;
            adDaySelect.appendChild(option);
        }
    }
    
    // Get days in AD month (accounting for leap years)
    function getDaysInAdMonth(year, month) {
        // Month is 1-12 in our UI, but Date uses 0-11, so subtract 1
        return new Date(year, month, 0).getDate();
    }
    
    // Initialize Nepali date selection dropdowns
    function initializeNepaliDateSelects() {
        // Add BS years (from 2000 BS to 2085 BS)
        const startYear = 2000; 
        const endYear = 2085; // Extended to match our data range
        
        // Clear existing options first
        yearSelect.innerHTML = '<option value="">Year</option>';
        
        // Add years in ascending order
        for (let year = startYear; year <= endYear; year++) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
        }
        
        // Update days when month or year changes
        yearSelect.addEventListener('change', updateDays);
        monthSelect.addEventListener('change', updateDays);
        
        // Initial days population
        updateDays();
    }
    
    // Update days in the day select based on month and year
    function updateDays() {
        const year = parseInt(yearSelect.value) || 2080; // Default to 2080 if not selected
        const month = parseInt(monthSelect.value) || 1;  // Default to 1 if not selected
        
        // Clear existing options
        daySelect.innerHTML = '<option value="">Day</option>';
        
        // Get days in the selected month (use your Nepali calendar data)
        const daysInMonth = getDaysInBsMonth(year, month);
        
        // Add day options
        for (let day = 1; day <= daysInMonth; day++) {
            const option = document.createElement('option');
            option.value = day;
            option.textContent = day;
            daySelect.appendChild(option);
        }
    }
    
    // Get days in Nepali month
    function getDaysInBsMonth(year, month) {
        // Data structure for days in each month of BS calendar
        const bsMonthDays = {
            // Map of years -> array of days in each month (1-12)
            2075: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
            2076: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
            2077: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
            2078: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
            2079: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
            2080: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
            2081: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
            2082: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
            2083: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
            2084: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
            2085: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30]
        };
        
        // Default days for months if specific year data isn't available
        const defaultDays = [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30];
        
        if (bsMonthDays[year] && bsMonthDays[year][month - 1]) {
            return bsMonthDays[year][month - 1];
        }
        
        return defaultDays[month - 1] || 30; // Default to 30 if not found
    }
    
    // Function to convert BS date to AD date using an API
    async function convertBsToAd(bsYear, bsMonth, bsDay) {
        try {
            // Method 1: Using own conversion function if API fails
            const adDate = bsToAdManualConversion(bsYear, bsMonth, bsDay);
            
            // Format as YYYY-MM-DD for the hidden input
            return adDate;
        } catch (error) {
            console.error("Manual conversion failed:", error);
            throw new Error("Date conversion failed");
        }
    }
    
    // Fallback manual BS to AD conversion (simplified approximation)
    function bsToAdManualConversion(bsYear, bsMonth, bsDay) {
        // This is a simplified conversion that uses a reference point
        // and date offset calculation
        
        // Key reference pairs (these are approximate conversions)
        const referencePoints = [
            { bs: { year: 2000, month: 1, day: 1 }, ad: { year: 1943, month: 4, day: 14 } },
            { bs: { year: 2050, month: 1, day: 1 }, ad: { year: 1993, month: 4, day: 13 } },
            { bs: { year: 2075, month: 1, day: 1 }, ad: { year: 2018, month: 4, day: 14 } },
            { bs: { year: 2080, month: 1, day: 1 }, ad: { year: 2023, month: 4, day: 14 } }
        ];
        
        // Find the closest reference point
        let reference = referencePoints[0];
        let minDiff = Math.abs(bsYear - reference.bs.year);
        
        for (let i = 1; i < referencePoints.length; i++) {
            const diff = Math.abs(bsYear - referencePoints[i].bs.year);
            if (diff < minDiff) {
                minDiff = diff;
                reference = referencePoints[i];
            }
        }
        
        // Calculate approximate days difference
        const yearDiff = bsYear - reference.bs.year;
        const monthDiff = bsMonth - reference.bs.month;
        
        // Approximate days in BS year (not precisely accurate, but close)
        const bsDaysInYear = 365;
        
        // Calculate AD date components
        let adYear = reference.ad.year + yearDiff;
        let adMonth = reference.ad.month + monthDiff;
        let adDay = reference.ad.day + (bsDay - 1);
        
        // Adjust month overflow
        while (adMonth > 12) {
            adMonth -= 12;
            adYear += 1;
        }
        
        // Adjust month underflow
        while (adMonth < 1) {
            adMonth += 12;
            adYear -= 1;
        }
        
        // Adjust day overflow (simplified)
        const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        
        // Adjust for leap year
        if (adYear % 4 === 0 && (adYear % 100 !== 0 || adYear % 400 === 0)) {
            daysInMonth[1] = 29;
        }
        
        // Normalize days
        while (adDay > daysInMonth[adMonth - 1]) {
            adDay -= daysInMonth[adMonth - 1];
            adMonth++;
            
            if (adMonth > 12) {
                adMonth = 1;
                adYear++;
                
                // Check leap year again
                if (adYear % 4 === 0 && (adYear % 100 !== 0 || adYear % 400 === 0)) {
                    daysInMonth[1] = 29;
                } else {
                    daysInMonth[1] = 28;
                }
            }
        }
        
        // Format as YYYY-MM-DD
        return `${adYear}-${String(adMonth).padStart(2, '0')}-${String(adDay).padStart(2, '0')}`;
    }
    
    // Setup behavior for select dropdowns
    function setupSelectDropdownBehavior() {
        const allSelects = [yearSelect, monthSelect, daySelect, adYearSelect, adMonthSelect, adDaySelect];
        
        allSelects.forEach(select => {
            // Just handle keyboard events for accessibility
            select.addEventListener('keydown', function(e) {
                // Close dropdown on Escape key
                if (e.key === 'Escape') {
                    this.blur();
                }
            });
        });
    }
}); 