"use strict";

window.onload = function () {
  var element = null;
  var layer = layui.layer;
  var isUploadOver = false; // 是否上传完毕
  layui.use('element', function () {
    element = layui.element;
  });
  layui.use("layer", function () {
    layer = layui.layer;
  });
  layui.use('form', function () {
    layui.form.on('submit(formDemo)', function (data) {
      var _data$field = data.field,
        appId = _data$field.appId,
        accountId = _data$field.accountId,
        token = _data$field.token;
      var loading = layer.load(0, {
        shade: [0.1, '#fff']
      });
      VhallUpload.createInstance({
        appId: appId,
        token: token,
        accountId: accountId
      }, function (res) {
        layer.close(loading);
        window.vodupload = res.interface;
        document.querySelector(".login").style.display = "none";
        document.querySelector(".main").style.display = "block";
      }, function (err) {
        layer.msg(err.msg);
      });
    });
  });

  // 点击选择文件
  var filesArr = [];
  $(document).on("change", "#fileInput", function (e) {
    console.log('select files..');

    // 判断是否上传过，若上传过则清空文件列表
    isUploadOver && (filesArr.length = 0);

    // 添加文件列表
    for (let index = 0; index < this.files.length; index++) {
      const element = this.files[index];
      filesArr.push(element);
    }

    //更新列表视图
    _updateList();

    window.filesArr = filesArr

    //显示开始上传按钮
    $("#testListAction").show();

    //更新是否上传状态
    isUploadOver = false;

    if (e.target) e.target.value = '';
    return false;
  });


  // 点击开始上传
  $(document).on("click", "#testListAction", function () {
    var reusltArr = [];
    var dom = document.querySelectorAll("#demoList .demo-delete");
    var removeDom = document.querySelectorAll("#demoList .demo-remove");
    //点击时隐藏上传按钮
    $("#testListAction").hide();
    $("#uploadListAction").addClass('layui-btn-disabled');

    // 上传时设置删除按钮不可点击
    for (var index = 0; index < dom.length; index++) {
      dom[index].classList.add("layui-btn-disabled");
      dom[index].style.pointerEvents = "none";

      removeDom[index].classList.add("layui-btn-disabled");
      removeDom[index].style.pointerEvents = "none";
    
    }

    function upload_success(res) {
      const index = res.index
      // 存储返回结果
      reusltArr.push(true);

      // 利用返回结果判断是否整体上传完成
      isUploadOver = (reusltArr.length === filesArr.length);

      // 取消按钮不可点击状态
      $('#demoList .demo-delete').eq(index).removeClass("layui-btn-disabled");
      $('#demoList .demo-delete').eq(index).css({ "pointerEvents": "unset" });

      $('#demoList .demo-remove').eq(index).removeClass("layui-btn-disabled");
      $('#demoList .demo-remove').eq(index).css({ "pointerEvents": "unset" });

      // 追加创建点播按钮
      if ($("#demoList .button-group").eq(index).find(".demo-create").length !== 0) {
        return;
      }
      $("#demoList .button-group").eq(index).append("<button class=\"layui-btn layui-btn-xs layui-btn-normal demo-create\">创建点播</button>");

      //上传完成后将文件名写入input
      var fileName = $("#demoList .fileName").eq(index).text();
      $("#demoList .fileName").eq(index).html(`<input type="text" class="fileNameinput" value="${fileName}"/>`)

      if (res.quickUpload) {
        $("#demoList .progress").eq(index).html("<span>文件已在服务器中存在</span>");
      }
    }
    function upload_progress(info) {
      // 更新进度条
      element.progress("demo" + info.index, info.progress * 100 + "%");
    }
    function upload_fail(err) {
      var index = err.index;

      // 存储返回结果
      reusltArr.push(true);

      // 利用返回结果判断是否整体上传完成
      isUploadOver = (reusltArr.length === filesArr.length);

      // 取消按钮不可点击状态
      $('#demoList .demo-delete').eq(index).removeClass("layui-btn-disabled");
      $('#demoList .demo-delete').eq(index).css({ "pointerEvents": "unset" });

      $('#demoList .demo-remove').eq(index).removeClass("layui-btn-disabled");
      $('#demoList .demo-remove').eq(index).css({ "pointerEvents": "unset" });

      // 提示错误
      $("#demoList .progress").eq(index).html("<span>" + err.msg + "</span>")
    }

    vodupload.on(VhallUpload.EVENT.FILE_CHECK_ERROR, upload_fail);
    vodupload.on(VhallUpload.EVENT.FILE_LIST_REPEAT, upload_fail);
    vodupload.on(VhallUpload.EVENT.FILE_UPLOAD_EXISTS, upload_fail);
    vodupload.on(VhallUpload.EVENT.FILE_UPLOAD_FAIL, upload_fail);
    vodupload.on(VhallUpload.EVENT.FILE_UPLOAD_PROGRESS, upload_progress);
    vodupload.on(VhallUpload.EVENT.FILE_UPLOAD_SUCCESS, upload_success);

    const res = vodupload.upload(filesArr, function (pro) {}, function (res) {}, function (err) {});

    res.then(function () {
      isUploadOver = true;
      vodupload.off(VhallUpload.EVENT.FILE_CHECK_ERROR, upload_fail);
      vodupload.off(VhallUpload.EVENT.FILE_LIST_REPEAT, upload_fail);
      vodupload.off(VhallUpload.EVENT.FILE_UPLOAD_EXISTS, upload_fail);
      vodupload.off(VhallUpload.EVENT.FILE_UPLOAD_FAIL, upload_fail);
      vodupload.off(VhallUpload.EVENT.FILE_UPLOAD_PROGRESS, upload_progress);
      vodupload.off(VhallUpload.EVENT.FILE_UPLOAD_SUCCESS, upload_success);
      $("#uploadListAction").removeClass('layui-btn-disabled');
    }, function () {
      isUploadOver = true;
      vodupload.off(VhallUpload.EVENT.FILE_CHECK_ERROR, upload_fail);
      vodupload.off(VhallUpload.EVENT.FILE_LIST_REPEAT, upload_fail);
      vodupload.off(VhallUpload.EVENT.FILE_UPLOAD_EXISTS, upload_fail);
      vodupload.off(VhallUpload.EVENT.FILE_UPLOAD_FAIL, upload_fail);
      vodupload.off(VhallUpload.EVENT.FILE_UPLOAD_PROGRESS, upload_progress);
      vodupload.off(VhallUpload.EVENT.FILE_UPLOAD_SUCCESS, upload_success);
      $("#uploadListAction").removeClass('layui-btn-disabled');
    });
  });

  // 移除列表文件
  $(document).on("click", '.demo-remove', function () {
    var index = $("#demoList tr").index($(this).parents("tr"));

    // 删除文件列表指定项
    filesArr.splice(index, 1);

    // 判断若上传是否上传过逻辑
    if (isUploadOver) {
      //若上传过则只删除列表中一项
      $(this).parents("tr").remove();
    } else {
      // 若未上传过则更新列表视图中的progress ID
      _updateList()
    }
  });

  // 删除文件
  $(this.document).on("click", ".demo-delete", function () {
    var index = $("#demoList tr").index($(this).parents("tr"));
    var _this  = this;
    const file = filesArr[index];
    vodupload.deleteFile({ file }, function (res) {
      layer.msg("删除成功")
    }, function (err) {
      layer.msg(err.msg)
    })
  })


  // 点击创建点播
  $(document).on("click", ".demo-create", function () {
    var _this = $(this);
    var index = $("#demoList tr").index($(this).parents("tr"));

    var newName = $(this).parent().siblings(".fileName").children("input").val();
    var file = filesArr[index];

    vodupload.createDemand({ file, fileName: newName }, function (res) {
      layer.open({
        content: "创建点播成功,recordId:".concat(res.recordId)
      });

      _this.addClass("layui-btn-disabled").css("pointer-events", "none");

      _this.text("已生成点播");

      _this.parent().siblings(".fileName").children("input").remove();
      _this.parent().siblings(".fileName").append(`<span>${newName}</span>`);

    }, function (err) {
      layer.msg(err.msg)
    });
  });


  function _updateList() {
    $("#demoList tr").remove();
    for (let index = 0; index < filesArr.length; index++) {
      const file = filesArr[index];
      var tr = '<tr>' +
        '<td class="fileName"><span>' + file.name.slice(0, file.name.lastIndexOf(".")) + '<span/></td>' +
        '<td>' + (file.size / 1024).toFixed(1) + 'kb</td>' +
        "<td class=\"progress\" width=\"280px;\"><div class=\"layui-progress layui-progress-big\" lay-showpercent=\"true\" lay-filter=\"demo".concat(index, "\"> <div class=\"layui-progress-bar\" lay-percent=\"0%\"></div></div></td>") +
        '<td class="button-group" width="150px">' +
        "<button class=\"layui-btn layui-btn-xs layui-btn-danger demo-remove\">移除文件</button>" +
        "<button class=\"layui-btn layui-btn-xs layui-btn-danger demo-delete\">删除文件</button>" +
        '</td>' +
        '</tr>';
      $("#demoList").append(tr);
    }
  }

};