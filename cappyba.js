


class cappy{
    constructor(spriteSheet, invspriteSheet, id, name){

        this.id = id;
        this.name = name;
        this.pos = createVector(random(0,width),random(0,height));
        this.lastx = createVector(this.pos.x,this.pos.y);
        this.spriteSheet = spriteSheet;
        this.invspriteSheet = invspriteSheet;
        this.curImg;
        this.state = 'idle';
        this.animPos = random(0,5);
        this.maxframes = 7;
        this.idleC = 0;
        this.dir = 'right;'
        this.moveToo = createVector(random(0,width),random(0,height));
        //Life variables 
        this.thirst = random(0,100);
        this.hunger = random(20,120);
        this.social = 100;
        this.heat = random(0,100);
        this.busy = false;
        this.Foundfood = null;
        this.selectedFood = null;
        this.favfood = random(foods);
    }
    update(){
        
        fill(0);
        switch(this.state){
            case 'idle':
                this.idle();
                this.wander();
                break;
            case 'wandering':
                this.walk();
                this.wander();
                textSize(24);
                text('🕶', this.pos.x-10, this.pos.y)
                break;
            case 'sit':
                this.sit();
                break;
            case 'thirsty':
                this.seekWater();
                text('💦', this.pos.x - 10, this.pos.y);
            break;
            case 'drinking':
                this.drink();
                this.thirst += 0.9;
                this.heat -= 0.5;
            break;
            case 'hot':
                text('🔥', this.pos.x,this.pos.y);
            break;
            case 'hungry':
                this.sit();
                text('hunger', this.pos.x, this.pos.y);
                //ALL CAPPIES NOW HAVE FOOD!
                if(this.Foundfood != null){
                    this.state = 'hunting'
                }//this.wander();
               
            break;
            case 'hunting':
                this.travel(this.Foundfood.pos)
                line(this.pos.x,this.pos.y, this.Foundfood.pos.x, this.Foundfood.pos.y)
                text(this.favfood, this.pos.x, this.pos.y);
                if(dist(this.pos.x,this.pos.y, this.Foundfood.pos.x, this.Foundfood.pos.y) < 20){
                    this.state = 'eating';
                }
            break;
            case 'eating':
                this.munch();
            break;

        }
        this.rightleft();
        //managers ]

        this.heatManager();

        this.thirstManager();
        
        this.hungerManager();

        this.frameManager();
  
        
        if(dist(mouseX, mouseY, this.pos.x+32, this.pos.y+32) < 32){
            textSize(23)
            fill(0);
            //text('thirst: '+ this.thirst, width - 300, 30);
            //text('heat: '+ this.heat, width - 300, 50);
            
            //text('hunger: '+ this.hunger, width - 300, 80);


            text(this.name, this.pos.x - 10, this.pos.y - 10);
        }

    }
    //animation managers
    idle(){
        switch(this.dir){
            case 'right':
                image(this.spriteSheet.get(this.animPos*(64),80, 64, 64), this.pos.x, this.pos.y); // need a way to rotate the image. INVERT THE SPRITE SHEET
            break;
            case 'left':
                image(this.invspriteSheet.get((this.maxframes-this.animPos)*(64),80, 64, 64), this.pos.x, this.pos.y); // need a way to rotate the image. 
            break;
        }
        if(this.animPos == 6){
            this.idleC++;
        }
    }
    walk(){
        switch(this.dir){
            case 'right':
                image(this.spriteSheet.get(this.animPos*(64),532, 64, 64), this.pos.x, this.pos.y);
                break;
            case 'left' :
                image(this.invspriteSheet.get((this.maxframes-this.animPos)*(64),532, 64, 64), this.pos.x, this.pos.y);
                break;
        }
    }
    eat(){
        switch(this.dir){
            case 'right':
                image(this.spriteSheet.get(this.animPos*(64),400, 64, 64), this.pos.x, this.pos.y);
            break;
            case 'left':
                image(this.invspriteSheet.get((this.maxframes-this.animPos)*(64),400, 64, 64), this.pos.x, this.pos.y);
            break;
        }
    }
    sit(){
        switch(this.dir){
            case 'right':
                image(this.spriteSheet.get(this.animPos*(64),200, 64, 64), this.pos.x, this.pos.y);
            break;
            case 'left':
                image(this.invspriteSheet.get((this.maxframes-this.animPos)*(64),200, 64, 64), this.pos.x, this.pos.y);
            break;
        }
    }

