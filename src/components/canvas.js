import React, { useContext, useEffect } from "react";
import { WebSocketContext } from "../contexts/WebSocketContext";
import State from '../state';
import * as CHelper from '../canvas-helper';
import _ from 'lodash';
import {find} from "rxjs/operators";

const WIDTH=350;
const HEIGHT=750;
const WIDTH_GONDEL=100;
const HEIGHT_GONDEL=100;
const ZOOM_SPEED=0.3;
const SCALE_FOR_VISIBLE=0.5;
const DEFAULT_INTERPOLATION_INTERVAL=100;

const ANIMATION_SPEED_MESSAGE=3000;
const ANIMATION_SPEED_LOCATION=3000;
/**TODO
 * click handler for recipient+
 * min max translation and scale
 * receive data from websocket
 * wobbling gondle
 */

const Canvas = React.memo(({onClick}) => {
  const { subscribe } = useContext(WebSocketContext);
  const canvasRef = React.createRef();

  const [initialized,setInitialized] = React.useState(false);
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
        state.updateUsers(data["data"]);
      }else if(data.type==="message"){
        state.updateMessages(data["data"]);
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
       if(initialized){
           return;
       }
       setInitialized(true);
       let viewHeight=1;
       let viewTransform={x:0,y:0};

       window.setInterval(()=>{
          for(let i=0;i<10;i++){
               state.updateUsers([{
                   id: _.random(0,10),
                   location: {x: Math.random() * 100, y: Math.random()*1000}
               }]);
           }

           for(let i=0;i<40;i++){
               let rand_text = Math.random().toString(36).substring(7);
               let message={
                   id:_.random(0,10000000),
                   user_id:_.random(0,9),
                   message:rand_text,
                   target_id: Math.random()<0.95 ? null : _.random(0,9)
               };
               state.updateMessages([message]);
           }
       },2000);

       window.requestAnimationFrame(redraw);

       let backgroundImage=document.getElementById('skikarte');
       let gondelImage=document.getElementById('gondel');

       canvas.width = WIDTH;
       canvas.height = HEIGHT;

       let ctx = canvas.getContext('2d');
       trackTransforms(ctx);

       function findMessageAtPosition(clickX,clickY){
           let messages=state.getMessages();

           for(let message of messages){
               if(message.target_id || !message.user.location || !message.dimensions){
                   continue;
               }
               let x=message.user.location.x;
               let y=message.user.location.y;
               let width_textfield=message.dimensions.width;
               let height_textfield=message.dimensions.height;
               if(clickX>=x&&clickX<=x+width_textfield &&clickY>=y-height_textfield&&clickY<=y){
                   return message;
               }
           }

           return null;
       }

       function onDeselectMessage(message){
           message.selected=false;
       }

       function onSelectMessage(message){
           state.getMessages().forEach(message=>message.selected=false);
           message.selected=true;
       }

       function redraw(){
           let p1 = ctx.transformedPoint(0,0);
           let p2 = ctx.transformedPoint(canvas.width,canvas.height);
           ctx.clearRect(p1.x,p1.y,p2.x-p1.x,p2.y-p1.y);
           drawBackground(ctx);
           ctx.save();
           for(let user of state.getUsers()){
               let x=user.location.x;
               let y=user.location.y;

               let scaleFactor=Math.max(1,viewHeight);
               let width=WIDTH_GONDEL*1/scaleFactor;
               let height=HEIGHT_GONDEL*1/scaleFactor;
               ctx.drawImage(gondelImage,x-width/2,y-height/2,width,height);
           }

           for(let message of state.getMessages()){
               let x,y=null;
               if(message.location){
                    x=message.location.x;
                    y=message.location.y;
               }else{
                   x=message.user.location.x;
                   y=message.user.location.y;
               }

               if(viewHeight>0.35) {

                   if(message.message.startsWith("0x")){
                       let code=message.message.substr(2,1);
                       CHelper.emoticonBubble(ctx, code, x, y);
                   }else {
                       let dimensions = CHelper.speechBubble(ctx, message.message, x, y, message.selected, message.attention);
                       message.dimensions = dimensions;

                   }
               }
           }
            window.requestAnimationFrame(redraw);
       }

       function drawBackground(ctx){
           ctx.fillStyle="#fff";
           ctx.fillRect(-500,-500,3000,7000);
           ctx.drawImage(backgroundImage,0,0,1600,3400);
       }

       //redraw();

       let lastX=canvas.width/2, lastY=canvas.height/2;
       let dragStart,dragged;
       let mouseleft=false;
       canvas.addEventListener('mousedown',function(evt){
           mouseleft=false;
           document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
           lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
           lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);

           dragStart = ctx.transformedPoint(lastX,lastY);

           dragged = false;
       },false);

       canvas.addEventListener('mousemove',function(evt){
           if(mouseleft){
               dragged=false;
               return;
           }
           lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
           lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);

           dragged = true;
           if (dragStart){
               let pt = ctx.transformedPoint(lastX,lastY);
               let pt2x=ctx.transformedPoint(lastX+1,lastY);
               let pt2y=ctx.transformedPoint(lastX,lastY+1);
               let dPx=pt2x.x-pt.x;
               let dPy=pt2y.y-pt.y;

               let dx=pt.x-dragStart.x;
               let dy=pt.y-dragStart.y;
             //  console.log(evt.offsetX,pt.x,dPx,pt.x+dPx*(350-evt.offsetX));
               if((dx>=0 && pt.x-dPx*evt.offsetX>0) || (dx<=0 && pt.x+dPx*(350-evt.offsetX)<1650)) {
                   ctx.translate(pt.x - dragStart.x, 0);
                   viewTransform.x += pt.x - dragStart.x;
                   viewTransform.y += pt.y - dragStart.y;
               }
               console.log(viewTransform,viewHeight);

          //     console.log(pt.y-dPy*evt.offsetY);
              // console.log(dy,pt.y-dPy*evt.offsetY);

              // if((dy<=0 && pt.y-dPy*evt.offsetY>=0)){// && pt.y+dPy*(750-evt.offsetY))<=1650){
                   ctx.translate(0,pt.y - dragStart.y);
               //}

           }
       },false);

       canvas.addEventListener('mouseout',function(){
            mouseleft=true;
       });

       canvas.addEventListener('mouseup',function(evt){
           dragStart = null;

           let pt = ctx.transformedPoint(lastX,lastY);
           let message=findMessageAtPosition(pt.x,pt.y);
           if(message){
               onSelectMessage(message);
               onClick(message.user_id,message.message,()=>onDeselectMessage(message));
           }
       },false);

       let scaleFactor = 1.2;
       let zoom = function(clicks){
           let pt = ctx.transformedPoint(lastX,lastY);

           let zoomSpeed=Math.min(ZOOM_SPEED,Math.max(-ZOOM_SPEED,clicks));
           let factor = Math.pow(scaleFactor,zoomSpeed);
           if(viewHeight*factor<0.2|| viewHeight*factor>1.5){
               return;
           }

           ctx.translate(pt.x,pt.y);
           viewHeight*=factor;

           ctx.scale(factor,factor);
           ctx.translate(-pt.x,-pt.y);
       };

       function zoomToFixed(scale){
           let factor = scale;
           viewHeight*=factor;

           ctx.scale(factor,factor);
       }

       let handleScroll = function(evt){
           let delta = evt.wheelDelta ? evt.wheelDelta/40 : evt.detail ? -evt.detail : 0;
           if (delta) zoom(delta);
           return evt.preventDefault() && false;
       };
       canvas.addEventListener('DOMMouseScroll',handleScroll,false);
       canvas.addEventListener('mousewheel',handleScroll,false);

       //Initialize view
       zoomToFixed(0.22);
   }


    // Adds ctx.getTransform() - returns an SVGMatrix
    // Adds ctx.transformedPoint(x,y) - returns an SVGPoint
    function trackTransforms(ctx){
        let svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
        let xform = svg.createSVGMatrix();
        ctx.getTransform = function(){ return xform; };

        let savedTransforms = [];
        let save = ctx.save;
        ctx.save = function(){
            savedTransforms.push(xform.translate(0,0));
            return save.call(ctx);
        };
        let restore = ctx.restore;
        ctx.restore = function(){
            xform = savedTransforms.pop();
            return restore.call(ctx);
        };

        let scale = ctx.scale;
        ctx.scale = function(sx,sy){
            xform = xform.scaleNonUniform(sx,sy);
            return scale.call(ctx,sx,sy);
        };
        let rotate = ctx.rotate;
        ctx.rotate = function(radians){
            xform = xform.rotate(radians*180/Math.PI);
            return rotate.call(ctx,radians);
        };
        let translate = ctx.translate;
        ctx.translate = function(dx,dy){
            xform = xform.translate(dx,dy);
            return translate.call(ctx,dx,dy);
        };
        let transform = ctx.transform;
        ctx.transform = function(a,b,c,d,e,f){
            let m2 = svg.createSVGMatrix();
            m2.a=a; m2.b=b; m2.c=c; m2.d=d; m2.e=e; m2.f=f;
            xform = xform.multiply(m2);
            return transform.call(ctx,a,b,c,d,e,f);
        };
        let setTransform = ctx.setTransform;
        ctx.setTransform = function(a,b,c,d,e,f){
            xform.a = a;
            xform.b = b;
            xform.c = c;
            xform.d = d;
            xform.e = e;
            xform.f = f;
            return setTransform.call(ctx,a,b,c,d,e,f);
        };
        let pt  = svg.createSVGPoint();
        ctx.transformedPoint = function(x,y){
            pt.x=x; pt.y=y;
            return pt.matrixTransform(xform.inverse());
        }
   }

  useEffect(() => {
    const { current: canvas } = canvasRef;

     initCanvas(canvas);
  }, [canvasRef, initCanvas]);

  return <canvas className="canvas" ref={canvasRef} />;
});

export default Canvas;