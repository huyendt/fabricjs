$(document).ready(function(){   
    // create a wrapper around native canvas element (with id="c")
    window.canvas = new fabric.Canvas('myCanvas', {
//        backgroundColor: 'black'
    }); 
    
    window.canvasRender = new fabric.Canvas('myCanvasRender', {
    });   
    
    //create image filter
    window.filter = fabric.Image.filters;
    
    var filters = ['grayscale', 'invert', 'remove-white', 'sepia', 'sepia2',
                      'brightness', 'noise', 'gradient-transparency', 'pixelate',
                      'blur', 'sharpen', 'emboss', 'tint', 'multiply', 'blend'];
    
    //delete object
    $( "#btn-del" ).click(function() {
        var activeObject = canvas.getActiveObject();
        canvas.remove(activeObject);                
    });
    
    //clear canvas
    $( "#btn-clear" ).click(function() {
        canvas.clear();
        canvasRender.clear();
        $("#svg-render").html("");
    });
    
    $("#btn-to-svg").click(function() {    
        $("#svg-render").html(canvas.toSVG());
//        var canvasRender = new fabric.Canvas('myCanvasRender');
//        fabric.loadSVGFromString(canvas.toSVG(), function(objects, options) {
//            var obj = fabric.util.groupSVGElements(objects, options);
//            canvasRender.add(obj).renderAll();
//        });        
    });
    
    $("#btn-to-json").click(function() {   
        console.log(JSON.stringify(canvas));                
        canvasRender.clear();
        canvasRender.renderAll();
        canvasRender.loadFromDatalessJSON(JSON.stringify(canvas));
        canvasRender.renderAll();
    });    
    
    //change canvas bg color
    $( "select#bg-color" ).change(function() {
        canvas.backgroundColor = this.value;
        canvas.renderAll();
    });
    
    //add line
    $( "#btn-line" ).click(function() {             
        var line = new fabric.Line([ 50, 100, 200, 200], {
          left: 100,
          top: 100,
          stroke: 'yellow'
        });
        canvas.add(line);
    });
    
    //add rect
    $( "#btn-rect" ).click(function() {
        var rect = new fabric.Rect({
            left: 100,
            top: 100,
            fill: 'red',
            width: 100,
            height: 100,
            strokeWidth: 5, 
            stroke: 'rgba(100,200,200,0.5)',
            angle: 15,
            flipY: 'true'            
        });         
        canvas.add(rect);
        
        // animate    
//        rect.animate('left', 500, {
//          onChange: canvas.renderAll.bind(canvas),
//          duration: 1000,
//          easing: fabric.util.ease.easeOutBounce
//        });        
    });    
    
    //add circle
    $( "#btn-circle" ).click(function() {
        var circle = new fabric.Circle({
            radius: 50, fill: 'green', left: 150, top: 150
        });
        canvas.add(circle);
    });  
    
    //add triangle
    $( "#btn-triangle" ).click(function() {
        var triangle = new fabric.Triangle({
            width: 100, height: 100, fill: 'blue', left: 200, top: 200
        });
        canvas.add(triangle);
    });  
        
    //input text
    $('#input-text').keyup(function (e) {     
        var text = canvas.getActiveObject();  
        if (e.which == 13) {
            canvas.deactivateAll().renderAll();
             $('#input-text').val("");
        } else {                     
            var val = $('#input-text').val(); 
            var color = $('#text-color').val();            
            if (text && text.type == "text") {
                text.set({text: val});   
                text.setColor(color);
                canvas.renderAll();
            } else {
                var text = new fabric.Text(val, { left: 100, top: 100 });
                text.setColor(color);               
                canvas.add(text);
                canvas.setActiveObject(text);
                canvas.renderAll();
            }    
        }        
    });
    
    //change text color
    $( "select#text-color" ).change(function() {
        var text = canvas.getActiveObject();          
        if (text) {             
            text.setColor(this.value);
            canvas.renderAll();
        }        
    });
    
    
    
    //image
    $("img").click(function(){
        var object = canvas.getActiveObject();
        var url = $(this).attr("src");
        if (object && object.type == "rect") { 
            //use pattern of rect  
//            fabric.util.loadImage(url, function (img) {
//                object.setPatternFill({
//                    width: 100,
//                    height: 100,
//                    source: img,
//                    repeat: 'repeat'
//                });
//                canvas.renderAll();
//            });
                
            //use apply properties of rect to image
            fabric.Image.fromURL(url, function(image) {                 
                image.set('left', object.getLeft());
                image.set('top', object.getTop());   
                image.set('width', object.getWidth());
                image.set('height', object.getHeight());                
                image.set('angle', object.getAngle());
                image.set('fill', object.getFill());                   
                image.set('stroke', object.getStroke());   
                image.set('scaleX', object.getScaleX());   
                image.set('scaleY', object.getScaleY());  
                image.set('flipX', object.getFlipX());   
                image.set('flipY', object.getFlipY());                  
                canvas.add(image).setActiveObject(image);
            });
        } else {                    
            fabric.Image.fromURL(url, function(image) {                          
                canvas.add(image).setActiveObject(image);
            });
        }
    });
    
    //event when select object
    canvas.on({
        'object:selected': function() {
            $("input[type='checkbox']").each(function() {
                $(this).prop('checked', false);             
            });                       
            
            jQuery.each(filters, function(i, val) {                            
                $('#' + filters[i]).prop('checked', !!canvas.getActiveObject().filters[i]);    
            });
        },
        'selection:cleared': function() {
            $("input[type='checkbox']").each(function(){           
                $(this).prop('checked', false);
            });
        }
      });
    
    //apply filter
    function applyFilter(index, filter) {
        var obj = canvas.getActiveObject();
        obj.filters[index] = filter;
        obj.applyFilters(canvas.renderAll.bind(canvas));
    }
    
    function applyFilterValue(index, prop, value) {
        var obj = canvas.getActiveObject();
        if (obj.filters[index]) {
            obj.filters[index][prop] = value;
            obj.applyFilters(canvas.renderAll.bind(canvas));
        }
    }
    
    $("#grayscale").change(function() {        
        applyFilter(jQuery.inArray("grayscale", filters), $(this).prop('checked') && new filter.Grayscale());
    });
    
    $("#invert").change(function() {      
        applyFilter(jQuery.inArray("invert", filters), $(this).prop('checked') && new filter.Invert());
    });
    
    $("#sepia").change(function() {      
        applyFilter(jQuery.inArray("sepia", filters), $(this).prop('checked') && new filter.Sepia());
    });
    
    $("#sepia2").change(function() {      
        applyFilter(jQuery.inArray("sepia2", filters), $(this).prop('checked') && new filter.Sepia2());
    });
              
    $("#remove-white").change(function() {      
        applyFilter(jQuery.inArray("remove-white", filters), $(this).prop('checked') && new filter.RemoveWhite({
            threshold: $('#remove-white-threshold').val(),
            distance: $('#remove-white-distance').val()
        }));
    });
    
    $("#remove-white-threshold").change(function() {          
        applyFilterValue(jQuery.inArray("remove-white", filters), 'threshold', $(this).val());
    });
    
    $("#remove-white-distance").change(function() {      
        applyFilterValue(jQuery.inArray("remove-white", filters), 'distance', $(this).val());
    });
    
    $("#brightness").change(function() {      
        applyFilter(jQuery.inArray("brightness", filters), $(this).prop('checked') && new filter.Brightness({
            brightness: parseInt($('#brightness-value').val(), 10)
        }));
    });    
    
    $("#brightness-value").change(function() {      
        applyFilterValue(jQuery.inArray("brightness", filters), 'brightness', parseInt($(this).val(), 10));
    });
    
    $("#noise").change(function() {      
        applyFilter(jQuery.inArray("noise", filters), $(this).prop('checked') && new filter.Noise({
            noise: parseInt($('#noise-value').val(), 10)
        }));
    });
    
    $("#noise-value").change(function() {      
        applyFilterValue(jQuery.inArray("noise", filters), 'noise', parseInt($(this).val(), 10));
    });
    
    $("#gradient-transparency").change(function() {      
        applyFilter(jQuery.inArray("gradient-transparency", filters), $(this).prop('checked') && new filter.GradientTransparency({
            threshold: parseInt($('#gradient-transparency-value').val(), 10)
        }));
    });
    
    $("#gradient-transparency-value").change(function() {    
        console.log($(this).val());
        applyFilterValue(jQuery.inArray("gradient-transparency", filters), 'threshold', parseInt($(this).val(), 10));
    });
    
    $("#pixelate").change(function() {      
        applyFilter(jQuery.inArray("pixelate", filters), $(this).prop('checked') && new filter.Pixelate({
            blocksize: parseInt($('#pixelate-value').val(), 10)
        }));
    }); 
    
    $("#pixelate-value").change(function() {           
        applyFilterValue(jQuery.inArray("pixelate", filters), 'blocksize', parseInt($(this).val(), 10));
    });
    
    $("#blur").change(function() {      
        applyFilter(jQuery.inArray("blur", filters), $(this).prop('checked') && new filter.Convolute({
            matrix: [ 1/9, 1/9, 1/9,
                    1/9, 1/9, 1/9,
                    1/9, 1/9, 1/9 ]
        }));
    }); 
    
    $("#sharpen").change(function() {      
        applyFilter(jQuery.inArray("sharpen", filters), $(this).prop('checked') && new filter.Convolute({
            matrix: [  0, -1,  0,
                    -1,  5, -1,
                    0, -1,  0 ]
        }));
    }); 
    
    $("#emboss").change(function() {      
        applyFilter(jQuery.inArray("emboss", filters), $(this).prop('checked') && new filter.Convolute({
            matrix: [ 1,   1,  1,
                    1, 0.7, -1,
                    -1,  -1, -1 ]
        }));
    });         
    
    $("#tint").change(function() {      
        applyFilter(jQuery.inArray("tint", filters), $(this).prop('checked') && new filter.Tint({
            color: $('#tint-color').val(),
            opacity: parseFloat($('#tint-opacity').val())
        }));
    });
    
    $("#tint-color").change(function() {           
        applyFilterValue(jQuery.inArray("tint", filters), 'color', $(this).val());
    });
    
    $("#tint-opacity").change(function() {           
        applyFilterValue(jQuery.inArray("tint", filters), 'opacity', $(this).val());
    });
    
    $("#multiply").change(function() {      
        applyFilter(jQuery.inArray("multiply", filters), $(this).prop('checked') && new filter.Multiply({
            color: $('#multiply-color').val()           
        }));
    });
    
    $("#multiply-color").change(function() {           
        applyFilterValue(jQuery.inArray("multiply", filters), 'color', $(this).val());
    });
    
    $("#blend").change(function() {             
        applyFilter(jQuery.inArray("blend", filters), $(this).prop('checked') && new filter.Blend({
            color: $('#blend-color').val(),
            mode: $('#blend-mode').val(),            
        }));
    });
    
    $("#blend-mode").change(function() {           
        applyFilterValue(jQuery.inArray("blend", filters), 'mode', $(this).val());
    });
    
    $("#blend-color").change(function() {           
        applyFilterValue(jQuery.inArray("blend", filters), 'color', $(this).val());
    });        
});