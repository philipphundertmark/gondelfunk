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

function speechBubble(ctx, text, x, y,highlighted,opacity,sex) {
    let messure;
    if(cachedMeasures[text]){
        messure=cachedMeasures[text];
    }else{
        messure = ctx.measureText(text);
        cachedMeasures[text]=messure;
    }

    var w = messure.width;
    var h = 60;

    drawBubble(ctx,x,y,w,h,highlighted,1.,sex);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#000';
    ctx.fillText(text, x, y-18);

    return {width:w*1.5,height:h*1.5};
}

function drawBubble(ctx,x,y,w,h,highlighted,opacity,sex){
    ctx.beginPath();
    ctx.strokeStyle="black";

    ctx.lineWidth="1";
    ctx.font = "32px Rubik";
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



    ctx.moveTo(x, y);
    ctx.lineTo(x + (w*0.2), y);
    ctx.lineTo(x + (w*0.2), y+10);
    ctx.lineTo(x + (w*0.3), y);
    ctx.lineTo(x + w, y);

    ctx.quadraticCurveTo(x + (w*1.1), y, x + (w*1.1), y-(h*0.2)); // corner: right-bottom

    ctx.lineTo(x + (w*1.1), y-(h*0.8)); // right

    ctx.quadraticCurveTo(x + (w*1.1), y-h, x + w, y-h); // corner: right-top

    ctx.lineTo(x, y-h); // top

    ctx.quadraticCurveTo(x - (w*0.1), y-h, x - (w*0.1), y-(h*0.8)); // corner: left-top

    ctx.lineTo(x - (w*0.1), y-(h*0.2)); // left

    ctx.quadraticCurveTo(x - (w*0.1), y, x, y); // corner: left-bottom

    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    return {width:w*1.5,height:h*1.5};
}

function emoticonBubble(ctx,code,x,y,isAnswer,opacity,sex){
    let elementId=emoticonImages[code] || 'emoji_frozen';
    let image=document.getElementById(elementId);
    if(!isAnswer){
        let w = 50;
        let h = 60;
        drawBubble(ctx,x,y,w,h,false,1.,sex)
    }
    ctx.drawImage(image,x,y-55,50,50);
}

export {speechBubble,emoticonBubble}