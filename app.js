const cards = document.getElementById('cards');
const items = document.getElementById('items');
const footer = document.getElementById('footer');

const templateCard = document.getElementById('template-card').content;
const templateFooter = document.getElementById('template-footer').content;
const templateCart = document.getElementById('template-cart').content;

const fragment = document.createDocumentFragment();
let cart = {};

document.addEventListener('DOMContentLoaded',()=>{
    fetchData();
    if( localStorage.getItem('cart') ){
        cart = JSON.parse( localStorage.getItem( 'cart' ) );
        renderCart();
    }
});

cards.addEventListener('click',(e)=>{
    addCart(e);
});

items.addEventListener('click',e=>{
    btnAction(e);
})

const fetchData = async () => {
    try{
        const res = await fetch('api.json');
        const data = await res.json();
        renderCards(data);
    }catch(err){
        console.log(err)
    }
}


const renderCards = ( data ) =>{
    data.forEach( product  => {
        templateCard.querySelector('h5').textContent = product.title;
        templateCard.querySelector('p').textContent = product.precio;
        //templateCard.querySelector('img').src = product.thumbnailUrl;
        templateCard.querySelector('img').setAttribute('src',product.thumbnailUrl);
        templateCard.querySelector('button').setAttribute('data-id',product.id); 
        const clone = templateCard.cloneNode(true);
        fragment.appendChild(clone);
    });
    cards.appendChild(fragment);
}

const addCart = (e) =>{
    if( e.target.classList.contains('btn-dark') ){
        setCart(e.target.parentElement);
    }
    e.stopPropagation();
}

const setCart = ( obj ) => {
    const product = {
        id: obj.querySelector('.btn-dark').dataset.id,
        title: obj.querySelector('h5').textContent,
        precio: obj.querySelector('p').textContent,
        cantidad:1

    }
    if( cart.hasOwnProperty( product.id ) ){
        product.cantidad = cart[ product.id ].cantidad +1
    }
    cart[product.id] = {...product}
    renderCart();
}

const renderCart = () => { 
    items.innerHTML = '';
    Object.values(cart).forEach( (product) =>  {
        templateCart.querySelector('th').textContent = product.id;
        templateCart.querySelectorAll('td')[0].textContent = product.title;
        templateCart.querySelectorAll('td')[1].textContent = product.cantidad;
        templateCart.querySelector('.btn-info').dataset.id = product.id;
        templateCart.querySelector('.btn-danger').dataset.id = product.id;
        templateCart.querySelector('span').textContent = product.cantidad * product.precio;
        const clone = templateCart.cloneNode(true);
        fragment.appendChild(clone);
    });
    items.appendChild(fragment);
    renderFooter();
    localStorage.setItem('cart',JSON.stringify(cart));
}


const renderFooter = () => {
    footer.innerHTML='';
    if( Object.keys(cart).length === 0 ){
        footer.innerHTML = `<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>`;
        return;
    }
    const nCant = Object.values(cart).reduce( (acc,{cantidad})=>{
        return acc + cantidad;
    },0);
    const nTotal = Object.values(cart).reduce( (acc,{cantidad,precio})=> acc+parseInt(precio,10)*cantidad,0);
    templateFooter.querySelectorAll('td')[0].textContent = nCant;
    templateFooter.querySelector('span').textContent = nTotal;
    const clone = templateFooter.cloneNode(true);
    fragment.appendChild(clone);
    footer.appendChild(fragment);
    const btnEmptyCart = document.getElementById('empty-cart');
    btnEmptyCart.addEventListener('click', () => {
        cart = {};
        renderCart();
    })
}


const btnAction = ( e ) => {
    if( e.target.classList.contains('btn-info') ){
        const product = cart[e.target.dataset.id];
        product.cantidad = cart[e.target.dataset.id].cantidad +1;
        cart[e.target.dataset.id] = {...product};
        renderCart();
    }
    if( e.target.classList.contains('btn-danger') ){
        const product = cart[e.target.dataset.id];
        product.cantidad = cart[e.target.dataset.id].cantidad -1;
        if( product.cantidad === 0  ){
            delete cart[e.target.dataset.id];
        }
        renderCart();
    }
    e.stopPropagation();
}