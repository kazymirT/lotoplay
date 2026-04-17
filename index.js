 document.addEventListener('DOMContentLoaded', () => {
  const overflow = document.querySelector('.overflow');

  const mobileMenu = document.querySelector('.mobile-menu');
  const burgerIcon = document.querySelector('.burger-menu');
  const btnBurger = document.querySelector('.btn-burger');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  const contactForm = document.querySelector('.contact-form');
  const feedback = document.querySelector('.form-feedback');
  
  const ticketButtons = document.querySelectorAll('.ticket-button');
  const closeButton = document.querySelector('.modal-close');
  const modal = document.querySelector('.modal');

  const setMenuState = (isOpen) => {
    if (btnBurger) {
      btnBurger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    document.body.style.overscrollBehavior = isOpen ? 'none' : '';
  };

  const closeMobileMenu = () => {
    if (mobileMenu) {
      mobileMenu.classList.remove('active');
    }
    if (burgerIcon) {
      burgerIcon.classList.remove('active');
    }
    if (overflow) {
      overflow.classList.remove('active');
    }
    setMenuState(false);
  };

  const showModal = (message) => {
    if (!modal || !overflow) {
      return;
    }
    const messageElement = modal.querySelector('.modal-message');
    if (messageElement) {
      messageElement.textContent = message;
    }
    modal.classList.add('active');
    overflow.classList.add('active');
    document.body.style.overflow = 'hidden';
    document.body.style.overscrollBehavior = 'none';
    modal.focus();
  };

  const closeModal = () => {
    if (!modal || !overflow) {
      return;
    }
    modal.classList.remove('active');
    overflow.classList.remove('active');
    document.body.style.overflow = 'auto';
    document.body.style.overscrollBehavior = '';
  };

  if (btnBurger) {
    btnBurger.addEventListener('click', () => {
      if (mobileMenu) {
        mobileMenu.classList.toggle('active');
      }
      if (mobileMenu && mobileMenu.classList.contains('active')) {
        closeModal();
    }
      if (burgerIcon) {
        burgerIcon.classList.toggle('active');
      }
      if (overflow) {
        overflow.classList.toggle('active');
      }
      setMenuState(mobileMenu?.classList.contains('active'));
    });
  }

  mobileLinks.forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });

  if (overflow) {
    overflow.addEventListener('click', () => {
      console.log('Adding click listener to overflow');
      closeMobileMenu();
      closeModal();
    });
  }

  ticketButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const location = button.dataset.location;
      const datetime = button.dataset.datetime;
      if (!location || !datetime) {
        return;
      }
      showModal(`Ви успішно замовили квиток у ${location} на ${datetime}.`);
    });
  });

  if (closeButton) {
    closeButton.addEventListener('click', closeModal);
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMobileMenu();
      closeModal();
    }
  });

  const isEmailValid = (email) => {
    const trimmed = email.trim();
    return trimmed.includes('@') && trimmed.includes('.') && trimmed.length > 5;
  };

  const showFeedback = (message, type = 'error') => {
    if (!feedback) {
      return;
    }
    feedback.textContent = message;
    feedback.classList.toggle('success', type === 'success');
    feedback.classList.toggle('error', type !== 'success');
  };

  const validateContactForm = () => {
    if (!contactForm) {
      return null;
    }
    const name = contactForm.name?.value.trim() || '';
    const email = contactForm.email?.value.trim() || '';
    const message = contactForm.message?.value.trim() || '';

    if (name.length < 2) {
      showFeedback('Ім’я повинно містити щонайменше 2 символи.');
      return null;
    }
    if (!isEmailValid(email)) {
      showFeedback('Введіть коректний email.');
      return null;
    }
    if (message.length < 10) {
      showFeedback('Повідомлення повинно містити щонайменше 10 символів.');
      return null;
    }

    return { name, email, message };
  };

  const sendContactRequest = async (data) => {
    const url = new URL('https://example.com/booking');
    url.searchParams.set('name', data.name);
    url.searchParams.set('email', data.email);
    url.searchParams.set('message', data.message);

    showFeedback('Надсилаємо дані...', 'success');

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error('Помилка під час відправки');
      }

      showFeedback('Дякуємо! Форма успішно надіслана.', 'success');
      contactForm.reset();
    } catch (error) {
      showFeedback('Сталася помилка. Спробуйте пізніше.');
    }
  };

  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const validData = validateContactForm();
      if (validData) {
        sendContactRequest(validData);
      }
    });
  }
});
  