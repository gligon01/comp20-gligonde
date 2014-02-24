
function draw() {
    canvas = document.getElementById('game');
    sprite = document.getElementById('dh');


    // Check if canvas is supported on browser
    if (canvas.getContext) {
        ctx = canvas.getContext('2d');
       	ctx.fillStyle = "#87CEEB";
        ctx.fillRect (0, 0, 800, 520);
        ctx.fillStyle = "#C96A1B";
        ctx.fillRect (0, 520, 800, 80);
        
        // Bushes
        ctx.drawImage(sprite,0,270,80,125,0,90,216,338);

        // Tree 
        ctx.drawImage(sprite,0,713,900,189,0,355,800,168);

        // Sniffing dog
        ctx.drawImage(sprite,0,0,60,45,350,400,132,99);

        // Birds
        ctx.drawImage(sprite,0,110,40,35,220,50,100,75);
        ctx.drawImage(sprite,125,110,40,35,320,220,100,75);
        ctx.drawImage(sprite,255,110,40,35,420,100,100,75);
        ctx.drawImage(sprite,0,150,40,35,600,50,100,75);
        ctx.drawImage(sprite,125,150,40,35,50,10,100,75);	
    }
    else {
        alert('Sorry, canvas is not supported on your browser!');
    }
}
