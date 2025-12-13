import { Service, Product, Stylist } from './types';

export const SERVICES: Service[] = [
  {
    id: 's1',
    title: '日式單根嫁接',
    price: 1800,
    duration: 90,
    category: 'Lash',
    image: 'https://picsum.photos/id/1027/600/400'
  },
  {
    id: 's2',
    title: '6D 輕奢濃密款',
    price: 2500,
    duration: 120,
    category: 'Lash',
    image: 'https://picsum.photos/id/325/600/400'
  },
  {
    id: 's3',
    title: '角蛋白翹睫術',
    price: 1600,
    duration: 60,
    category: 'Lash',
    image: 'https://picsum.photos/id/64/600/400'
  },
  {
    id: 's4',
    title: '專業眉型設計',
    price: 1200,
    duration: 45,
    category: 'Brow',
    image: 'https://picsum.photos/id/433/600/400'
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Mule 睫毛滋養液',
    price: 1280,
    description: '滋養原生睫毛，促進生長，讓睫毛更強韌健康。',
    image: 'https://picsum.photos/id/21/500/500',
    inStock: true
  },
  {
    id: 'p2',
    name: '溫和泡沫清潔慕斯',
    price: 680,
    description: '專為嫁接睫毛設計的無油配方，溫和潔淨不熏眼。',
    image: 'https://picsum.photos/id/360/500/500',
    inStock: true
  },
  {
    id: 'p3',
    name: '睫毛整理雨衣',
    price: 350,
    description: '維持捲翹度，延長嫁接持久度，日常保養必備。',
    image: 'https://picsum.photos/id/250/500/500',
    inStock: false
  }
];

export const STYLISTS: Stylist[] = [
  {
    id: 'st1',
    name: 'Luna',
    role: '資深美睫師',
    image: 'https://picsum.photos/id/65/200/200',
    rating: 4.9,
    specialties: ['Lash', 'Care'],
    workDays: [1, 2, 3, 4, 5, 6],
    workHours: { start: '10:00', end: '19:00' }
  },
  {
    id: 'st2',
    name: 'Emma',
    role: '首席美睫總監',
    image: 'https://picsum.photos/id/64/200/200',
    rating: 5.0,
    specialties: ['Lash', 'Brow', 'Lip'],
    workDays: [2, 3, 4, 5, 6],
    workHours: { start: '11:00', end: '20:00' }
  }
];

export const AVAILABLE_TIMES = [
  '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'
];