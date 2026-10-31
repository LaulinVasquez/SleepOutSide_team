interface Announcement {
  message: string;
  background: string;
  color: string;
}

function isAnnouncement(value: unknown): value is Announcement {
  if (!value || typeof value !== 'object') return false;
  const alert = value as Partial<Announcement>;
  return typeof alert.message === 'string' && alert.message.trim().length > 0 &&
    typeof alert.background === 'string' && typeof alert.color === 'string';
}

export default class Alert {
  constructor(private source = '/json/alerts.json') {}

  async init(main = document.querySelector('main')): Promise<void> {
    if (!main) return;
    try {
      // Announcements are optional: a failed load must not interrupt shopping.
      const response = await fetch(this.source, { cache: 'no-store' });
      if (!response.ok) return;
      const data: unknown = await response.json();
      if (!Array.isArray(data)) return;
      const alerts = data.filter(isAnnouncement);
      main.querySelector('.alert-list')?.remove();
      if (!alerts.length) return;

      const section = document.createElement('section');
      section.className = 'alert-list';
      section.setAttribute('aria-label', 'Announcements');
      for (const alert of alerts) {
        const paragraph = document.createElement('p');
        paragraph.textContent = alert.message;
        paragraph.style.backgroundColor = alert.background;
        paragraph.style.color = alert.color;
        paragraph.style.padding = '1rem';
        section.append(paragraph);
      }
      main.prepend(section);
    } catch (error) {
      console.warn('Announcements could not be loaded.', error);
    }
  }
}
