module.exports=function Cart(cart){
    this.items=cart.items || {};
    this.totalItems=cart.totalItems || 0;
    this.totalPrice=cart.totalPrice || 0;

    this.add=function(item,Masapham){
       

        var cartItem=this.items[Masapham];
        if(!cartItem){
            cartItem=this.items[Masapham]={item: item, quantity:0, Gia:0};
        }
        cartItem.quantity++;
        cartItem.Gia=cartItem.item.Gia * cartItem.quantity;
        this.totalItems++;
        this.totalPrice +=cartItem.item.Gia;
    };

    this.remove =function(Masapham){
        this.totalItems -=this.items[Masapham].quantity;
        this.totalPrice -=this.items[Masapham].Gia;
        delete this.items[Masapham];
    };
    this.update =function(Masapham,a){

		var cartItem = this.items[Masapham];
		cartItem.quantity=a;
        cartItem.Gia = cartItem.item.Gia * a;
        
        
		console.log(cartItem);
	};

    this.getItems=function(){
        var arr = [];
        for(var Masapham in this.items){
            arr.push(this.items[Masapham]);
        }
        return arr;
    }
}