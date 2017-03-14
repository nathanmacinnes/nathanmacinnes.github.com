(function () {
  var
    defaultSiteName = window.localStorage.getItem('site_info') || '',
    hash,
    masterPw,
    siteName,
    siteNameElement,
    promptWin;
  promptWin = window.open(null, null, 'menubar=no,location=no,resizable=no,scrollbars=no,status=no,width=400px,height=200px');
  promptWin.document.write('<html><head><title>Password Generator</title><style>label{min-width:220px;display:inline-block;}input{width:150px;}</style></head><body><label for="a">Site-specific name/info:</label><input id="a"><br><label for="b">Master password:</label><input type="password" id="b"><br><button>Generate</button></body></html>');
  siteNameElement = promptWin.document.getElementById('a');
  siteNameElement.value = defaultSiteName;
  promptWin.document.querySelector('button').addEventListener('click', function () {
    masterPw = promptWin.document.getElementById('a').value;
    siteName = siteNameElement.value;
    promptWin.close();
    if (masterPw === '' || siteName === '') {
      return;
    }
    sha256(masterPw + siteName).then(function (digest) {
      hash = digest.substr(0, 25);
    });
    document.addEventListener('click', function (event) {
      if (event.target.matches(['input[type=password]'])) {
        event.target.value = hash;
      }
    });
    window.localStorage.setItem('site_info', siteName);
    sha256(masterPw + siteName).then(function (digest) {
      hash = digest.substr(0, 25);
    });
  });
  function sha256(str) {
    var buffer = new TextEncoder("utf-8").encode(str);
    return crypto.subtle.digest("SHA-256", buffer).then(function (buffer) {
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
    });
  }
}());
