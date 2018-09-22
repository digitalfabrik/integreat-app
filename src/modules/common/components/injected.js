// @flow

export default (files: { [url: string]: string }) => `
  var hrefs = document.querySelectorAll('[href]');
  var srcs = document.querySelectorAll('[src]')
  var urls =${JSON.stringify(files)};
  
  console.debug('Urls to inject:');
  console.debug(urls);

  for (var i = 0; i < hrefs.length; i++) {
    var item = hrefs[i];
    console.debug('Found href: ' + decodeURI(item.href));
    var newHref = urls[decodeURI(item.href)];
    if (newHref) {
      console.debug('Replaced ' + item.href + ' with ' + newHref);
      item.href = newHref;
    }
  }
  
  for (var i = 0; i < srcs.length; i++) {
    var item = srcs[i];
    console.debug('Found src: ' + decodeURI(item.src));
    var newSrc = urls[decodeURI(item.src)];
    if (newSrc) {
      console.debug('Replaced ' + item.src + ' with ' + newSrc);
      item.src = 'file://' + newSrc;
    }
  }
  
  document.body.style.display = 'block';
`
