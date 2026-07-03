window.addEventListener('load', () => {
  const form = document.querySelector('form');
  if (!form) return;

  const name = document.querySelector('input[name="name"]');
  const description = document.querySelector('textarea[name="description"]');
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

    // Name
    if (!name.value.trim()) {
      showError(name, 'El nombre del producto es obligatorio');
    } else if (name.value.trim().length < 5) {
      showError(name, 'El nombre debe tener al menos 5 caracteres');
    }

    // Description
    if (!description.value.trim()) {
      showError(description, 'La descripción es obligatoria');
    } else if (description.value.trim().length < 20) {
      showError(description, 'La descripción debe tener al menos 20 caracteres');
    }

    // Image URL
    if (image && image.value.trim()) {
      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
      const val = image.value.trim().toLowerCase();
      let fileExt = '';
      try {
        const urlPath = new URL(val).pathname;
        fileExt = urlPath.substring(urlPath.lastIndexOf('.'));
      } catch (err) {
        fileExt = val.substring(val.lastIndexOf('.'));
      }
      if (!allowedExtensions.includes(fileExt)) {
        showError(image, 'Solo se permiten formatos de imagen válidos (JPG, JPEG, PNG, GIF)');
      }
    }

    if (errors.length > 0) {
      e.preventDefault();
    }
  });
});
