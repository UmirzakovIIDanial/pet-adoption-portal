// client/src/utils/validators.js
/**
 * Validate email
 * @param {string} email 
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(String(email).toLowerCase());
  };
  
  /**
   * Validate password strength
   * @param {string} password 
   * @returns {boolean}
   */
  export const isStrongPassword = (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return re.test(password);
  };
  
  /**
   * Validate phone number
   * @param {string} phone 
   * @returns {boolean}
   */
  export const isValidPhone = (phone) => {
    // Basic phone validation - customize for your requirements
    const re = /^\+?([0-9]{1,3})?[-. ]?([0-9]{3})[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    return re.test(phone);
  };
  
  /**
   * Validate URL
   * @param {string} url 
   * @returns {boolean}
   */
  export const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (err) {
      return false;
    }
  };
  
  /**
   * Validate file type
   * @param {File} file 
   * @param {Array} allowedTypes 
   * @returns {boolean}
   */
  export const isValidFileType = (file, allowedTypes) => {
    return allowedTypes.includes(file.type);
  };
  
  /**
   * Validate file size
   * @param {File} file 
   * @param {number} maxSize - in bytes
   * @returns {boolean}
   */
  export const isValidFileSize = (file, maxSize) => {
    return file.size <= maxSize;
  };