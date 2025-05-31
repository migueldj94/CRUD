const form =document.getElementById('facturaForm');
const lista  =document.getElementById('listaFacturas');
const totalSpan  =document.getElementById('totalFacturas');

let facturas = [];

const facturasGuardadas = localStorage.getItem('facturas');
if (facturasGuardadas) {
  facturas = JSON.parse(facturasGuardadas);
  actualizarVista();
}

function actualizarVista(){
    lista.innerHTML ='';
    let total = 0;



  facturas.forEach((factura, index) => {
    const div = document.createElement('div');
    div.classList.add('factura');

div.innerHTML = `
  <div>
    <p><strong>Fecha:</strong> ${factura.fecha}</p>
    <p><strong>Valor:</strong> $${factura.valor}</p>
    <button class="editar" data-index="${index}">✏️ Editar</button>
    <button class="eliminar" data-index="${index}">🗑️ Eliminar</button>
  </div>
  <img src="${factura.imagen}" alt="Foto factura">
`;

    lista.appendChild(div);

    // Evento para eliminar
div.querySelector('.eliminar').addEventListener('click', () => {
  facturas.splice(index, 1); // Elimina del array
  actualizarVista(); // Refresca la vista
});

div.querySelector('.editar').addEventListener('click', () => {
  const nuevaFecha = prompt('Nueva fecha:', factura.fecha);
  const nuevoValor = prompt('Nuevo valor:', factura.valor);

  if (nuevaFecha && nuevoValor) {
    facturas[index].fecha = nuevaFecha;
    facturas[index].valor = nuevoValor;
    actualizarVista();
  }
});

    // Sumar al total
    total += parseFloat(factura.valor);
  });

    totalSpan.textContent = total.toFixed(2);

    localStorage.setItem('facturas', JSON.stringify(facturas));
}

form.addEventListener('submit', function (e) {
  e.preventDefault();

    const fecha = document.getElementById('fecha').value;
  const valor = document.getElementById('valor').value;
  const foto = document.getElementById('foto').files[0];

  if (!fecha || !valor || !foto) {
    alert('Por favor, completa todos los campos.');
    return;
  }

    const lector = new FileReader();

  lector.onload = function () {
    const imagenBase64 = lector.result;

    const nuevaFactura = {
      fecha,
      valor,
      imagen: imagenBase64
    };

        // Agregamos la factura a la lista
    facturas.push(nuevaFactura);

    // Limpiamos el formulario
    form.reset();

    // Actualizamos la vista
    actualizarVista();
  };

  lector.readAsDataURL(foto); // Lee la imagen
});