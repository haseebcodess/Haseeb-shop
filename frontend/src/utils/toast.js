let container = null;
const getContainer = () => {
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  return container;
};
const show = (message, type = 'info', duration = 3500) => {
  const c = getContainer();
  const el = document.createElement('div');
  const icons = { success:'\u2713', error:'\u2715', info:'\u2139' };
  el.className = `toast toast-${type}`;
  el.innerHTML = `<span style="font-size:16px;font-weight:700">${icons[type]}</span><span>${message}</span>`;
  c.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0'; el.style.transform = 'translateX(20px)';
    el.style.transition = 'all 0.3s ease';
    setTimeout(() => el.remove(), 300);
  }, duration);
};
export const toast = {
  success: (msg) => show(msg, 'success'),
  error:   (msg) => show(msg, 'error'),
  info:    (msg) => show(msg, 'info'),
};
