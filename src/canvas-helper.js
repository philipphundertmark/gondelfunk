let cachedMeasures={};

const emoticonImages=[
    'emoji_aubergine',
    'emoji_beer',
    'emoji_frozen',
    'emoji_gondel',
    'emoji_mountain',
    'emoji_poop',
    'emoji_sonnenbrille',
    'emoji_stars'
];

var measureWidthElement=null;

function speechBubble(ctx, text, x, y,highlighted,opacity,sex,scale=1) {
    if(!measureWidthElement){
        measureWidthElement=document.getElementById("measureWidthElement");
    }

    let fontsize=32*scale;
    ctx.font = `${fontsize}px Rubik`;

    let messure;
    let hash=text+"$"+scale;
    if(cachedMeasures[hash]){
        messure=cachedMeasures[hash];
    }else{
        messure = ctx.measureText(text).width;
        cachedMeasures[hash]=messure;
    }

    var w = messure;
    var h = 60*scale;

    drawBubble(ctx,x,y,w,h,highlighted,1.,sex,scale);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#000';

    ctx.fillText(text, x, y-18*scale);

    return {width:w*1.5,height:h*1.5};
}

function drawBubble(ctx,x,y,w,h,highlighted,opacity,sex,scale){
    ctx.beginPath();
    ctx.strokeStyle="black";

    ctx.lineWidth="1";
    if(highlighted) {
        ctx.lineWidth="4";
        ctx.fillStyle = "rgba(255, 100, 100,"+ opacity+")";
    }else {
        if (sex === "mars") {
            ctx.fillStyle = "rgba(128, 190, 255, " + opacity + ")";
        } else if (sex === "venus") {
            ctx.fillStyle = "rgba(255, 128, 168, " + opacity + ")";
        } else {
            ctx.fillStyle = "rgba(255, 255, 255, " + opacity + ")";
        }
    }



    ctx.moveTo(x-(w*0.1), y);
    ctx.lineTo(x-(w*0.1), y);
    ctx.lineTo(x-(w*0.1), y+20);
    ctx.lineTo(x-(w*0.1)+20, y);
    ctx.lineTo(x -(w*0.1) + w, y);

    ctx.quadraticCurveTo(x + (w*1.1), y, x + (w*1.1), y-(h*0.2)); // corner: right-bottom

    ctx.lineTo(x + (w*1.1), y-(h*0.8)); // right

    ctx.quadraticCurveTo(x + (w*1.1), y-h, x + w, y-h); // corner: right-top

    ctx.lineTo(x, y-h); // top

    ctx.quadraticCurveTo(x - (w*0.1), y-h, x - (w*0.1), y-(h*0.8)); // corner: left-top

    ctx.lineTo(x - (w*0.1), y-(h*0.2)); // left

    ctx.lineTo(x- (w*0.1),y);
    //ctx.quadraticCurveTo(x - (w*0.1), y, x, y); // corner: left-bottom

    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    return {width:w*1.5,height:h*1.5};
}

function emoticonBubble(ctx,code,x,y,isAnswer,opacity,sex,scale=1){
    let elementId=emoticonImages[code] || 'emoji_frozen';
    let image=document.getElementById(elementId);

    let w=50*scale;
    let h=60*scale;
    if(!isAnswer){
        drawBubble(ctx,x,y,w,h,false,1.,sex,scale)
    }
    let offset=55*scale;
    ctx.drawImage(image,x,y-offset,50*scale,50*scale);
}

export {speechBubble,emoticonBubble}