// example/user/book/book.js
var articleTitle = "Title";
var articleAuthor = "Author";
var isbn = "XXXXXX";
var imageSource = "/image/default_book_pic.jpg";

Page({
  data: {
    articleTitle: articleTitle,
    articleAuthor: articleAuthor,
    isbn: isbn,
    imageSource: imageSource
  },

  onLoad: function (options) {

  },

  onScanButton: function () {
    var that = this;
    wx.scanCode({
      onlyFromCamera: false,
      success: function (res) {
        console.log(res.result);
        isbn = res.result;
        that.setData({
          isbn: isbn,
        });
        wx.request({
          url: 'https://api.douban.com/v2/book/isbn/' + isbn,
          data: {},
          method: 'GET',
          header: {
            "Content-Type": "json"
          },//Keep this in Development reference
          success: function (res) {
            articleTitle = res.data.title;
            articleAuthor = res.data.author;
            console.log(res);
            if (res.data.images && res.data.images.large) {
              imageSource = res.data.images.large;
            }
            that.setData({
              articleTitle: articleTitle,
              articleAuthor: articleAuthor,
              isbn: isbn,
              imageSource: imageSource
            });
          }
        })
      }
    });
  }

});