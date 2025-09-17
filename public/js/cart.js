document.addEventListener('click', function (e) {
  if (e.target && e.target.matches('.add-to-cart')) {
    const btn = e.target;
    const id = btn.dataset.id;
    const titulo = btn.dataset.titulo;
    const img = btn.dataset.img;

    fetch('/cart/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, titulo, img }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) {
          alert('Agregado al carrito');
          location.reload();
        }
      });
  }
});
document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', async (e) => {
    const btn = e.target.closest('.remove-btn');
    if (!btn) return;
    const id = btn.dataset.id;
    if (!id) return;
    btn.disabled = true;
    btn.textContent = 'Quitando...';
    try {
      const res = await fetch(`/cart/remove`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Error al borrar en el servidor');
      const data = await res.json();
      const card = document.getElementById(id);
      if (card) card.remove();
      if (data.cart && data.cart.length === 0) {
        const container = document.querySelector('.space-y-4');
        if (container) {
          container.outerHTML = `
            <div class="alert alert-info shadow-lg">
              <span>Tu carrito está vacío.</span>
            </div>
          `;
        }
      }
    } catch (err) {
      console.error(err);
      btn.disabled = false;
      btn.textContent = 'Quitar';
      alert('No se pudo eliminar el producto.');
    }
  });
});
