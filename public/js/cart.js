document.addEventListener('click', function (e) {
  var target = e.target || e.srcElement;
  if (target && target.classList.contains('add-to-cart')) {
    var id = target.getAttribute('data-id');
    var titulo = target.getAttribute('data-titulo');
    var img = target.getAttribute('data-img');

    fetch('/cart/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id, titulo: titulo, img: img })
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data.ok) {
          alert('Agregado al carrito');
          location.reload();
        }
      })
      .catch(function (err) {
        console.error('Error al agregar:', err);
      });
  }
});

document.addEventListener('DOMContentLoaded', function () {
  document.body.addEventListener('click', function (e) {
    var target = e.target || e.srcElement;

    while (target && target !== document.body && !target.classList.contains('remove-btn')) {
      target = target.parentNode;
    }

    if (!target || !target.classList.contains('remove-btn')) return;

    var id = target.getAttribute('data-id');
    if (!id) return;

    target.disabled = true;
    target.textContent = 'Quitando...';

    fetch('/cart/remove', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id })
    })
      .then(function (res) {
        if (!res.ok) throw new Error('Error al borrar en el servidor');
        return res.json();
      })
      .then(function (data) {
        var card = document.getElementById(id);
        if (card) {
          card.parentNode.removeChild(card);
        }

        if (data.cart && data.cart.length === 0) {
          var container = document.querySelector('.space-y-4');
          if (container) {
            container.outerHTML =
              '<div class="alert alert-info shadow-lg">' +
              '<span>Tu carrito está vacío.</span>' +
              '</div>';
          }
        }
      })
      .catch(function (err) {
        console.error(err);
        target.disabled = false;
        target.textContent = 'Quitar';
        alert('No se pudo eliminar el producto.');
      });
  });
});