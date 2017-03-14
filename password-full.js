(function () {
	var
  	hash,
  	masterPw = window.prompt('Enter master password'),
  	siteName;
  if (!masterPw) {
    return;
  }
  siteName = window.prompt('Enter site-specific name/memorable info', window.localStorage.getItem('site_info') || '');
  if (!siteName) {
    return;
  }
  window.localStorage.setItem('site_info', siteName);
  sha256(masterPw + siteName).then(function (digest) {
    hash = digest.substr(0, 25);
  });
  document.addEventListener('click', function (event) {
    if (event.target.matches(['input[type=password]'])) {
      event.target.value = hash;
    }
  });
  function sha256(str) {
    var buffer = new TextEncoder("utf-8").encode(str);
    return crypto.subtle.digest("SHA-256", buffer).then(function (hash) {
      return hex(hash);
    });
  }
  function hex(buffer) {
    var
      hexCodes = [],
      view = new DataView(buffer),
      value,
      stringValue,
      padding,
      paddedValue;
    for (var i = 0; i < view.byteLength; i += 4) {
      value = view.getUint32(i);
      stringValue = value.toString(16);
      padding = '00000000';
      paddedValue = (padding + stringValue).slice(-padding.length);
      hexCodes.push(paddedValue);
    }
    return hexCodes.join("");
  }
}());
