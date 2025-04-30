// server/utils/validators.js
/**
 * Email validator function
 * @param {string} email 
 * @returns {boolean}
 */
exports.isValidEmail = (email) => {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(String(email).toLowerCase());
  };
  
  /**
   * Password strength validator
   * @param {string} password 
   * @returns {boolean}
   */
  exports.isStrongPassword = (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return re.test(password);
  };
  
  /**
   * Phone number validator
   * @param {string} phone 
   * @returns {boolean}
   */
  exports.isValidPhone = (phone) => {
    // Basic phone validation - customize for your requirements
    const re = /^\+?([0-9]{1,3})?[-. ]?([0-9]{3})[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    return re.test(phone);
  };
  