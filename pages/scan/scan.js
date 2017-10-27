var Bmob = require('../../utils/bmob.js');
var common = require('../../utils/common.js');

var title = "Title";
var subtitle = "Subtitle";
var author = ["Author"];
var translator = ["Translator"];
var isbn = "XXXXXX";
var binding = "无";
var series = "无";
var summary = "Summary";
var author_intro = "Author Intro";
var publisher = "Publisher";
var pages = "1";
var imageSource = "/image/default_book_pic.jpg";
var tags = [];
var rating = ["0.0","0"];

Page({
  data: {
    articleTitle: title,
    articleAuthor: author,
    isbn: isbn,
    imageSource: imageSource,
    subtitle: subtitle,
    translator: translator,
    binding: binding,
    series: series,
    summary: summary,
    author_intro: author_intro,
    publisher: publisher,
    pages: pages,
    tags: tags,
    rating: rating
  },

  onLoad: function (options) {

  },

  onScanButton: function () {
    var that = this;
    wx.scanCode({
      onlyFromCamera: false,
      success: function (res) {

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

            console.log(res);
            if (res.data.hasOwnProperty("title") && res.data.title) {
              title = res.data.title;
            }
            else {
              title = "无标题";
            }

            if (res.data.hasOwnProperty("subtitle") && res.data.subtitle) {
              subtitle = res.data.subtitle;
            }
            else {
              subtitle = "无副标题";
            }

            if (res.data.hasOwnProperty("author") && res.data.author.length) {
              author = res.data.author;
            }
            else {
              author = ["无作者"];
            }

            if (res.data.hasOwnProperty("translator") && res.data.translator.length) {
              translator = res.data.translator;
            }
            else {
              translator = ["无译者"];
            }

            if (res.data.hasOwnProperty("series") && res.data.series) {
              series = res.data.series;
            }
            else {
              series = "无系列信息";
            }

            if (res.data.hasOwnProperty("binding") && res.data.binding) {
              binding = res.data.binding;
            }
            else {
              binding = "无装裱信息";
            }

            if (res.data.hasOwnProperty("summary") && res.data.summary) {
              summary = res.data.summary;
              summary = summary.split("\n").join("");
            }
            else {
              summary = "无概要";
            }

            if (res.data.hasOwnProperty("author_intro") && res.data.author_intro) {
              author_intro = res.data.author_intro;
            }
            else {
              author_intro = "无作者简介";
            }

            if (res.data.hasOwnProperty("pages") && res.data.pages) {
              pages = res.data.pages;
            }
            else {
              pages = 0;
            }

            if (res.data.hasOwnProperty("publisher") && res.data.publisher) {
              publisher = res.data.publisher;
            }
            else {
              publisher = "无出版社信息";
            }
            
            if (res.data.images && res.data.images.large) {
              imageSource = res.data.images.large;
            }

            if (res.data.hasOwnProperty("tags") && res.data.tags) {
              tags = res.data.tags;
            }
            else {
              tags = [];
            }

            if (res.data.hasOwnProperty("rating") && res.data.rating) {
              rating[0] = res.data.rating.average;
              rating[1] = res.data.rating.numRaters.toString();
            }
            else {
              rating = ["0.0","0"];
            }

            that.setData({
              articleTitle: title,
              articleAuthor: author,
              isbn: isbn,
              imageSource: imageSource,
              subtitle: subtitle,
              translator: translator,
              binding: binding,
              series: series,
              summary: summary,
              author_intro: author_intro,
              publisher: publisher,
              pages: pages,
              tags: tags,
              rating: rating
            });

            wx.showModal({
              title: '图书信息获取成功',
              content: '请点击确认键将图书信息上传到数据库中',
              success: function(res) {
                if (res.confirm) {
                  console.log('用户点击确定');
                  var Book = Bmob.Object.extend("book");
                  var query = new Bmob.Query(Book);
                  query.equalTo("isbn",isbn);
                  query.equalTo("title",title);
                  query.find({
                    success: function(Result) {
                      console.log(Result);
                      if (Result.length) {
                        var booknumber = Result[0].get("number");
                        Result[0].set("number", ++booknumber);
                        Result[0].save(null, {
                          success: function (r) {
                            console.log("number+1");
                            wx.showModal({
                              showCancel: false,
                              title: '提示',
                              content: '库里已有相同的书，已将对应的书籍数量进行增加',
                            });
                          },
                          error: function (r, error) {
                            console.log(error);
                          }
                        });
                      }
                      else {
                        var book = new Book();
                        console.log("ddddd");
                        book.set("number",1);     //数量置1
                        book.set("isbn", isbn);   //isbn号
                        book.set("title", title);
                        book.set("subtitle", subtitle);
                        book.set("subtitle", subtitle);
                        book.set("author", author);
                        book.set("translator", translator);
                        book.set("binding", binding);
                        book.set("series", series);
                        book.set("summary", summary);
                        book.set("author_intro", author_intro);
                        book.set("publisher", publisher);
                        book.set("pages", pages);
                        book.set("image", imageSource);
                        book.set("tags", tags);
                        book.set("rating", rating);

                        book.save(null, {
                          success: function (r) {
                            console.log("保存成功");
                            wx.showModal({
                              title: '哦恭喜',
                              content: '成功新加入一本书',
                              showCancel: false,
                            });
                          },
                          error: function (r,error) {
                            console.log(error);
                            wx.showModal({
                              title: '妈耶',
                              content: '好像库炸了没加进去',
                              showCancel: false,
                            });
                          }
                        });
                      }
                    }
                  });
                } else if (res.cancel) {
                  console.log('用户点击取消');
                }
              }
            })
          }
        })
      }
    });
  }

});