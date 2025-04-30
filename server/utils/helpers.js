// server/utils/helpers.js
/**
 * Format date to readable string
 * @param {Date} date 
 * @returns {string}
 */
exports.formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  /**
   * Calculate age from birthdate
   * @param {Date} birthdate 
   * @returns {Object} {years, months}
   */
  exports.calculateAge = (birthdate) => {
    const today = new Date();
    const birth = new Date(birthdate);
    
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    
    if (months < 0 || (months === 0 && today.getDate() < birth.getDate())) {
      years--;
      months += 12;
    }
    
    return { years, months };
  };
  
  /**
   * Generate a random string
   * @param {number} length 
   * @returns {string}
   */
  exports.generateRandomString = (length = 10) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return result;
  };
  