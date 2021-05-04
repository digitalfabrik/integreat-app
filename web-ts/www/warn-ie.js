/* eslint-disable no-magic-numbers */

(function () {
  // Get IE browser version
  var version = detectIE()

  if (version !== false && version < 11) {
    alert('You are using a deprecated browser, that we don\'t support. Please upgrade your browser to view this site.')
  }

  /**
   * detect IE
   * returns version of IE or false, if browser is not Internet Explorer
   * From https://codepen.io/gapcode/pen/vEJNZN
   */
  function detectIE () {
    var ua = window.navigator.userAgent
    var msie = ua.indexOf('MSIE ')
    if (msie > 0) {
      // IE 10 or older => return version number
      return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10)
    }
    var trident = ua.indexOf('Trident/')
    if (trident > 0) {
      // IE 11 => return version number
      var rv = ua.indexOf('rv:')
      return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10)
    }
    // other browser
    return false
  }
})()
