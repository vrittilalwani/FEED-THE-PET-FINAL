class Score {
    constructor(){

    this.image=loadImage('Images/Milk.png');
    }

    display(){
        var foodS;
       imageMode(CENTER);
       image(this.image,displayWidth/2+300,100,200,200);
     
       var foodStock=database.ref('Food');
       foodStock.on("value",function (data){
         foodS=data.val();
       });

       textSize(40);
       stroke("black");
       strokeWeight(5);
       text(foodS,displayWidth/2+280,120);
      
    }
}
