window.addEventListener('load', () => {
  const form = document.querySelector('form.auth-form') || document.querySelector('form');
  if (!form) return;

  const firstName = document.querySelector('input[name="firstName"]');
  const lastName = document.querySelector('input[name="lastName"]');
  const email = document.querySelector('input[name="email"]');
  const password = document.querySelector('input[name="password"]');
  const image = document.querySelector('input[name="image"]');

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

    // First Name
    if (!firstName.value.trim()) {
      showError(firstName, 'El nombre es obligatorio');
    } else if (firstName.value.trim().length < 2) {
      showError(firstName, 'El nombre debe tener al menos 2 caracteres');
    }

    // Last Name
    if (!lastName.value.trim()) {
      showError(lastName, 'El apellido es obligatorio');
    } else if (lastName.value.trim().length < 2) {
      showError(lastName, 'El apellido debe tener al menos 2 caracteres');
    }

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
    } else if (password.value.trim().length < 8) {
      showError(password, 'La contraseña debe tener al menos 8 caracteres');
    }

    // Image
    if (image && image.files && image.files.length > 0) {
      const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
      const fileName = image.files[0].name.toLowerCase();
      const fileExt = fileName.substring(fileName.lastIndexOf('.') + 1);
      if (!allowedExtensions.includes(fileExt)) {
        showError(image, 'Solo se permiten archivos de imagen (JPG, JPEG, PNG, GIF)');
      }
    }

    if (errors.length > 0) {
      e.preventDefault();
    }
  });
});
