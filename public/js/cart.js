document.addEventListener('click', function(e){
  if (e.target && e.target.matches('.add-to-cart')) {
    const btn = e.target;
    const id = btn.dataset.id;
    const titulo = btn.dataset.titulo;
    const img = btn.dataset.img;
    fetch('/cart/add', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ id, titulo, img })
    }).then(r=>r.json()).then(data=>{
      if (data.ok) {
        alert('Agregado al carrito');
        location.reload();
      }
    });
  }
  if (e.target && e.target.matches('.remove-btn')) {
    const form = e.target.closest('.remove-form');
    const id = form.dataset.id;
    fetch('/cart/remove', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ id })
    }).then(r=>r.json()).then(data=>{
      if (data.ok) location.reload();
    });
  }
});
