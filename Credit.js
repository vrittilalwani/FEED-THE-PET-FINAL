class Credit {
    constructor(){

    this.image=loadImage('Images/Food Stock.png');
    }

    display(){
        var CreditS;
       imageMode(CENTER);
       image(this.image,displayWidth/2-300,100,200,200);
     
       var CreditStock=database.ref('Credit');
       CreditStock.on("value",function (data){
         CreditS=data.val();
       });
       if(CreditS>0){
       textSize(40);
       stroke("black");
       strokeWeight(5);
       text(CreditS,displayWidth/2-310,60);
     }
    }
}
