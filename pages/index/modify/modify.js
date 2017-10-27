// pages/index/detail/index.js
var Bmob = require('../../../utils/bmob.js');
var common = require('../../../utils/common.js');
Page({
  data: {
    rows: {},
    showTopTips: false,
    writeDiary: false,
    loading: false,
    windowHeight: 0,
    windowWidth: 0,
    limit: 10,
    bookList: [],
    modifyDiarys: false,
    objectid:0
  },
  onLoad: function (e) {
    // 页面初始化 options为页面跳转所带来的参数
    var objectId = e.objectId;
    this.objectid = objectId;
    var that = this;
    // if (!e.objectId) {
    //   common.showTip("请重新进入", "loading");
    //   return false;
    // }

    var Book = Bmob.Object.extend("book");
    var query = new Bmob.Query(Book);

    query.get(objectId, {
      success: function (result) {
        console.log(result);

        that.setData({
          rows: result,

        })
        // The object was retrieved successfully.        
      },
      error: function (result, error) {
        console.log("查询失败");
      }
    });
  },
  showTopTips: function () {
    var that = this;
    this.setData({
      showTopTips: true
    });
    setTimeout(function () {
      that.setData({
        showTopTips: false
      });
    }, 3000);
  },
  modifyBook: function (event) {
    var objectId = this.objectid;
    console.log(objectId);
    var subtitle = event.detail.value.subtitle;
    var isbn = event.detail.value.isbn;
    var translator = [event.detail.value.translator];
    var publisher = event.detail.value.publisher;
    var ratingscore = event.detail.value.ratingscore;
    var ratingnumber = event.detail.value.ratingnumber;
    var rating = [ratingscore, ratingnumber];
    var binding = event.detail.value.binding;
    var series = event.detail.value.series;
    var pages = event.detail.value.pages;
    var author_intro = event.detail.value.author_intro;
    var summary = event.detail.value.summary;
    var formId = event.detail.formId;
    console.log("event", event)
    var currentUser = Bmob.User.current();

    var User = Bmob.Object.extend("_User");
    var UserModel = new User();

    // var post = Bmob.Object.createWithoutData("_User", "594fdde53c");
    var Book = Bmob.Object.extend("book");
    var book = new Bmob.Query(Book);

    book.get(objectId, {
      success: function (result) {
        console.log(result)
        // 回调中可以取得这个 GameScore 对象的一个实例，然后就可以修改它了
        result.set('subtitle', subtitle);
        result.set('isbn', isbn);
        result.set('translator', translator);
        result.set('publisher', publisher);
        result.set('rating', rating);
        result.set('binding', binding);
        result.set('series', series);
        result.set('pages', pages);
        result.set('author_intro', author_intro);
        result.set('summary', summary);
        result.save();
        common.showTip('书籍修改成功', 'success', function () {
          wx.navigateBack({
            delta: 1
          })
        });

        // The object was retrieved successfully.
      },
      error: function (object, error) {
        common.showTip('书籍修改失败，请重新发布', 'loading');

      }
    })
  }
})