// Facts from veon/client.json only (C-B004, C-B005, C-B006, C-B008, C-B009, C-B010, C-B015…C-B020, C-B023, C-B024).
export const SOON = "Розділ у розробці";

export const phoneMain = { href: "tel:+380670002187", label: "+38 (067) 000 21 87", short: "067 000 21 87" };
export const phoneCallback = { href: "tel:+380443344100", label: "+38 (044) 334 41 00" };
export const telegram = "https://t.me/parodentlviv";
export const whatsapp = "https://wa.me/380670002187";
export const instagram = "https://www.instagram.com/parodent.lviv";
export const facebook = "https://www.facebook.com/parodent.dentistry";
export const email = "parodent1@gmail.com";

export const hours = { short: "Пн–Пт 9–20, Сб 9–16", full: "Пн–Пт 9:00–20:00, Сб 9:00–16:00, неділя вихідний" };

const map = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

export interface Clinic { id: string; street: string; address: string; img: string; alt: string; map: string; }
export const clinics: Clinic[] = [
  { id: "clinic-shevchenka", street: "Шевченка", address: "вул. Шевченка, 87А", img: "shevchenka", alt: "Клініка Пародент, вул. Шевченка, 87А, Львів", map: map("Пародент, вул. Шевченка, 87А, Львів") },
  { id: "clinic-lychakivska", street: "Личаківська", address: "вул. Личаківська, 52", img: "lychakivska", alt: "Клініка Пародент, вул. Личаківська, 52, Львів", map: map("Пародент, вул. Личаківська, 52, Львів") },
  { id: "clinic-hlyboka", street: "Глибока", address: "вул. Глибока, 4", img: "hlyboka", alt: "Клініка Пародент, вул. Глибока, 4, Львів", map: map("Пародент, вул. Глибока, 4, Львів") },
  { id: "clinic-skoryka", street: "Скорика", address: "вул. Скорика, 29 (Чайковського)", img: "skoryka", alt: "Клініка Пародент, вул. Скорика, 29, Львів", map: map("Пародент, вул. Скорика, 29, Львів") },
  { id: "clinic-chervonoi-kalyny", street: "Червоної Калини", address: "пр-т Червоної Калини, 85а", img: "chervonoi-kalyny", alt: "Клініка Пародент, пр-т Червоної Калини, 85а, Львів", map: map("Пародент, проспект Червоної Калини, 85а, Львів") },
];

export const directions = [
  "Діагностика", "Рентгенографія", "Гігієна", "Відбілювання", "Терапія", "Ендодонтія",
  "Хірургія", "Пародонтологія", "Ортопедія", "Імплантологія", "Ортодонтія", "Дитяча стоматологія",
];
export const specials = ["апарат Vector", "Cavitron", "центрифугування крові", "фотодинамічна терапія"];

export const prices: { name: string; note?: string; price: string }[] = [
  { name: "Консультація лікаря-стоматолога", price: "550" },
  { name: "Рентгенівський знімок", price: "150" },
  { name: "Анестезія карпульна", price: "190" },
  { name: "Первинне ендолікування одноканального зуба", price: "2 260" },
  { name: "Видалення однокореневого зуба", price: "800" },
  { name: "Імплантат Osstem", note: "перший етап", price: "10 250" },
  { name: "Металева брекет-система на одну щелепу", price: "14 150" },
];

export const guarantees: { name: string; months: number; label: string; note?: string; key?: boolean }[] = [
  { name: "Терапія", months: 12, label: "12 міс." },
  { name: "Ортопедія", months: 12, label: "12 міс.", note: "крім тимчасових пластмасових конструкцій" },
  { name: "Знімне протезування", months: 12, label: "12 міс." },
  { name: "Імплантація", months: 36, label: "3 роки", key: true },
  { name: "Дитяча стоматологія", months: 6, label: "6 міс." },
];

export const insurers = ["УНІКА", "ВУСО", "ARX", "Інго", "ТАС", "Провідна"];

export const equipment: { what: string; brands: string }[] = [
  { what: "Комп’ютерна томографія", brands: "PLANMECA, Sirona, Morita" },
  { what: "Мікроскопи", brands: "LEICA M320, Carl Zeiss" },
  { what: "Пародонтологія", brands: "Vector" },
  { what: "Діодні лазери", brands: "Picasso, Helbo" },
  { what: "П’єзохірургія", brands: "SPARTAN" },
];

export const implantBrands = "ConnectStar, BioHorizons, Straumann, Nobel, Osstem";

export const socials = [
  { name: "Instagram", href: instagram },
  { name: "Facebook", href: facebook },
  { name: "TikTok", href: "https://www.tiktok.com/@parodent" },
  { name: "YouTube", href: "https://www.youtube.com/channel/UCmIJgFjJJ5_uuzxrVbsAF8Q" },
  { name: "Telegram", href: telegram },
];
