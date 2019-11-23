import React, { useContext, useEffect } from "react";
import { WebSocketContext } from "../contexts/WebSocketContext";
import State from '../state';
import * as CHelper from '../canvas-helper';
import _ from 'lodash';

const WIDTH=700;
const HEIGHT=1000;
const WIDTH_GONDEL=100;
const HEIGHT_GONDEL=100;
const ZOOM_SPEED=0.2;
const DEFAULT_INTERPOLATION_INTERVAL=100;

const ANIMATION_SPEED_MESSAGE=3000;
const ANIMATION_SPEED_LOCATION=1000;
/**TODO
 * scale Invariance
 * interpolate messages
 * interpolate target messages
 * click handler for recipient
 */

const Canvas = React.memo(() => {
    console.warn("INIT");
  const { subscribe } = useContext(WebSocketContext);
  const canvasRef = React.createRef();

  const state=new State(ANIMATION_SPEED_MESSAGE,ANIMATION_SPEED_LOCATION);
  let initialStates=Array.from({length:10},(el,i)=>{
      return {
          id:i,
          location: {x: Math.random() * 1000, y: Math.random()*1000}
      }
  });
  state.updateUsers(initialStates);


  function updateData(data){
      if(data.type==="user"){
        state.updateUsers(data);
      }else if(data.type==="message"){
        state.updateMessages(data);
      }
  }

  function animateAnswer(){
      //take start position of sender and animate to position of receiver
  }

  useEffect(() => {
      const subscription = subscribe({
      next: (data) => {
        updateData(data);
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [subscribe, updateData]);


   function initCanvas(canvas){
       window.setInterval(()=>{
           for(let i=0;i<3;i++){
               state.updateUsers([{
                   id: _.random(0,10),
                   location: {x: Math.random() * 1000, y: Math.random()*1000}
               }]);
           }

           for(let i=0;i<2;i++){
               let rand_text = Math.random().toString(36).substring(7);
               let message={
                   id:_.random(0,10000000),
                   user_id:_.random(0,9),
                   message:rand_text,
                   target_id: Math.random()>0.8 ? null : _.random(0,9)
               };
               state.updateMessages([message]);
           }
       },2000);

       window.requestAnimationFrame(redraw);

       let backgroundImage=document.getElementById('skikarte');
       let gondelImage=document.getElementById('gondel');

       var ctx = canvas.getContext('2d');
       trackTransforms(ctx);

       function redraw(){
           var p1 = ctx.transformedPoint(0,0);
           var p2 = ctx.transformedPoint(canvas.width,canvas.height);
           ctx.clearRect(p1.x,p1.y,p2.x-p1.x,p2.y-p1.y);
           drawBackground(ctx);

           for(let user of state.getUsers()){
               ctx.save();
               let x=user.location.x;
               let y=user.location.y;
               ctx.drawImage(gondelImage,x-WIDTH_GONDEL/2,y-HEIGHT_GONDEL/2,WIDTH_GONDEL,HEIGHT_GONDEL);
               ctx.restore();
           }

           for(let message of state.getMessages()){
               ctx.save();
               let x,y=null;
               if(message.location){
                    x=message.location.x;
                    y=message.location.y;
               }else{
                   x=message.user.location.x;
                   y=message.user.location.y;
               }

               CHelper.speechBubble(ctx,message.message,x,y);
           }

            window.requestAnimationFrame(redraw);

       }

       function drawBackground(ctx){
           ctx.drawImage(backgroundImage,200,50);
       }

       //redraw();

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
               //redraw();
           }
       },false);
       canvas.addEventListener('mouseup',function(evt){
           dragStart = null;
           if (!dragged) zoom(evt.shiftKey ? -1 : 1 );
       },false);

       var scaleFactor = 1.2;
       var zoom = function(clicks){
           var pt = ctx.transformedPoint(lastX,lastY);
           ctx.translate(pt.x,pt.y);
           let zoomSpeed=Math.min(ZOOM_SPEED,Math.max(-ZOOM_SPEED,clicks));
           var factor = Math.pow(scaleFactor,zoomSpeed);
           ctx.scale(factor,factor);
           ctx.translate(-pt.x,-pt.y);
         //  redraw();
       };

       var handleScroll = function(evt){
           var delta = evt.wheelDelta ? evt.wheelDelta/40 : evt.detail ? -evt.detail : 0;
           if (delta) zoom(delta);
           return evt.preventDefault() && false;
       };
       canvas.addEventListener('DOMMouseScroll',handleScroll,false);
       canvas.addEventListener('mousewheel',handleScroll,false);
   }


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
  }, [canvasRef, initCanvas]);

  return <canvas className="canvas" ref={canvasRef} />;
});

export default Canvas;