
import { Category, Product, VaultItem, Inquiry, Order, UsageData } from './types';

const now = new Date().toISOString();

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'ChatGPT Plus',
    description: 'Get access to GPT-4o, DALL-E 3, and advanced data analysis.',
    price: 20.00,
    category: Category.AI,
    image: 'https://picsum.photos/seed/chatgpt/400/300',
    features: ['GPT-4o Access', 'DALL-E 3', 'Faster Response Time'],
    stock: 100,
    createdAt: '2024-01-10T08:00:00.000Z',
    updatedAt: '2024-05-15T14:30:00.000Z'
  },
  {
    id: '2',
    name: 'Claude Pro',
    description: 'Anthropic\'s most powerful model with 200k context window.',
    price: 20.00,
    category: Category.AI,
    image: 'https://picsum.photos/seed/claude/400/300',
    features: ['Claude 3.5 Sonnet', 'High Priority Access', 'Early Beta Features'],
    stock: 50,
    createdAt: '2024-02-15T09:00:00.000Z',
    updatedAt: '2024-06-20T11:20:00.000Z'
  },
  {
    id: '3',
    name: 'Adobe Creative Cloud',
    description: 'Full suite of 20+ desktop and mobile apps including Photoshop.',
    price: 29.99,
    category: Category.DESIGN,
    image: 'https://picsum.photos/seed/adobe/400/300',
    features: ['Photoshop', 'Illustrator', '100GB Cloud Storage'],
    stock: 25,
    createdAt: '2023-11-05T10:00:00.000Z',
    updatedAt: '2024-04-12T16:45:00.000Z'
  },
  {
    id: '4',
    name: 'Canva Pro',
    description: 'Unlock premium content, powerful tools, and magic AI.',
    price: 9.99,
    category: Category.DESIGN,
    image: 'https://picsum.photos/seed/canva/400/300',
    features: ['Magic Resize', 'Premium Content', 'Brand Kit'],
    stock: 200,
    createdAt: '2024-01-20T12:00:00.000Z',
    updatedAt: '2024-05-30T09:15:00.000Z'
  },
  {
    id: '5',
    name: 'Outline VPN Key',
    description: 'Create your own high-speed VPN with ease.',
    price: 5.00,
    category: Category.VPN,
    image: 'https://picsum.photos/seed/vpn/400/300',
    features: ['Unrestricted Access', 'Military Encryption', 'Multi-device'],
    stock: 500,
    createdAt: '2023-12-01T14:00:00.000Z',
    updatedAt: '2024-06-05T10:00:00.000Z'
  },
  {
    id: '6',
    name: 'Cursor Pro',
    description: 'AI-first code editor designed for pair programming with AI.',
    price: 20.00,
    category: Category.DEV,
    image: 'https://picsum.photos/seed/cursor/400/300',
    features: ['Unlimited AI completions', 'Claude 3.5 support', 'Repo-wide indexing'],
    stock: 80,
    createdAt: '2024-03-10T15:00:00.000Z',
    updatedAt: '2024-06-18T13:40:00.000Z'
  }
];

export const MOCK_VAULT_ITEMS: VaultItem[] = [
  {
    id: 'v1',
    productId: '1',
    name: 'ChatGPT Plus',
    image: 'https://picsum.photos/seed/chatgpt/400/300',
    licenseKey: 'SK-NEXUS-7729-XTQ-001',
    purchaseDate: '2024-05-15',
    expiryDate: '2025-05-15',
    status: 'active'
  },
  {
    id: 'v2',
    productId: '5',
    name: 'Outline VPN Key',
    image: 'https://picsum.photos/seed/vpn/400/300',
    licenseKey: 'VPN-NEXUS-PRO-99-ALPHA',
    purchaseDate: '2024-10-01',
    expiryDate: '2024-11-01',
    status: 'expiring-soon'
  }
];

export const MOCK_USAGE_DATA: UsageData[] = [
  {
    productId: '1',
    productName: 'ChatGPT Plus',
    activeUsers: 1450,
    plans: [
      { name: 'Monthly Basic', count: 1200, revenue: 24000 },
      { name: 'Yearly Pro', count: 250, revenue: 45000 }
    ]
  },
  {
    productId: '5',
    productName: 'Outline VPN Key',
    activeUsers: 3820,
    plans: [
      { name: '7-Day Trial', count: 820, revenue: 0 },
      { name: '30-Day Pass', count: 2400, revenue: 12000 },
      { name: 'Lifetime Access', count: 600, revenue: 30000 }
    ]
  },
  {
    productId: '4',
    productName: 'Canva Pro',
    activeUsers: 890,
    plans: [
      { name: 'Single User', count: 700, revenue: 6993 },
      { name: 'Team Plan', count: 190, revenue: 5700 }
    ]
  }
];

export const MOCK_INQUIRIES: Inquiry[] = [
  {
    id: 'inq_1',
    userId: 'u_1',
    userName: 'Aung Kyaw',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aung',
    productId: '1',
    productName: 'ChatGPT Plus',
    price: 20.00,
    senderName: 'AUNG KYAW OO',
    bankName: 'KBZ',
    date: '2024-12-20 10:30 AM',
    status: 'pending'
  },
  {
    id: 'inq_2',
    userId: 'u_2',
    userName: 'May Thazin',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=May',
    productId: '5',
    productName: 'Outline VPN Key',
    price: 5.00,
    senderName: 'MAY THAZIN WIN',
    bankName: 'AYA',
    date: '2024-12-20 11:15 AM',
    status: 'pending'
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-2024-001',
    userId: 'u_1',
    items: [{ ...INITIAL_PRODUCTS[0], quantity: 1 }],
    total: 20.00,
    date: '2024-12-19 04:30 PM',
    status: 'completed'
  },
  {
    id: 'ORD-2024-002',
    userId: 'u_1',
    items: [{ ...INITIAL_PRODUCTS[4], quantity: 1 }],
    total: 5.00,
    date: '2024-12-19 05:45 PM',
    status: 'completed'
  },
  {
    id: 'ORD-2024-003',
    userId: 'u_2',
    items: [{ ...INITIAL_PRODUCTS[2], quantity: 1 }],
    total: 29.99,
    date: '2024-12-20 09:15 AM',
    status: 'completed'
  },
  {
    id: 'ORD-2024-004',
    userId: 'u_3',
    items: [{ ...INITIAL_PRODUCTS[1], quantity: 1 }],
    total: 20.00,
    date: '2024-12-20 11:00 AM',
    status: 'pending'
  }
];
