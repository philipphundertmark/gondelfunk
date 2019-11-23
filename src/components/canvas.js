import React, { useContext, useEffect } from "react";
import { WebSocketContext } from "../contexts/WebSocketContext";
import './canvas.scss';

const WIDTH=700;
const HEIGHT=1000;

const Canvas = () => {
  const { subscribe } = useContext(WebSocketContext);
  const canvasRef = React.createRef();

  useEffect(() => {
    const subscription = subscribe({
      next: (message) => {
        console.log(message);
        // setMessages(messages => [...messages, message]);
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [subscribe]);


   function initCanvas(canvas){
       let image=document.getElementById('skikarte');
       var ctx = canvas.getContext('2d');
       trackTransforms(ctx);
       function redraw(){
           // Clear the entire canvas
           var p1 = ctx.transformedPoint(0,0);
           var p2 = ctx.transformedPoint(canvas.width,canvas.height);
           ctx.clearRect(p1.x,p1.y,p2.x-p1.x,p2.y-p1.y);

           // Alternatively:
           // ctx.save();
           // ctx.setTransform(1,0,0,1,0,0);
           // ctx.clearRect(0,0,canvas.width,canvas.height);
           // ctx.restore();

           ctx.drawImage(image,200,50);

           ctx.beginPath();
           ctx.lineWidth = 6;
           ctx.moveTo(399,250);
           ctx.lineTo(474,256);
           ctx.stroke();

           ctx.save();
           ctx.translate(4,2);
           ctx.beginPath();
           ctx.lineWidth = 1;
           ctx.moveTo(436,253);
           ctx.lineTo(437.5,233);
           ctx.stroke();

           ctx.save();
           ctx.translate(438.5,223);
           ctx.strokeStyle = '#06c';
           ctx.beginPath();
           ctx.lineWidth = 0.05;
           for (var i=0;i<60;++i){
               ctx.rotate(6*i*Math.PI/180);
               ctx.moveTo(9,0);
               ctx.lineTo(10,0);
               ctx.rotate(-6*i*Math.PI/180);
           }
           ctx.stroke();
           ctx.restore();

           ctx.beginPath();
           ctx.lineWidth = 0.2;
           ctx.arc(438.5,223,10,0,Math.PI*2);
           ctx.stroke();
           ctx.restore();
       }
       redraw();

       var lastX=canvas.width/2, lastY=canvas.height/2;
       var dragStart,dragged;
       canvas.addEventListener('mousedown',function(evt){
           document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
           lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
           lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
           dragStart = ctx.transformedPoint(lastX,lastY);
           dragged = false;
       },false);
       canvas.addEventListener('mousemove',function(evt){
           lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
           lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
           dragged = true;
           if (dragStart){
               var pt = ctx.transformedPoint(lastX,lastY);
               ctx.translate(pt.x-dragStart.x,pt.y-dragStart.y);
               redraw();
           }
       },false);
       canvas.addEventListener('mouseup',function(evt){
           dragStart = null;
           if (!dragged) zoom(evt.shiftKey ? -1 : 1 );
       },false);

       var scaleFactor = 1.1;
       var zoom = function(clicks){
           var pt = ctx.transformedPoint(lastX,lastY);
           ctx.translate(pt.x,pt.y);
           var factor = Math.pow(scaleFactor,clicks);
           ctx.scale(factor,factor);
           ctx.translate(-pt.x,-pt.y);
           redraw();
       }

       var handleScroll = function(evt){
           var delta = evt.wheelDelta ? evt.wheelDelta/40 : evt.detail ? -evt.detail : 0;
           if (delta) zoom(delta);
           return evt.preventDefault() && false;
       };
       canvas.addEventListener('DOMMouseScroll',handleScroll,false);
       canvas.addEventListener('mousewheel',handleScroll,false);
   };


    // Adds ctx.getTransform() - returns an SVGMatrix
    // Adds ctx.transformedPoint(x,y) - returns an SVGPoint
    function trackTransforms(ctx){
        var svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
        var xform = svg.createSVGMatrix();
        ctx.getTransform = function(){ return xform; };

        var savedTransforms = [];
        var save = ctx.save;
        ctx.save = function(){
            savedTransforms.push(xform.translate(0,0));
            return save.call(ctx);
        };
        var restore = ctx.restore;
        ctx.restore = function(){
            xform = savedTransforms.pop();
            return restore.call(ctx);
        };

        var scale = ctx.scale;
        ctx.scale = function(sx,sy){
            xform = xform.scaleNonUniform(sx,sy);
            return scale.call(ctx,sx,sy);
        };
        var rotate = ctx.rotate;
        ctx.rotate = function(radians){
            xform = xform.rotate(radians*180/Math.PI);
            return rotate.call(ctx,radians);
        };
        var translate = ctx.translate;
        ctx.translate = function(dx,dy){
            xform = xform.translate(dx,dy);
            return translate.call(ctx,dx,dy);
        };
        var transform = ctx.transform;
        ctx.transform = function(a,b,c,d,e,f){
            var m2 = svg.createSVGMatrix();
            m2.a=a; m2.b=b; m2.c=c; m2.d=d; m2.e=e; m2.f=f;
            xform = xform.multiply(m2);
            return transform.call(ctx,a,b,c,d,e,f);
        };
        var setTransform = ctx.setTransform;
        ctx.setTransform = function(a,b,c,d,e,f){
            xform.a = a;
            xform.b = b;
            xform.c = c;
            xform.d = d;
            xform.e = e;
            xform.f = f;
            return setTransform.call(ctx,a,b,c,d,e,f);
        };
        var pt  = svg.createSVGPoint();
        ctx.transformedPoint = function(x,y){
            pt.x=x; pt.y=y;
            return pt.matrixTransform(xform.inverse());
        }
   }

  useEffect(() => {
    const { current: canvas } = canvasRef;

     const dpr = window.devicePixelRatio || 1;
    // // Get the size of the canvas in CSS pixels.
     const rect = canvas.getBoundingClientRect();
    // // Give the canvas pixel dimensions of their CSS
     //size * the device pixel ratio.
     canvas.width = WIDTH;
     canvas.height = HEIGHT;

    // // get 2d context to draw on (the "bitmap" mentioned earlier)
     const ctx = canvas.getContext("2d");

     ctx.clearRect(0, 0, canvas.width, canvas.height);
     ctx.fillStyle="gray";
     ctx.fillRect(0,0,200,200);

     initCanvas(canvas);
  }, [canvasRef]);

  return <canvas className="canvas" ref={canvasRef} />;
};

export default Canvas;