/**
 * Converts any valid date/time input into a formatted date & time
 *
 * @param {string | number | Date} inputDate
 * @param {Object} options
 * @returns {string}
 */
export function formatDateTime(
    inputDate,
    options = {}
  ) {
    if (!inputDate) return "";
  
    const date = new Date(inputDate);
  
    // Invalid date protection
    if (isNaN(date.getTime())) {
      console.warn("Invalid date provided:", inputDate);
      return "";
    }
  
    const {
      locale = "en-US",
      timeZone, // e.g. "UTC", "Asia/Kolkata"
      formatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      },
    } = options;
  
    return date.toLocaleString(locale, {
      ...formatOptions,
      ...(timeZone ? { timeZone } : {}),
    });
  }
  