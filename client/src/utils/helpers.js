// client/src/utils/helpers.js
/**
 * Format date to readable string
 * @param {Date|string} date 
 * @returns {string}
 */
export const formatDate = (date) => {
    if (!date) return '';
    
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  /**
   * Format date and time to readable string
   * @param {Date|string} date 
   * @returns {string}
   */
  export const formatDateTime = (date) => {
    if (!date) return '';
    
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  /**
   * Format pet age
   * @param {Object} age {years: number, months: number}
   * @returns {string}
   */
  export const formatPetAge = (age) => {
    if (!age) return '';
    
    const { years, months } = age;
    
    if (years === 0 && months === 0) {
      return 'Under 1 month';
    }
    
    let ageString = '';
    
    if (years > 0) {
      ageString += `${years} year${years !== 1 ? 's' : ''}`;
    }
    
    if (years > 0 && months > 0) {
      ageString += ', ';
    }
    
    if (months > 0) {
      ageString += `${months} month${months !== 1 ? 's' : ''}`;
    }
    
    return ageString;
  };
  
  /**
   * Get status badge variant
   * @param {string} status 
   * @returns {string}
   */
  export const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Available':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Adopted':
        return 'secondary';
      case 'Approved':
        return 'success';
      case 'Rejected':
        return 'danger';
      case 'Completed':
        return 'primary';
      default:
        return 'primary';
    }
  };
  
  /**
   * Truncate text with ellipsis
   * @param {string} text 
   * @param {number} limit 
   * @returns {string}
   */
  export const truncateText = (text, limit = 100) => {
    if (!text) return '';
    
    if (text.length <= limit) {
      return text;
    }
    
    return text.substring(0, limit) + '...';
  };
  
  /**
   * Get pet photo URL
   * @param {string} photo 
   * @returns {string}
   */
  export const getPetPhotoUrl = (photo) => {
    if (!photo) {
      return '/images/pet-placeholder.jpg';
    }
    
    return `${UPLOAD_PATH}/pets/${photo}`;
  };
  
  /**
   * Format file size
   * @param {number} bytes 
   * @returns {string}
   */
  export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  