    wander(){  //Find a way more sophisticated path finder algo
        if(dist(this.pos.x, this.pos.y, this.moveToo.x, this.moveToo.y) > 40){
            this.idleC = 0;
            this.state = 'wandering';
            this.travel(this.moveToo);
        } else {
            this.state = 'idle';
        }
        let x = random(0,50);
        if(frameCount % 30 == 0){
            if(x < 1){
                this.moveToo.set(random(0,width), random(0,height))
            }
        }
    }

    rightleft(){
        if(this.lastx.x < this.pos.x){
            this.dir = 'right';
            //text('right', this.pos.x, this.pos.y)
        } else {
            this.dir = 'left';
            //text('left', this.pos.x, this.pos.y)
        }if(this.lastx == this.pos.x){
            //text('Stationary', this.pos.x, this.pos.y)
        }
    }

    frameManager(){
        //if(this.idleC > 20){
            //this.state = 'sit';
        //}
        if(frameCount % 7 == 0){
            this.animPos += 1;
        }
        if(this.animPos > 7){
            this.animPos = 0;
        }
    }
    
    //life functions 
    thirstManager(){
        if(frameCount%80 == 0){
            this.thirst -= random(2,5);
        }
        if(this.thirst < 10 && this.busy == false){
            this.busy = true;
            this.state = 'thirsty';
        }

    }
    seekWater(){
        if(dist(this.pos.x, this.pos.y, width/1.25, height/1.25) < 120){
            this.state = 'drinking';
        } else {
            this.travel(createVector(width/1.25, height/1.25));
        }
    }
    drink(){
        
        this.eat();
        
        if(this.thirst >= 100){
            this.busy = false;
            this.state = 'wandering';
        } 
    }
    travel(location){
        let move = p5.Vector.lerp(this.pos, location, 0.005);
        this.lastx.x = this.pos.x;
        this.pos.x = move.x;
        this.pos.y = move.y;
        this.walk();
    }

    heatManager(){
        if(dist(this.pos.x, this.pos.y, width/2, height/2) >= 100){
            this.heat += 0.03;
        } else if((dist(this.pos.x, this.pos.y, width/2, height/2) < 100) && this.state == 'hot' ){
            this.sit();
            this.busy = true;

            if(this.heat > 0){
                this.heat -= 0.6;
            }  
            if(this.heat < 30){
                 this.state = 'wandering';
                this.busy = false;
            }
        }

        if(this.heat > 80 && this.busy == false){
            this.state = 'hot';
            this.travel(createVector((width/2)+ random(-50,50), (height/2)+random(-50,50)));
            //this.busy = true;
        }
    }

    hungerManager(){
        if(frameCount%80 == 0){
            this.hunger -= random(2,5);
        }
        if(this.hunger < 10 && this.busy == false){
            this.state = 'hungry';
            this.busy = true;
            this.seekfood();
        }
    }
    seekfood(){
        this.sit();
        let found = false;
        let selectedFood = null;
        for(let i = 0; i < food.length; i++){
            if(found == false){
                if(food[i].taken != true){
                    line(this.pos.x, this.pos.y, food[i].pos.x, food[i].pos.y);
                    food[i].taken = true;
                    found = true;
                    selectedFood = food[i];
                    food[i].diner = this.id;
                    break;
                }
            } else {
                break;
            }  
        }
        
        if(selectedFood != null){
            this.Foundfood = selectedFood;
            line(this.pos.x, this.pos.y, selectedFood.pos.x, selectedFood.pos.y);
        }
    }

