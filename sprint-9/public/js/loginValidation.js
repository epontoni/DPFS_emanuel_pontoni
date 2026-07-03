window.addEventListener('load', () => {
  const form = document.querySelector('form');
  if (!form) return;

  const email = document.querySelector('input[name="email"]');
  const password = document.querySelector('input[name="password"]');

  form.addEventListener('submit', (e) => {
    let errors = [];

    // Clear previous errors
    document.querySelectorAll('.fe-error').forEach(el => el.remove());

    const showError = (input, msg) => {
      const errDiv = document.createElement('div');
      errDiv.className = 'fe-error';
      errDiv.style.color = '#FF3B30';
      errDiv.style.fontSize = '0.85rem';
      errDiv.style.marginTop = '4px';
      errDiv.innerText = msg;
      input.parentNode.appendChild(errDiv);
      errors.push(msg);
    };

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
      showError(email, 'El email es obligatorio');
    } else if (!emailRegex.test(email.value.trim())) {
      showError(email, 'Debe ingresar un formato de email válido');
    }

    // Password
    if (!password.value.trim()) {
      showError(password, 'La contraseña es obligatoria');
    }

    if (errors.length > 0) {
      e.preventDefault();
    }
  });
});
