// Manejo del formulario de contacto

// Obtiene los elementos del formulario, botón y mensaje de feedback
const form = document.getElementById('form-contacto');
const btn = document.getElementById('btn-enviar');
const msg = document.getElementById('form-msg');

// Evento al enviar el formulario
form.addEventListener('submit', async (e) => {
  e.preventDefault(); // Evita el envío tradicional

  // Obtiene los datos del formulario como objeto
  const data = Object.fromEntries(new FormData(form).entries());
  const errors = [];

  // Validaciones básicas
  if (!data.nombre || data.nombre.trim().length < 2)
    errors.push('Ingresá tu nombre.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email || ''))
    errors.push('Ingresá un email válido.');
  if (!data.mensaje || data.mensaje.trim().length < 5)
    errors.push('Escribí un mensaje.');

  // Si hay errores, muestra mensaje y no envía
  if (errors.length) {
    msg.textContent = 'Revisá el formulario: ' + errors.join(' ');
    msg.style.color = 'crimson';
    return;
  }

  try {
    btn.disabled = true; // Desactiva el botón mientras envía
    msg.textContent = 'Enviando...';

    // Envía los datos a Formspree usando fetch
    const res = await fetch(form.action, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form)
    });

    // Si la respuesta es OK, muestra mensaje de éxito y limpia el formulario
    if (res.ok) {
      form.reset();
      msg.textContent = '¡Gracias! Te contactaremos a la brevedad.';
      msg.style.color = 'seagreen';
    } else {
      // Si hay error, muestra mensaje de error
      const json = await res.json().catch(() => ({}));
      throw new Error(json.error || 'No se pudo enviar el formulario.');
    }
  } catch (err) {
    // Si ocurre un error en el envío, muestra mensaje de error
    msg.textContent = 'Ups, hubo un problema enviando tu consulta. Probá de nuevo más tarde.';
    msg.style.color = 'crimson';
    console.error(err);
  } finally {
    btn.disabled = false; // Reactiva el botón
  }
});