/* 雷达图组件对象 */

var H5ComponentRadar = function (name, cfg) {
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

  var r = w/2;
  var step = cfg.data.length;

  ctx.beginPath();
  ctx.arc(r,r,r-5,0,2*Math.PI);
  ctx.stroke();



  //计算一个圆周上的坐标（计算多边形的顶点坐标）
  //已知圆心坐标（a,b) 半径r 角度deg
  //rad = 2*Math.PI / step * i(第几个点）
  //x = a + Math.sin(rad) * r;
  //y = b + Math.cos(rad) * r;

  //绘制网格背景（分面绘制，分成10份）
  for(var s=10;s>0;s--){
    ctx.beginPath();
    for(var i=0;i<step;i++){
      var rad = 2*Math.PI / step * i;
      x = r + Math.sin(rad) * (r-5)*s*0.1;
      y = r + Math.cos(rad) * (r-5)*s*0.1;

      //ctx.moveTo(r,r);
      //ctx.lineTo(x,y);
      //ctx.arc(x,y,5,0,2*Math.PI);
      ctx.lineTo(x,y);
    }
    ctx.closePath();
    ctx.fillStyle = !(s%2) ? "#99c0ff" : "#f1f9ff";
    ctx.fill();

  }

  //绘制伞骨
  for(var i=0;i<step;i++){
    var rad = 2*Math.PI / step * i;
    x = r + Math.sin(rad) * (r-5);
    y = r + Math.cos(rad) * (r-5);
    ctx.moveTo(r,r);
    ctx.lineTo(x,y);
  //  输出项目文字
    var text = $('<div class="text">');
    text.text(cfg.data[i][0]);
    text.css('transition', 'all 1s '+ i*.5 + 's');

    if(x>w/2){
      text.css('left',x);
    }else{
      text.css('right',w-x);
    }
    if(y>h/2){
      text.css('top',y);
    }else{
      text.css('bottom',h-y);
    }

    if(cfg.data[i][2]){text.css('color',cfg.data[i][2])};
    text.css('opacity',0);
    component.append(text);
  }
  ctx.strokeStyle = "#e0e0e0";
  ctx.stroke();

  //数据层的开发
  //加入一个画布（数据层）
  var cns = document.createElement('canvas');
  var ctx = cns.getContext('2d');
  cns.width  = ctx.width = w;
  cns.height  = ctx.height = h;
  component.append(cns);

  ctx.strokeStyle = "#f00";
  var draw = function (per) {
    if(per>=1){
      $('.text').css('opacity',1);
    }

    if(per<1){
      $('.text').css('opacity',0);
    }
    ctx.clearRect(0,0,w,h);
    //输出数据的线
    for (var i=0;i<step;i++){
      var rad = 2*Math.PI / step * i;
      var rate = cfg.data[i][1]*per;
      x = r + Math.sin(rad) * (r-5)*rate;
      y = r + Math.cos(rad) * (r-5)*rate;
      ctx.lineTo(x,y);
    }
    ctx.closePath();
    ctx.stroke();


  //  输出数据的点
    ctx.fillStyle = "#ff7676";
    for (var i=0;i<step;i++){
      var rad = 2*Math.PI / step * i;
      var rate = cfg.data[i][1]*per;
      x = r + Math.sin(rad) * (r-5)*rate;
      y = r + Math.cos(rad) * (r-5)*rate;
      ctx.beginPath();
      ctx.arc(x,y,5,0,2*Math.PI);
      ctx.fill();
      ctx.closePath();
    }

  };



  //雷达图生长动画
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