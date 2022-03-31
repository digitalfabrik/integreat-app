/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-magic-numbers */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/*
 * File: iframeResizer.contentWindow.js
 * Desc: Include this file in any page being loaded into an iframe
 *       to force the iframe to resize to the content size.
 * Requires: iframeResizer.js on host page.
 * Doc: https://github.com/davidjbradshaw/iframe-resizer
 * Author: David J. Bradshaw - dave@bradshaw.net
 *
 */


;(function iframeResizerContentWindow() {
  if (typeof window === 'undefined') { return } // don't run for server side render
  var autoResize = true
  var bodyObserver = null
  var eventCancelTimer = 128
  var firstRun = true
  var height = 1
  var initLock = true
  var initMsg = ''
  var interval = 32
  var intervalTimer = null
  var msgID = '[iFrameSizer]' // Must match host page msg ID
  var msgIdLen = msgID.length
  var myID = ''
  var resizeFrom = 'child'
  var sendPermit = true
  var target = window.parent
  var targetOriginDefault = '*'
  var triggerLocked = false
  var triggerLockedTimer = null
  var throttledTimer = 16
  var width = 1
  var win = window

  var passiveSupported = false

  function addEventListener(el, evt, func, options) {
    el.addEventListener(evt, func, passiveSupported ? options || {} : false)
  }

  function removeEventListener(el, evt, func) {
    el.removeEventListener(evt, func, false)
  }

  var getNow =
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    Date.now ||
    function getNowF () {
      return new Date().getTime()
    }

  // Based on underscore.js
  function throttle(func) {
    var context
    var args
    var result
    var timeout = null
    var previous = 0
    var later = () => {
      previous = getNow()
      timeout = null
      result = func.apply(context, args)
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!timeout) {
        // eslint-disable-next-line no-multi-assign
        context = args = null
      }
    }

    return () => {
      var now = getNow()

      if (!previous) {
        previous = now
      }

      var remaining = throttledTimer - (now - previous)

      context = this
      // eslint-disable-next-line prefer-rest-params
      args = arguments

      if (remaining <= 0 || remaining > throttledTimer) {
        if (timeout) {
          clearTimeout(timeout)
          timeout = null
        }

        previous = now
        result = func.apply(context, args)

        if (!timeout) {
          // eslint-disable-next-line no-multi-assign
          args = null
          context = null
        }
      } else if (!timeout) {
        timeout = setTimeout(later, remaining)
      }

      return result
    }
  }

  function sendSize(triggerEvent) {
    function isDoubleFiredEvent() {
      return triggerLocked && triggerEvent === 'resize'
    }

    if (!isDoubleFiredEvent()) {
      if (triggerEvent === 'init') {
        sizeIFrame(triggerEvent)
      } else {
        sizeIFrameThrottled(triggerEvent)
      }
    }
  }

  function readDataFromParent() {
    var data = initMsg.substring(msgIdLen).split(':')

    myID = data[0]
    interval = undefined !== data[4] ? Number(data[4]) : interval
    resizeFrom = undefined !== data[13] ? data[13] : resizeFrom
  }

  function resetIFrame() {
    lockTrigger()
    triggerReset('reset')
  }

  function resizeEventHandler() {
    sendSize('resize')
  }

  function startEventListeners() {
    if (autoResize) {
      addEventListener(window, 'resize', resizeEventHandler, { passive: true })
      setupMutationObserver()
    }
  }

  function disconnectMutationObserver() {
    if (bodyObserver !== null) {
      /* istanbul ignore next */ // Not testable in PhantonJS
      bodyObserver.disconnect()
    }
  }

  function stopEventListeners() {
    removeEventListener(window, 'resize', resizeEventHandler)
    disconnectMutationObserver()
    clearInterval(intervalTimer)
  }

  function injectClearFixIntoBodyElement() {
    var clearFix = document.createElement('div')
    clearFix.style.clear = 'both'
    // Guard against the following having been globally redefined in CSS.
    clearFix.style.display = 'block'
    clearFix.style.height = '0'
    document.body.appendChild(clearFix)
  }

  function sendMsg(height, width, triggerEvent, msg, targetOrigin) {
    if (sendPermit === true) {
      var size = `${height}:${width}`
      var message = `${myID}:${size}:${triggerEvent}${undefined !== msg ? `:${  msg}` : ''}`

      target.postMessage(msgID + message, targetOrigin === undefined ? targetOriginDefault : targetOrigin)
    }
  }

  function setupPublicMethods() {
    win.parentIFrame = {
      autoResize: function autoResizeF(resize) {
        if (resize && !autoResize) {
          autoResize = true
          startEventListeners()
        } else if (!resize && autoResize) {
          autoResize = false
          stopEventListeners()
        }
        sendMsg(0, 0, 'autoResize', JSON.stringify(autoResize))
        return autoResize
      },
      close: function closeF() {
        sendMsg(0, 0, 'close')
      },

      getId: function getIdF() {
        return myID
      },

      reset: function resetF() {
        resetIFrame('parentIFrame.reset')
      },

      sendMessage: function sendMessageF(msg, targetOrigin) {
        sendMsg(0, 0, 'message', JSON.stringify(msg), targetOrigin)
      },

      setTargetOrigin: function setTargetOriginF(targetOrigin) {
        targetOriginDefault = targetOrigin
      },

      size: function sizeF() {
        sendSize('size')
      }
    }
  }

  function initInterval() {
    if (interval !== 0) {
      intervalTimer = setInterval(() => {
        sendSize('interval')
      }, Math.abs(interval))
    }
  }

  // watch whether the document is fully loaded
  function setupBodyMutationObserver() {
    var elements = []
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver

    function addImageLoadListners(mutation) {
      function addImageLoadListener(element) {
        if (element.complete === false) {
          element.addEventListener('load', imageLoaded, false)
          element.addEventListener('error', imageError, false)
          elements.push(element)
        }
      }

      if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
        addImageLoadListener(mutation.target)
      } else if (mutation.type === 'childList') {
        Array.prototype.forEach.call(mutation.target.querySelectorAll('img'), addImageLoadListener)
      }
    }

    function removeFromArray(element) {
      elements.splice(elements.indexOf(element), 1)
    }

    function removeImageLoadListener(element) {
      element.removeEventListener('load', imageLoaded, false)
      element.removeEventListener('error', imageError, false)
      removeFromArray(element)
    }

    function imageEventTriggered(event, type) {
      removeImageLoadListener(event.target)
      sendSize(type)
    }

    function imageLoaded(event) {
      imageEventTriggered(event, 'imageLoad')
    }

    function imageError(event) {
      imageEventTriggered(event, 'imageLoadFailed')
    }

    function mutationObserved(mutations) {
      sendSize('mutationObserver')

      // Deal with WebKit / Blink asyncing image loading when tags are injected into the page
      mutations.forEach(addImageLoadListners)
    }

    var target = document.querySelector('body')
    var config = {
      attributes: true,
      attributeOldValue: false,
      characterData: true,
      characterDataOldValue: false,
      childList: true,
      subtree: true
    }

    var observer = new MutationObserver(mutationObserved)

    observer.observe(target, config)

    return {
      disconnect () {
        if ('disconnect' in observer) {
          observer.disconnect()
          elements.forEach(removeImageLoadListener)
        }
      }
    }
  }

  function stopInfiniteResizingOfIFrame() {
    document.documentElement.style.height = ''
    document.body.style.height = ''
  }

  function init() {
    readDataFromParent()
    injectClearFixIntoBodyElement()
    stopInfiniteResizingOfIFrame()
    setupPublicMethods()
    startEventListeners()
    sendSize('init')
  }

  function setupMutationObserver() {
    var forceIntervalTimer = interval < 0

    if (window.MutationObserver || window.WebKitMutationObserver) {
      if (forceIntervalTimer) {
        initInterval()
      } else {
        bodyObserver = setupBodyMutationObserver()
      }
    } else {
      initInterval()
    }
  }

  function getHeight() {
    const isMap = document.querySelector('.mapboxgl-map')
    if (isMap) {
      return 1000
    }
    const header = document.querySelector('header')
    const main = document.querySelector('main')
    const footer = document.querySelector('footer')

    const headerHeigth = header !== null ? header.offsetHeight : 0
    const mainHeight = main !== null ? main.offsetHeight : 0
    const footerHeight = footer !== null ? footer.offsetHeight : 0
    const computedHeigth = headerHeigth + mainHeight + footerHeight + 100
    return computedHeigth
  }

  function getWidth() {
      return Math.max(document.body.scrollWidth, document.documentElement.scrollWidth)
  }

  function sizeIFrame(triggerEvent) {
    var currentHeight
    var currentWidth

    function resizeIFrame() {
      height = currentHeight
      width = currentWidth

      sendMsg(height, width, triggerEvent)
    }
    currentHeight = getHeight()
    currentWidth = getWidth()

    if (Math.abs(height - currentHeight) > 0 || triggerEvent === 'init') {
      lockTrigger()
      resizeIFrame()
    }
  }

  var sizeIFrameThrottled = throttle(sizeIFrame)

  function lockTrigger() {
    if (!triggerLocked) {
      triggerLocked = true
    }
    clearTimeout(triggerLockedTimer)
    triggerLockedTimer = setTimeout(() => {
      triggerLocked = false
    }, eventCancelTimer)
  }

  function triggerReset(triggerEvent) {
    height = getHeight()
    width = getWidth()

    sendMsg(height, width, triggerEvent)
  }

  function receiver(event) {
    var processRequestFromParent = {
      init: function initFromParent() {
        initMsg = event.data
        target = event.source

        init()
        firstRun = false
        setTimeout(() => {
          initLock = false
        }, eventCancelTimer)
      },

      reset: function resetFromParent() {
        if (!initLock) {
          triggerReset('resetPage')
        }
      },

      resize: function resizeFromParent() {
        sendSize('resizeParent')
      }
    }

    function isMessageForUs() {
      return msgID === `${event.data}`.substring(0, msgIdLen) // ''+ Protects against non-string messages
    }

    function getMessageType() {
      return event.data.split(']')[1].split(':')[0]
    }

    function isInitMsg() {
      // Test if this message is from a child below us. This is an ugly test, however, updating
      // the message format would break backwards compatibity.
      return event.data.split(':')[2] in { true: 1, false: 1 }
    }

    if (isMessageForUs()) {
      if (firstRun === false) {
        var messageType = getMessageType()

        if (messageType in processRequestFromParent) {
          processRequestFromParent[messageType]()
        }
      } else if (isInitMsg()) {
        processRequestFromParent.init()
      }
    }
  }

  // Normally the parent kicks things off when it detects the iFrame has loaded.
  // If this script is async-loaded, then tell parent page to retry init.
  function chkLateLoaded() {
    if (document.readyState !== 'loading') {
      window.parent.postMessage('[iFrameResizerChild]Ready', '*')
    }
  }

  addEventListener(window, 'message', receiver)
  addEventListener(window, 'readystatechange', chkLateLoaded)
  chkLateLoaded()
})()
