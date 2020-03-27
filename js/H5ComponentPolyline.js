/* 柱图组件对象 */

var H5ComponentPolyline = function (name, cfg) {
  var component = new H5ComponentBase(name, cfg);

  //绘制网格线
  var w = cfg.width/2;
  var h = cfg.height/2;

  //加入一个画布（网格线背景）
  var cns = document.createElement('canvas');//画布
  var ctx = cns.getContext('2d');//画布对象
  cns.width  = ctx.width = w;
  cns.height  = ctx.height = h;
  component.append(cns);
  //水平网格线 分成10份
  var step = 10;
  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.strokeStyle = '#AAAAAA';

  window.ctx  = ctx;
  for ( var i=0; i<step+1; i++){
    var y = h/step*i;
    ctx.moveTo(0,y);
    ctx.lineTo(w,y);
  }

  //垂直网格线 根据项目的个数去分
  step = cfg.data.length+1;//5个项目，分成6份
  var text_w = w/step >> 0;
  for (var i=0; i<step+1; i++){//step+1是画上最后一根线
    var x = w/step*i;
    ctx.moveTo(x,0);
    ctx.lineTo(x,h);

    if(cfg.data[i]) {
      var text = $('<div class="text">');
      text.text(cfg.data[i][0]);
      text.css({'width':text_w,'left':x+text_w/2});
      component.append(text);
    }
  }
  ctx.stroke();


  //绘制折线数据
  var cns = document.createElement('canvas');//画布（数据层）
  var ctx = cns.getContext('2d');//画布对象
  cns.width = ctx.width = w;
  cns.height = ctx.height = h;
  component.append(cns);

  var draw = function (per) {
    //清空画布
    ctx.clearRect(0,0,w,h);
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#ff8878';

    var x = 0;
    var y = 0;
    var row_w = w / (cfg.data.length + 1);
    //画点
    for (var i = 0; i < cfg.data.length; i++) {
      x = row_w * (i + 1);
      y = h * (1 - cfg.data[i][1]*per);
      ctx.moveTo(x, y);
      ctx.arc(x, y, 2.5, 0, 2 * Math.PI);
    }


    //连线
    //移动画点第一个数据的点位置
    ctx.moveTo(row_w, h * (1 - cfg.data[0][1]*per));
    for (var i = 1; i < cfg.data.length; i++) {
      x = row_w * (i + 1);
      y = h * (1 - cfg.data[i][1]*per);
      ctx.lineTo(x, y);
    }
    ctx.stroke();//断掉，否则阴影四周有粗线


    ctx.strokeStyle = 'rgba(255,136,1209,0)';
    //绘制阴影
    ctx.lineTo(x, h);
    ctx.lineTo(row_w, h);
    ctx.fillStyle = 'rgba(255,136,1209,0.2)';
    ctx.fill();


    //写数据
    for (var i = 0; i < cfg.data.length; i++) {
      x = row_w * (i + 1);
      y = h * (1 - cfg.data[i][1]*per);
      ctx.fillStyle = cfg.data[i][2] ? cfg.data[i][2] : '#595959';
      ctx.fillText(((cfg.data[i][1] * 100) >> 0) + '%', x - 10, y - 10);
    }
    ctx.stroke();
  };


  //折线图生长动画
  component.on('onLoad', function () {
    var s = 0;
    for( var i = 0; i < 100; i++){
      setTimeout(function () {
        s += 0.01;
        draw(s)
      },i*10+500)
    }
  });


  component.on('onLeave', function () {
    var s = 1;
    for( var i = 0; i < 100; i++){
      setTimeout(function () {
        s -= 0.01;
        draw(s)
      },i*10)
    }
  });

  return component;
};