    munch(){
        this.eat();
        this.hunger += 0.9;
        text('🍴', this.pos.x, this.pos.y);
        if(this.hunger > 100){
            this.Foundfood = null;
            this.state = 'wandering'
            this.busy = false;
        }
    }
}

class grass{
    constructor(x, y){
        this.pos = createVector(x, y);
        this.taken = false;

        this.diner = null;

        this.nutrients = 100;


    }

    update(){
        
        let stateCheck = null;
        this.draw();
        //someone is eating this
        if(this.diner != null){
            //text('i am being eaten!', this.pos.x, this.pos.y);
            for(let i = 0; i < Cappy.length; i++){
                if(this.diner == Cappy[i].id){
                    stateCheck = Cappy[i].state;
                }
            }
            if(stateCheck == 'wandering'){
                this.diner = null;
                this.taken = false;
                this.pos.set(random(0,width/1.25), random(0,height/1.25));
            }

        }


        //if(stateCheck == 'eating'){
            //this.nutrients -= 0.1;
            //text('i am being eaten!' + this.nutrients, this.pos.x-10, this.pos.y);
        //}

    }

    draw(){
        fill(0,255,0);
        image(grassSprite, this.pos.x, this.pos.y, 32,32);
    }
}


let clickPos;
let spriteSheet;
let invspriteSheet;
let grassSprite;
let tree;
let Cappy = [];
let food = [];
const foods = ['🍩','🌙','🍪','🍭','🤝','🍕','🥑']
const names = ['Puddles','Fidoonie','Mr. Whiskerface','Sir Barksalot','Princess Paws','Captain Cuddles','Luna-tic','Biscuit','Ziggy Puff','Buddy Boop','Pepperoni','Scooter Bug','Sassy Pants','Sir Licks-a-Lot','Professor Snuggles','Mister Meowgi','Daisy Doodle','Rocky Roadkill','Gizmo','Lady Wags-a-Lot','Snickerdoodle','Toby Toebeans','Baxter Bowtie','Butterscotch','Sir Floofington','Muffin Man','Bella Boo','Captain Slobberpants','Foxy Lady','Noodle Noggin','Mr. Bingley','Pickle Paws','Ginger Snap','Sir Wags-a-Lot','Winnie the Pooch','Rufus Rascal','Scooter McLovin','Squishy Face','Mittens','Chewbacca','Ziggy Stardust','Popcorn','Moo Moo','Loki Laufeyson','Fluffy McFlufferson','Kiki Kitten','Thor Thunderpaws','Sassy Frass'];
//const waterLoc = createVector(width/2, height/2);

function preload(){
    
    spriteSheet = loadImage("/./MyScripts/Capy/charlieTheCapybaraAnimationSheet.png");
    invspriteSheet = loadImage("/./MyScripts/Capy/charlieTheCapybaraAnimationSheetInverse.png")
    grassSprite = loadImage("/./MyScripts/Capy/Grass.png")
    tree = loadImage("/./MyScripts/Capy/Tree.png")
}

function setup(){   

    var canvas = createCanvas(1080, 600);

    canvas.parent('CappyFrame');
    clickPos = createVector(width/2, height/2);

    for(let i = 0; i < 100; i++){
        food.push(new grass(random(0,width/1.25), random(0,height/1.25)))
    }

    for(let i = 0; i < 30; i ++){
        Cappy.push( new cappy(spriteSheet, invspriteSheet, i, names[i]));
    }

}

function draw(){
    background(0,160,60);
    
    fill(80,80,200,900)
    ellipse(width, height/1.15, 700,400)
    
    for(let i = 0; i < food.length; i++){
        food[i].update();
    }

    for(let i = 0; i < Cappy.length; i ++){
        Cappy[i].update()
        
    }
    
    image(tree,width/3, height/5.5);
    noStroke();
    fill(80,80,80,80)
    ellipse(width/2, height/1.85, 400,80)

}

function mouseClicked(){
    clickPos.set(mouseX,mouseY);
}

