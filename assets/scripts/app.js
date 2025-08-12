const extensionsList = document.getElementById('extensions-list');
const filtersButtons = document.querySelectorAll('.filters__button');
const root = document.documentElement;
const themeToggle = document.getElementById('nav-toggle');
const themeToggleImg = document.getElementById('nav-toggle-img');

// Globals
let allExtensions = [];
let filteredExtensions = [];

requestAnimationFrame(() => {
  root.classList.remove('disable-transitions');
});

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

const initApp = async () => {
  allExtensions = await fetchExtensionsData();
  filteredExtensions = [...allExtensions];
  renderExtensionsList(filteredExtensions);

  filtersButtons.forEach(button => {
    button.addEventListener('click', async () => {

      root.querySelector('.filters__button--active')?.classList.remove('filters__button--active');

      button.classList.add('filters__button--active');

      const filter = button.dataset.filter;
      filterExtensions(filter);
    });
  });

  darkMode();
}

const filterExtensions = (filter) => {
  if (filter === 'all') {
    filteredExtensions = [...allExtensions];
  } else if (filter === 'active') {
    filteredExtensions = allExtensions.filter(extension => extension.isActive);
  } else if (filter === 'inactive') {
    filteredExtensions = allExtensions.filter(extension => !extension.isActive);
  }

  renderExtensionsList(filteredExtensions);
}

const fetchExtensionsData = async () => {
  try {
    const response = await fetch('./data.json');
    if (!response.ok) throw new Error('Something wrong');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Something wrong:', error);
    return [];
  }
}

const toggleExtensionState = (event) => {
  const extensionId = +event.target.dataset.id;

  allExtensions = allExtensions.map(extension => {
    if (extension.id === extensionId) {
      extension.isActive = !extension.isActive;
    }
    return extension;
  });

  const currentFilter = root.querySelector('.filters__button--active').dataset.filter;
  if (currentFilter !== 'all') {
    filterExtensions(currentFilter);
  }
};

const removeExtension = (event) => {
  const extensionId = +event.target.dataset.id;
  allExtensions = allExtensions.filter(extension => extension.id !== extensionId);

  const currentFilter = root.querySelector('.filters__button--active').dataset.filter;
  filterExtensions(currentFilter);
}

const clearExtensionsList = () => {
  extensionsList.innerHTML = '';
}

const renderExtensionsList = (extensions) => {

  clearExtensionsList();

  extensions.forEach(extension => {

    // Create extension list item
    const li = document.createElement('li');
    li.classList.add('extensions__item');

    // Create extension card
    const card = document.createElement('div');
    card.classList.add('card');

    // Create extension card container
    const cardContainer = document.createElement('div');
    cardContainer.classList.add('card__container');

    // Create extension card content
    const cardContent = document.createElement('div');
    cardContent.classList.add('card__content');

    // Create extension card logo
    const cardLogo = document.createElement('img');
    cardLogo.classList.add('card__logo');
    cardLogo.src = extension.logo;
    cardLogo.alt = extension.name + ' Logo';

    // Create extension card info
    const cardInfo = document.createElement('div');
    cardInfo.classList.add('card__info');

    // Create extension card title
    const cardTitle = document.createElement('h2');
    cardTitle.classList.add('card__title');
    cardTitle.textContent = extension.name;

    // Create extension card description
    const cardDescription = document.createElement('p');
    cardDescription.classList.add('card__description');
    cardDescription.textContent = extension.description;

    // Create extension card footer
    const cardFooter = document.createElement('div');
    cardFooter.classList.add('card__footer');

    // Create extension card button
    const cardButton = document.createElement('button');
    cardButton.classList.add('card__button');
    cardButton.dataset.id = extension.id;
    cardButton.addEventListener("click", removeExtension);
    cardButton.textContent = 'Remove';

    // Create extension card toggle
    const cardToggle = document.createElement('div');
    cardToggle.classList.add('card__toggle', 'toggle');

    // Create extension card toggle input
    const cardToggleInput = document.createElement('input');
    cardToggleInput.classList.add('toggle__input');
    cardToggleInput.dataset.id = extension.id;
    cardToggleInput.addEventListener("change", toggleExtensionState);
    cardToggleInput.type = 'checkbox';
    cardToggleInput.id = extension.id;
    cardToggleInput.checked = extension.isActive;

    // Create extension card toggle label
    const cardToggleLabel = document.createElement('label');
    cardToggleLabel.classList.add('toggle__label');
    cardToggleLabel.htmlFor = extension.id;

    // Append extension card toggle input and label to toggle
    cardToggle.appendChild(cardToggleInput);
    cardToggle.appendChild(cardToggleLabel);

    // Append extension card title and description to info
    cardInfo.appendChild(cardTitle);
    cardInfo.appendChild(cardDescription);

    // Append extension card button and toggle to footer
    cardFooter.appendChild(cardButton);
    cardFooter.appendChild(cardToggle);

    // Append extension card logo and info to content
    cardContent.appendChild(cardLogo);
    cardContent.appendChild(cardInfo);

    // Append extension card content and footer to container
    cardContainer.appendChild(cardContent);
    cardContainer.appendChild(cardFooter);

    // Append extension card container to card
    card.appendChild(cardContainer);

    // Append extension card to list
    li.appendChild(card);

    extensionsList.appendChild(li);
  });
}

const darkMode = () => {
  const savedTheme = localStorage.getItem('theme');
  applyTheme(savedTheme === 'dark');

  themeToggle.addEventListener('click', () => {
    root.classList.add('disable-transitions');

    const isNowDark = !root.classList.contains('dark');
    applyTheme(isNowDark);

    requestAnimationFrame(() => {
      root.classList.remove('disable-transitions');
    });
  });
}

const applyTheme = (isDark) => {
  root.classList.toggle('dark', isDark);

  themeToggleImg.src = isDark
    ? './assets/images/icon-sun.svg'
    : './assets/images/icon-moon.svg';
  themeToggleImg.alt = isDark ? 'Light Mode Icon' : 'Dark Mode Icon';

  localStorage.setItem('theme', isDark ? 'dark' : 'light');
};