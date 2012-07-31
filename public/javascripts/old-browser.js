var ieWarnings = document.ieWarnings,
  browserList,
  browserItem;


browserItem = function (link, img, name) {
  var item = '<li class="span4" style="float: left;">' + 
              '<a class="thumbnail" href="' + link + '" style="text-align: center;">' + 
              '<img src="/images/browser-' + img + '" width="100">' +
              '<div class="caption"> <h3>' + name +
              '</h3></div>' +
              '</a></li>';
  return $(item);
}

browserList = $('<ul></ul>')
                .css({marginTop: "30px"})
                .append(browserItem('http://www.google.com/chrome/','chrome.png', 'Chrome'))
                .append(browserItem('http://www.mozilla.org/firefox','firefox.png', 'Firefox'))
                .append(browserItem('http://windows.microsoft.com/es-ES/internet-explorer/products/ie/home/','ie.png', 'Explorer'))


$('<div></div>')
  .addClass('row-fluid')
  .css({border: "1px #ddd solid",
        padding: "20px",
        marginBottom: "30px"})
  .append($('<h2></h2>').addClass('ext-h').text(ieWarnings.browserWarning))
  .append($('<h4></h4>').addClass('ext-h2').text(ieWarnings.browserWarningDesc))
  .append(browserList)
  .prepend($('<button type="button" class="close" data-dismiss="alert">×</button>'))
  .prependTo('header + .wrapper');