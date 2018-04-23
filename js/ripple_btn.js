//水波纹按钮
module.exports={
    Init:function(flag){
		var doms='';
		if(tool.isString(flag)){
			doms=$(flag);
		}else{
			doms=flag;
		}

	
		doms.on('mousedown', function (e) {
         var bgCol=$(this).css('background-color');
		 bgCol=bgCol=='transparent'?'rgb(235,237,238)':bgCol;
         var colReg=/rgb\(([^\(\)]*)\)/i;
         var c_bgCol='';
         if(bgCol.match(colReg) && bgCol.match(colReg).length>0){
            var colArr=bgCol.match(colReg)[1].split(',');
            c_bgCol='rgb('+(parseInt(colArr[0])+50)+','+(parseInt(colArr[1])+50)+','+(parseInt(colArr[2])+100)+','+0.2+')';
         }
         
		 $(this).css('position','relative');
		  if($(this).find('div[class="md-ripple-container"]').length<=0){
			$(this).append('<div class="md-ripple-container"></div>');
		  }
		  var offset = $(this).offset();
		  var x = e.pageX;
		  var y = e.pageY;
		  var btnWidth=$(this).find('.md-ripple-container').width();
		  
		  $(this).find('.md-ripple-container').css('background-color',c_bgCol || 'rgba(33,33,33,0.098)');

		  var $ripple = $('<span class="ripple" style="width:'+btnWidth+'px;height:'+btnWidth+'px;"></span>');
		  $ripple.appendTo($(this).find('.md-ripple-container')).css({
		  	left: x - offset.left - $ripple.width() / 2,
		  	top: y - offset.top - $ripple.height() / 2
		  });
		});
			
		doms.on('mouseup', function (e) {
			var self=this;
            setTimeout(function(){
                $(self).find('.md-ripple-container').removeAttr('style');
			    $(self).find('.md-ripple-container').find('.ripple').remove();
            },300);
		});
		doms.on('mouseout', function (e) {
            var self=this;
            setTimeout(function(){
                $(self).find('.md-ripple-container').removeAttr('style');
			    $(self).find('.md-ripple-container').find('.ripple').remove();
            },300);
		});
	}
}